//package com.ex.artion.artion.global.scheduler;
//
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
//
//@Configuration
//public class SchedulerConfig {
//    private static final int POOL_SIZE = 1;
//
//    @Bean
//    public ThreadPoolTaskScheduler threadPoolTaskScheduler() {
//        ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
//        threadPoolTaskScheduler.setPoolSize(POOL_SIZE);
//        threadPoolTaskScheduler.initialize();
//        return threadPoolTaskScheduler;
//    }
//}
