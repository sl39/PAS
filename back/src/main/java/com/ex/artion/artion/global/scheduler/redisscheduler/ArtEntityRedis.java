package com.ex.artion.artion.global.scheduler.redisscheduler;

import lombok.*;
import org.springframework.data.annotation.Id;
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

    private String startTime;
    private String endTime;
    private Integer current_auction_status;

}
