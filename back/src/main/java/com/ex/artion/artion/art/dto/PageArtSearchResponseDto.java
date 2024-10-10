package com.ex.artion.artion.art.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class PageArtSearchResponseDto {
    private List<ArtSearchKeywordResponseDto> content;
    private Integer page;
    private Integer pageSize;
    private Integer totalPages;
    private Long totalElements;

}
