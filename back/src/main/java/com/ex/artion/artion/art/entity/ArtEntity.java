package com.ex.artion.artion.art.entity;


import com.ex.artion.artion.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ArtEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer art_pk;

    private String art_name;
    private String art_info;
    private Long minP;
    private Long maxP;
    private Double width;
    private Double depth;
    private Double height;

    private Boolean qurator;
    private String createdAt; // 그림을 만든 날짜
    private LocalDateTime upload; // 그림 등록 날짜
    private String startTime;
    private String endTime;
    private Integer current_auction_status;

    private String painter;



    @ManyToOne
    private UserEntity userEntity;
}
