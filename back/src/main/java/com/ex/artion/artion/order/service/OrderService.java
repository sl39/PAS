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

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final PayingRepository payingRepository;
    private final OrderRepostory orderRepostory;

    public void save(OrderCreateDto order) {

        PayingEntity paying = payingRepository.findById(order.getPaying_pk()).orElseThrow(()-> new CustomException(ErrorCode.PAYING_NOT_FOUND));
        Optional<OrderEntity> orderEntity1 = orderRepostory.findByPaying(paying);
        if (orderEntity1.isPresent()) {
            throw new CustomException(ErrorCode.ORDER_EXIST);
        }
        OrderEntity orderEntity = OrderEntity.builder()
                .paying(paying)
                .address_order(order.getAddress_order())
                .delivery_type(order.getDelivery_type())
                .imp_uid(order.getImp_uid())
                .merchant_uid(order.getMerchant_uid())
                .phone_number(order.getPhone_number())
                .name(order.getPhone_number())
                .build();

        orderRepostory.save(orderEntity);
    }
}
