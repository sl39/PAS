package com.ex.artion.artion.global.scheduler.redisscheduler;


import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.auction.respository.AuctionRepository;
import com.ex.artion.artion.global.auth.service.AuthService;
import com.ex.artion.artion.order.entity.OrderEntity;
import com.ex.artion.artion.order.respository.OrderRepostory;
import com.ex.artion.artion.paying.entity.PayingEntity;
import com.ex.artion.artion.paying.repository.PayingRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RedisSchedulerService {
    private final ArtRedisRepository artRedisRepository;
    private final ArtRepository artRepository;
    private final AuctionRepository auctionRepository;
    private final PayingRepository payingRepository;
    private final PayingRedisRepository payingRedisRepository;
    private final OrderRepostory orderRepostory;

    @PostConstruct
    public void init(){
        List<ArtEntity> artEntities = artRepository.findAllByCurrentAuctionStatus();
        System.out.println("시작" + artEntities.size());
        List<ArtEntityRedis> lst = new ArrayList<>();
        for(ArtEntity artEntity : artEntities){
            ArtEntityRedis artEntityRedis = ArtEntityRedis.builder()
                    .current_auction_status(artEntity.getCurrent_auction_status())
                    .art_pk(artEntity.getArt_pk())
                    .startTime(artEntity.getStartTime())
                    .endTime(artEntity.getEndTime())
                    .build();
            lst.add(artEntityRedis);
        }
        List<PayingEntityRedis> payingList = payingRepository.findAllWithoutOrder();
        payingRedisRepository.saveAll(payingList);
        artRedisRepository.saveAll(lst);

    }

    @Scheduled(fixedRate = 5000)
    public void schedule(){
        List<ArtEntityRedis> artEntityRedisList = artRedisRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        for(ArtEntityRedis artEntityRedis : artEntityRedisList){
            // 만약에 재 경매를 해야 될 경우 삭제
            if(artEntityRedis.getCurrent_auction_status() == 0 && artEntityRedis.getEndTime().isBefore(now)){
                artRedisRepository.delete(artEntityRedis);
            }

            // 만약 경매시간 사이일 경우(즉 상태가 0이고, 현재시간이 경매 시간일 경우)
            else if((artEntityRedis.getCurrent_auction_status() == 0) && artEntityRedis.getEndTime().isAfter(now) && artEntityRedis.getStartTime().isBefore(now)){
                artEntityRedis.setCurrent_auction_status(1);
                Optional<ArtEntity> art = artRepository.findById(artEntityRedis.getArt_pk());
                if (art.isPresent()) {
                    ArtEntity artEntity = art.get();
                    artEntity.setCurrent_auction_status(1);
                    artEntityRedis.setCurrent_auction_status(1);
                    artRepository.save(artEntity);
                    artRedisRepository.save(artEntityRedis);
                } else {
                    artRedisRepository.delete(artEntityRedis);
                }

            }

            // 경매 시간이 지났으면
            else if((artEntityRedis.getCurrent_auction_status() == 1) &&  artEntityRedis.getEndTime().isBefore(now)){
                Optional<ArtEntity> art = artRepository.findById(artEntityRedis.getArt_pk());
                if (art.isEmpty()) {
                    artRedisRepository.delete(artEntityRedis);
                    continue;
                }
                ArtEntity artEntity = art.get();
                Optional<AuctionEntity> auction = auctionRepository.findMax(artEntityRedis.getArt_pk());
                if(auction.isPresent()){
                    // 입찰이 있으면
                    artEntity.setCurrent_auction_status(2);
                    artEntityRedis.setCurrent_auction_status(2);
                    PayingEntity paying = PayingEntity.builder()
                            .status(0)
                            .auction(auction.get())
                            .build();
                    PayingEntityRedis payingEntityRedis = PayingEntityRedis.builder()
                            .paying_pk(paying.getPaying_pk())
                            .art_pk(artEntity.getArt_pk())
                            .status(0)
                            .build();
                    artEntityRedis.setEndTime(paying.getCreatedAt().plusHours(12));
                    payingRepository.save(paying);
                    payingRedisRepository.save(payingEntityRedis);
                    artRedisRepository.save(artEntityRedis);
                    artRepository.save(artEntity);
                } else {
                    // 입찰이 없으면
                    artRedisRepository.delete(artEntityRedis);
                    artEntity.setCurrent_auction_status(0);
                    artRepository.save(artEntity);
                }


            }
            // status 가2 이고 결제 종료 시간까지 조금 남았을 때 와 끝났을 때  분기 처리
//            else if ((artEntityRedis.getCurrent_auction_status() == 2) &&  artEntityRedis.getEndTime().isAfter(now)){
//                Optional<PayingEntityRedis> paying = payingRedisRepository.findByArt_Id(artEntityRedis.getArt_pk());
//                if(paying.isEmpty()){
//                    artRedisRepository.delete(artEntityRedis);
//                } else{
//                    if(artEntityRedis.getEndTime().minusHours(1).isBefore(now)){
//                        PayingEntityRedis payingEntityRedis = paying.get();
//
//                        // 메시지 보내기
//                        Optional<PayingEntity> pay = payingRepository.findById(payingEntityRedis.getPaying_pk());
//                        if(pay.isPresent()){
//                            PayingEntity payingEntity = pay.get();
//                            payingEntity.setStatus(1);
//                            payingRepository.save(payingEntity);
//                        }
//                        payingRedisRepository.delete(payingEntityRedis);
//                    }
//                }
//            } else if ((artEntityRedis.getCurrent_auction_status() == 2) &&  artEntityRedis.getEndTime().isBefore(now)){
//                Optional<PayingEntityRedis> payingEntityRedis = payingRedisRepository.findByArt_Id(artEntityRedis.getArt_pk());
//                Optional<ArtEntity> artEntity = artRepository.findById(artEntityRedis.getArt_pk());
//                if(artEntity.isEmpty()){
//                    artRedisRepository.delete(artEntityRedis);
//                    continue;
//                }
//                ArtEntity art = artEntity.get();
//                if(payingEntityRedis.isEmpty()){
//                    artRedisRepository.delete(artEntityRedis);
//                    art.setCurrent_auction_status(0);
//                    artRepository.save(art);
//                    continue;
//                }
//
//                Optional<PayingEntity> paying = payingRepository.findById(payingEntityRedis.get().getPaying_pk());
//                if(paying.isEmpty()){
//                    artRedisRepository.delete(artEntityRedis);
//                    art.setCurrent_auction_status(0);
//                    artRepository.save(art);
//                    continue;
//                }
//
//                Optional<OrderEntity> orderEntity = orderRepostory.findByPaying(paying.get());
//                if(orderEntity.isEmpty()){
//                    artRedisRepository.delete(artEntityRedis);
//                    continue;
//                }
//                artRedisRepository.delete(artEntityRedis);
//            }




        }
    }


}