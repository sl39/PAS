package com.ex.artion.artion.art.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class ArtDetailResponseDto {
    private Boolean isPossible;
    private List<String> artImages;
    private Integer artFollowingNum;
    private LocalDate created; // 재작년도
    private Boolean Qurater;
    private String artName;
    private String artistName;
    private String sellerName;
    private Integer sellerPk;
    private Double width;
    private Double depth;
    private Double length;
    private Long maxPrice;
    private Long currentPrice;
    private Long myCurrentPrice;
    private String startTime;
    private String endTime;
    private String artInfo;
    private Integer AuctionState;
    private Boolean isArtFollowing;
}
