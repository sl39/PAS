package com.ex.artion.artion.global.scheduler;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.auction.respository.AuctionRepository;
import com.ex.artion.artion.paying.repository.PayingRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduledMessageService {
    private final ThreadPoolTaskScheduler threadPoolTaskScheduler;
    private final AuctionRepository auctionRepository;
    private final ArtRepository artRepository;
    private final PayingRepository payingRepository;


    public void task() {
        System.out.println(new Date());
    }
    
    // status == 0 이고 현재 시간이 < 시작시간이면
    public void startTask(ScheduleDto dto) {

        System.out.println("시작");
    }

    // status == 0 이고 현재 시간이 < 종료 시간이면
    public void endTime(){
        System.out.println("죵료");
    }

    // status == 1 이고 end 시간이 < 12시간 + 하는거 보다 작을 경우
    public void acceptAuciotn() {
        System.out.println("낙찰");
    }

    // status

    @PostConstruct
    public void init() {
        List<ArtEntity> arts = artRepository.findAllByCurrentAuctionStatus();
        for (ArtEntity art : arts) {
            if (art.getCurrent_auction_status() == 0 && art.getStartTime().isAfter(LocalDateTime.now())){
                System.out.println(art.getStartTime());
            }

        }

    }

    
    
    public void scheduleTask(){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());  // 현재 시간 설정
        calendar.add(Calendar.SECOND, 1);  // 3초 더함

        Date scheduledTime = calendar.getTime();  // 3초 후의 시간

        threadPoolTaskScheduler.schedule(this::task, scheduledTime);  // 3초 후 작업 예약
        System.out.println("Task scheduled to run at: " + scheduledTime);
    }
}
