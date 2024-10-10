package com.ex.artion.artion.auction.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
public class AuctionDetailResponseDto {
    private List<String> artImages;
    private Integer artFollowingNum;
    private LocalDate created; // 재작년도
    private Boolean Qurater;
    private String artName;
    private String artistName;
    private String userName;
    private Integer userPk;
    private Double width;
    private Double depth;
    private Double length;
    private Long maxPrice;
    private Long minPrice;
    private Long currentPrice;
    private Long myCurrentPrice;
    private String startTime;
    private String endTime;
    private String artInfo;
    private Integer state;
}
