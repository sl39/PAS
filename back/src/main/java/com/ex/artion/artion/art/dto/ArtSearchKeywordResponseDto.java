package com.ex.artion.artion.art.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ArtSearchKeywordResponseDto {
    private Integer art_pk;
    private String artName;
    private String artistName; // 'artistName'으로 이름 변경
    private String artImage;
    private Integer artFollowingNum;
    private Long price;

    public ArtSearchKeywordResponseDto(Integer art_pk, Number price,String art_name, String painter, Number artFollowingNum) {
        this.art_pk = art_pk;
        this.artName = art_name;
        this.artistName = painter;
        this.artFollowingNum = artFollowingNum.intValue();
        this.price = price.longValue();
        this.artImage = "";
    }
}
