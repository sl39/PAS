package com.ex.artion.artion.order.entity;

import com.ex.artion.artion.auction.entity.AuctionEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class OrderEntity {
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private String  order_pk;

    private String address_order;

    private String delivery_type;

    @OneToOne
    private AuctionEntity auction;
}
