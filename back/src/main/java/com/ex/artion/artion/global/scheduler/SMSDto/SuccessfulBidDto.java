package com.ex.artion.artion.global.scheduler.SMSDto;


import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SuccessfulBidDto {
    private String art_name;
    private String time;
    private String artPk;
    private String userPk;
    private String phone_number;
}
