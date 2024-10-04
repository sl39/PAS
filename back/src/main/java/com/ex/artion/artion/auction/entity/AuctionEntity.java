package com.ex.artion.artion.auction.entity;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class AuctionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer auction_pk;

    private Long current_price;

    private LocalDateTime created_at;

    @ManyToOne
    private ArtEntity art_entity;

    @ManyToOne
    private UserEntity bid_user;

}
