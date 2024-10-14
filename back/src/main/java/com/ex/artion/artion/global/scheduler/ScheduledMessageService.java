package com.ex.artion.artion.global.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class ScheduledMessageService {
    private final ThreadPoolTaskScheduler threadPoolTaskScheduler;

    public void task() {
        System.out.println(new Date());
    }
    public void scheduleTask(int i){
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());  // 현재 시간 설정
        calendar.add(Calendar.SECOND, i);  // 3초 더함

        Date scheduledTime = calendar.getTime();  // 3초 후의 시간

        threadPoolTaskScheduler.schedule(this::task, scheduledTime);  // 3초 후 작업 예약
        System.out.println("Task scheduled to run at: " + scheduledTime);
    }
}
