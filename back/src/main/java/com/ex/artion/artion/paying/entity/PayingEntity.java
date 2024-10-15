package com.ex.artion.artion.paying.entity;

import com.ex.artion.artion.auction.entity.AuctionEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paying_pk;

    private LocalDateTime createdAt;

    @OneToOne
    private AuctionEntity auction;

    private Integer status;
}
