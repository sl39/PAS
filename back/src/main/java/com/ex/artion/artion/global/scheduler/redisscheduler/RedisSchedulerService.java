package com.ex.artion.artion.global.scheduler.redisscheduler;


import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisSchedulerService {
    private final RedisTemplate<String, Object> redisTemplate;

    public void setDate(String key, ArtEntityRedis artEntityRedis) {
        redisTemplate.opsForValue().set(key, artEntityRedis);
    }
    public ArtEntityRedis getData(String key){
        return (ArtEntityRedis)  redisTemplate.opsForValue().get(key);
    }

}