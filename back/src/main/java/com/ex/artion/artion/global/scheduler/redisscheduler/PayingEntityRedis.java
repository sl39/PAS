package com.ex.artion.artion.global.scheduler.redisscheduler;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash("paying")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Builder
public class PayingEntityRedis {
    @Id
    private Integer paying_pk;

    private Integer status;
    private Integer art_pk;

    public PayingEntityRedis(Integer paying_pk, Integer status, Integer art_pk) {
        this.paying_pk = paying_pk;
        this.status = status;
        this.art_pk = art_pk;
    }

}
