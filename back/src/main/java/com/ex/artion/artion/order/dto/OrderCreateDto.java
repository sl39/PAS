package com.ex.artion.artion.order.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderCreateDto {
    private String address_order;

    private String delivery_type;

    private String pay_num;

    private Integer paying_pk;
}
