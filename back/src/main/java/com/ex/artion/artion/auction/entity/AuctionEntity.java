package com.ex.artion.artion.auction.entity;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuctionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer auction_pk;

    private Long current_price;

    @CreatedDate
    private LocalDateTime created_at;

    @ManyToOne
    private ArtEntity art_entity;

    @ManyToOne
    private UserEntity bid_user;

}
