package com.ex.artion.artion.global.scheduler.redisscheduler;


import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisSchedulerService {
    private final RedisTemplate<String, Object> redisTemplate;

}