package com.ex.artion.artion.global.scheduler;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.auction.respository.AuctionRepository;
import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;
import com.ex.artion.artion.paying.entity.PayingEntity;
import com.ex.artion.artion.paying.repository.PayingRepository;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ScheduledMessageService {
    private final ThreadPoolTaskScheduler threadPoolTaskScheduler;
    private final AuctionRepository auctionRepository;
    private final ArtRepository artRepository;
    private final PayingRepository payingRepository;
    private final UserRepository userRepository;


    // status == 0 이고 현재 시간이 < 시작시간이면
    public void beforeTask(ScheduleDto dto) {
        ZonedDateTime zonedEndTime = dto.getStart_time().atZone(ZoneId.systemDefault());
        Instant instant = zonedEndTime.toInstant();
        threadPoolTaskScheduler.schedule(startTask(dto),instant);  // 3초 후 작업 예약
        System.out.println(dto.getArt_pk() + "여기는 before");
    }

    @Transactional
    // 시작시간 < 현재 시간이 < 종료 시간이면
    public Runnable startTask(ScheduleDto dto) {
        ArtEntity art = artRepository.findById(dto.getArt_pk()).orElseThrow(() -> new CustomException(ErrorCode.ART_NOT_FOUND));
        if(art.getCurrent_auction_status() != 1){
            art.setCurrent_auction_status(1);
            artRepository.save(art);
        }

        System.out.println(dto.getArt_pk() + "여기는 start");
        ZonedDateTime zonedEndTime = dto.getEnd_time().atZone(ZoneId.systemDefault());
        Instant instant = zonedEndTime.toInstant();
        return () -> {
            threadPoolTaskScheduler.schedule(acceptAuction(dto), instant);
        };
    }


    // status == 1 이고 end 시간이 < 12시간 + 하는거 보다 작을 경우
    @Transactional
    public Runnable acceptAuction(ScheduleDto dto) {
        System.out.println(dto.getArt_pk() + "여기는 acceptAuction");
        Optional<AuctionEntity> auction = auctionRepository.findByIdAndMaxPrice(dto.getArt_pk());
        ArtEntity art = artRepository.findById(dto.getArt_pk()).orElseThrow( () -> new CustomException(ErrorCode.ART_NOT_FOUND));
        if(auction.isEmpty()){
            art.setCurrent_auction_status(0);
            artRepository.save(art);

            // 재경매 해야 됨 /////////////////////
            System.out.println("낙찰 되지 않았습니다. 재경매 하십시요");
            return null;
        }
        art.setCurrent_auction_status(2);
        artRepository.save(art);
        UserEntity user = userRepository.findById(auction.get().getBid_user().getUser_pk()).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Optional<PayingEntity> payingEntity = payingRepository.findByAuction(auction.get());
        if(payingEntity.isEmpty()){
            PayingEntity paying = PayingEntity.builder()
                    .auction(auction.get())
                    .build();

            payingRepository.save(paying);
        }

        // 낙찰 메시지 보내기
        // user 받아와서 해야 됨
        Date beforePaying = scheduleTask(art.getEndTime(),11);
        Date afterPaying = scheduleTask(art.getEndTime(),12);
        threadPoolTaskScheduler.schedule(this::beforePaying, beforePaying);
        threadPoolTaskScheduler.schedule(afterPayingTime(dto), afterPaying);
        return null;
    }

    // order 하면
    public void beforePaying (){
        //낙찰된 유저에게 메시지를 보내야 됨
        System.out.println("결제시간까지 1시간 남았습니다 결제를 완료 해주세요");
    }

    @Transactional
    public Runnable afterPayingTime(ScheduleDto dto){
        return () -> {
            System.out.println("결제 완료를 안해서 아웃입니다.");
            // blackList 만들어야 됨
            
            ArtEntity art = artRepository.findById(dto.getArt_pk()).orElseThrow(() -> new CustomException(ErrorCode.ART_NOT_FOUND));
            List<AuctionEntity> auctionEntities = auctionRepository.findAllByArt_pk(art.getArt_pk());
            for (AuctionEntity auc : auctionEntities) {
                payingRepository.deleteAllByAuction(auc);
            }

            auctionRepository.deleteAllByArt_entity(art.getArt_pk());
            art.setCurrent_auction_status(0);
            artRepository.save(art);
        };
    }

    // status

    @PostConstruct
    public void init() {
        List<ArtEntity> arts = artRepository.findAllByCurrentAuctionStatus();
        LocalDateTime now = LocalDateTime.now();
        for (ArtEntity art : arts) {
            ScheduleDto dto = ScheduleDto.builder()
                    .art_pk(art.getArt_pk())
                    .end_time(art.getEndTime())
                    .start_time(art.getStartTime())
                    .build();

            if(art.getStartTime().isAfter(now)){
                beforeTask(dto);
            } else if (art.getEndTime().isAfter(now) && art.getStartTime().isBefore(now)){
                startTask(dto);
            } else if(art.getEndTime().isBefore(now) && (art.getCurrent_auction_status() == 1 || art.getCurrent_auction_status() == 2)){
                // 메시지를 보낸거 분기 1 , 2 를 분기
                acceptAuction(dto);
            }
        }
    }



    public Date scheduleTask(LocalDateTime date, Integer hr) {
        // LocalDateTime을 Date로 변환, Asia/Seoul 시간대 사용
        Date initialDate = Date.from(date.atZone(ZoneId.systemDefault()).toInstant());

        // Calendar 인스턴스 생성 후 Date 설정
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(initialDate);  // LocalDateTime에서 변환된 Date 설정
        calendar.add(Calendar.HOUR, hr);  // 지정된 시간(hr)만큼 더함

        Date scheduledTime = calendar.getTime();  // 지정된 시간 후의 Date 반환
        return scheduledTime;
    }
}
