package com.ex.artion.artion.global.scheduler.redisscheduler;

import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface PayingRedisRepository extends CrudRepository<PayingEntityRedis, Integer> {
    Optional<PayingEntityRedis> findByArtPk(Integer artId);
}
