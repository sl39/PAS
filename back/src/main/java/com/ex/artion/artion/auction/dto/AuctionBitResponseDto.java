package com.ex.artion.artion.auction.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class AuctionBitResponseDto {
    private Long currentPrice;
    private Integer userPk;
    private Integer paying_pk;
}
