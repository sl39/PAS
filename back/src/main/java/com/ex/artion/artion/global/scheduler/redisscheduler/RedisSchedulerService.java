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
            else if (artEntityRedis.getCurrent_auction_status() == 2){
                PayingEntityRedis payingEntityRedis = payingRedisRepository.findByArt_pk(artEntityRedis.getArt_pk()).orElseGet(()-> null);
                if(payingEntityRedis == null){
                    artRedisRepository.delete(artEntityRedis);
                }

                if(artEntityRedis.getEndTime().isAfter(now) &&artEntityRedis.getEndTime().minusHours(1).isBefore(now) && payingEntityRedis.getStatus() == 0){
                    PayingEntity paying = payingRepository.findById(payingEntityRedis.getPaying_pk()).orElseGet(() -> null);
                    if(paying == null){
                        artRedisRepository.delete(artEntityRedis);
                        payingRedisRepository.delete(payingEntityRedis);
                    }
                    OrderEntity orderEntity = orderRepostory.findByPaying(paying).orElseGet(()-> null);
                    if(orderEntity == null){
                        paying.setStatus(1);
                        payingEntityRedis.setStatus(1);
                        payingRedisRepository.save(payingEntityRedis);
                        payingRepository.save(paying);
                        // 남은 시간 문자 보내기
                    } else {
                        artRedisRepository.delete(artEntityRedis);
                        payingRedisRepository.delete(payingEntityRedis);
                    }

                } else if(artEntityRedis.getEndTime().isBefore(now)){
                    PayingEntity paying = payingRepository.findById(payingEntityRedis.getPaying_pk()).orElseGet(() -> null);
                    if(paying == null){
                        artRedisRepository.delete(artEntityRedis);
                        payingRedisRepository.delete(payingEntityRedis);
                        continue;
                    }
                    OrderEntity orderEntity = orderRepostory.findByPaying(paying).orElseGet(()-> null);
                    if(orderEntity == null){
                        // 메시지 보내기 및 블랙 리스트 등재하기
                        payingRedisRepository.delete(payingEntityRedis);
                        artRedisRepository.delete(artEntityRedis);
                        payingRepository.delete(paying);
                        List<AuctionEntity> auctionEntities = auctionRepository.findAllByArt_pk(artEntityRedis.getArt_pk());
                        auctionRepository.deleteAll(auctionEntities);
                        ArtEntity artEntity = artRepository.findById(artEntityRedis.getArt_pk()).orElseGet(()-> null);
                        if(artEntity != null){
                            artEntity.setCurrent_auction_status(0);
                            artRepository.save(artEntity);
                        }
                    }
                    artRedisRepository.delete(artEntityRedis);
                    payingRedisRepository.delete(payingEntityRedis);
                }
            }

        }
    }


}