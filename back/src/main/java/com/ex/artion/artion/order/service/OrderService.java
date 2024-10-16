package com.ex.artion.artion.order.service;

import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;
import com.ex.artion.artion.order.dto.OrderCreateDto;
import com.ex.artion.artion.order.entity.OrderEntity;
import com.ex.artion.artion.order.respository.OrderRepostory;
import com.ex.artion.artion.paying.entity.PayingEntity;
import com.ex.artion.artion.paying.repository.PayingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final PayingRepository payingRepository;
    private final OrderRepostory orderRepostory;

    public void save(OrderCreateDto order) {
        PayingEntity paying = payingRepository.findById(order.getPaying_pk()).orElseThrow(()-> new CustomException(ErrorCode.PAYING_NOT_FOUND));
        OrderEntity orderEntity = OrderEntity.builder()
                .paying(paying)
                .address_order(order.getAddress_order())
                .delivery_type(order.getDelivery_type())
                .pay_num(order.getPay_num())
                .build();

        orderRepostory.save(orderEntity);
    }
}
