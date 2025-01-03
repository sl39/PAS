package com.ex.artion.artion.global.scheduler.SMSDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderCompleteDto {
    private String art_name;
    private Long art_price;
    private String order_num;
    private String order_date;
    private String phone_number;
}
