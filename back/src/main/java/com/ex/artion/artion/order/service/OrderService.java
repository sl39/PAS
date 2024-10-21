package com.ex.artion.artion.order.service;

import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;
import com.ex.artion.artion.global.scheduler.SMSDto.OrderCompleteDto;
import com.ex.artion.artion.global.scheduler.SMSDto.OrderSellingComplete;
import com.ex.artion.artion.global.scheduler.SMSService;
import com.ex.artion.artion.order.dto.OrderCreateDto;
import com.ex.artion.artion.order.entity.OrderEntity;
import com.ex.artion.artion.order.respository.OrderRepostory;
import com.ex.artion.artion.paying.entity.PayingEntity;
import com.ex.artion.artion.paying.repository.PayingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final PayingRepository payingRepository;
    private final OrderRepostory orderRepostory;
    private final SMSService smsService;

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
                .name(order.getName())
                .build();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm");
        String formattedDateTime = now.format(formatter);

        orderRepostory.save(orderEntity);
        OrderCompleteDto dto = OrderCompleteDto.builder()
                .art_price(orderEntity.getPaying().getAuction().getCurrent_price())
                .art_name(orderEntity.getPaying().getAuction().getArt_entity().getArt_name())
                .order_date(formattedDateTime)
                .order_num(order.getMerchant_uid())
                .build();
        OrderSellingComplete dto1 = OrderSellingComplete.builder()
                .art_price(orderEntity.getPaying().getAuction().getCurrent_price())
                .art_name(orderEntity.getPaying().getAuction().getArt_entity().getArt_name())
                .order_date(formattedDateTime)
                .order_num(order.getMerchant_uid())
                .build();


        smsService.orderPaymentComplete(dto);
        smsService.orderSellComplete(dto1);
    }
}
