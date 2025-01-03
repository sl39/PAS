package com.ex.artion.artion.paying.entity;

import com.ex.artion.artion.auction.entity.AuctionEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class PayingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paying_pk;

    @CreatedDate
    private LocalDateTime createdAt;

    @OneToOne
    private AuctionEntity auction;
    // 0이면 문자가 안된 상태 1이면 문자가 1개만 간 상태 2이면  끝
    private Integer status;
}
