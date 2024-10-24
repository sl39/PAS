package com.ex.artion.artion.global.scheduler.redisscheduler;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;

@RedisHash("art_status")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class ArtEntityRedis {

    @Id
    private Integer art_pk;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer current_auction_status;

}
