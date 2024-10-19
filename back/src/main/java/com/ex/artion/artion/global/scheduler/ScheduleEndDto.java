package com.ex.artion.artion.global.scheduler;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ScheduleEndDto {
    private Integer art_pk;
    private LocalDateTime start_time;
    private LocalDateTime end_time;
    private Integer user_pk;
    private Integer paying_pk;
}
