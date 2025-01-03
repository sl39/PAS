package com.ex.artion.artion.order.entity;

import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.paying.entity.PayingEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String  order_pk;

    private String address_order;

    private String delivery_type;

    private String imp_uid;

    private String merchant_uid;

    private String name;

    private String phone_number;

    @OneToOne
    private PayingEntity paying;
}
