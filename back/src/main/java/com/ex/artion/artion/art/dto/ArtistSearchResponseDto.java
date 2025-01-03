package com.ex.artion.artion.art.dto;


import lombok.*;

@Getter
@Setter
@Builder
public class ArtistSearchResponseDto {
    private String painter_name;
    private Integer painter_pk;
    private String painter_img;
    private Integer painter_following_num;

    public ArtistSearchResponseDto(String painter_name, Integer painter_pk,String painter_img, Number painter_following_num) {
        this.painter_name = painter_name;
        this.painter_pk = painter_pk;
        this.painter_img = painter_img;
        this.painter_following_num = painter_following_num.intValue();

    }
}
