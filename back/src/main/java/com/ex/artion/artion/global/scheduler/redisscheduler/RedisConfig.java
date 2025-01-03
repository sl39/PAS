//package com.ex.artion.artion.global.scheduler.redisscheduler;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
//import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
//import org.springframework.data.redis.serializer.StringRedisSerializer;
//
//@RequiredArgsConstructor
//@Configuration
//@EnableRedisRepositories
//public class RedisConfig {
//    private final RedisProperties redisProperties;
//
//
//
//    // RedisProperties로 yaml에 저장한 host, post를 연결
//    @Bean
//    public RedisConnectionFactory redisConnectionFactory() {
//        return new LettuceConnectionFactory(redisProperties.getHost(), redisProperties.getPort());
//    }
//
//    // serializer 설정으로 redis-cli를 통해 직접 데이터를 조회할 수 있도록 설정
//    @Bean
//    public RedisTemplate<String, Object> redisTemplate() {
//        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
//        redisTemplate.setEnableTransactionSupport(true); // 트랜잭션 지원 가능
//        // class Type 지정
//        redisTemplate.setKeySerializer(new Jackson2JsonRedisSerializer<>(String.class));
//        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(ArtEntityRedis.class));
//        redisTemplate.setConnectionFactory(redisConnectionFactory());
//
//        return redisTemplate;
//    }
//}
