package com.ex.artion.artion.auction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
public class AuctionBitResponseDto {
    private Long currentPrice;
    private Integer userPk;
}
