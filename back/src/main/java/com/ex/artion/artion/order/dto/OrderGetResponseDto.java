package com.ex.artion.artion.order.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderGetResponseDto {
    private String name;

    private String phone_number;

    private String address_order;

    private String delivery_type;
}
