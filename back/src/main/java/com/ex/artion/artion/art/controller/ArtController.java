package com.ex.artion.artion.art.controller;

import com.ex.artion.artion.art.dto.ArtDetailResponseDto;
import com.ex.artion.artion.art.dto.ArtSearchKeywordResponseDto;
import com.ex.artion.artion.art.dto.ArtSearchResponseDto;
import com.ex.artion.artion.art.service.ArtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/art")
public class ArtController {

    private final ArtService artService;

    @GetMapping("/detail")
    public ResponseEntity<ArtDetailResponseDto> artDetail(@RequestParam Integer artPk, @RequestParam Integer userPk) {
        return new ResponseEntity<>(artService.getArtDetail(artPk,userPk), HttpStatus.OK);
    }

    @GetMapping("/main/popular")
    public ResponseEntity<List<ArtSearchResponseDto>> getPopular() {
        return new ResponseEntity<>(artService.getPopular(), HttpStatus.OK);
    }
    @GetMapping("/main/recent")
    public ResponseEntity<List<ArtSearchResponseDto>> getRecent() {
        return new ResponseEntity<>(artService.getRecent(), HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ArtSearchKeywordResponseDto>> getSearch(
            @RequestParam(value = "keyword", defaultValue = "") String keyword,
            @RequestParam(value = "category", defaultValue = "") String category,
            @RequestParam(value = "minPrice", defaultValue = "0") Long minPrice,
            @RequestParam(value = "maxPrice", defaultValue =  "2036854000000") Long maxPrice,
            @RequestParam(value = "sortBy", defaultValue = "LIKE") String sortBy,
            @RequestParam(value = "sort", defaultValue = "DESC") String sort,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "pageSize", defaultValue = "10") Integer pageSize
            ) {

        return new ResponseEntity<>(artService.getSearch(keyword,category,minPrice,maxPrice,sortBy,sort,page,pageSize), HttpStatus.OK);
    }

}
