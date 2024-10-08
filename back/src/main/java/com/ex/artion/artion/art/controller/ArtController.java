package com.ex.artion.artion.art.controller;

import com.ex.artion.artion.art.dto.ArtCreateDto;
import com.ex.artion.artion.art.dto.ArtUpdateDto;
import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.service.ArtService;
import com.ex.artion.artion.artcategory.entity.ArtArtCategory;
import com.ex.artion.artion.artcategory.entity.ArtCategoryEntity;
import com.ex.artion.artion.artimage.entity.ArtImageEntity;
import com.ex.artion.artion.user.dto.UserCreateDto;
import com.ex.artion.artion.user.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/art")
@RequiredArgsConstructor
public class ArtController {
    private final ArtService artService;

            @PostMapping("/create")
            public ResponseEntity<String> createArt(
                    @RequestBody ArtCreateDto dto,
                    @RequestParam(value = "user_pk") Integer user_pk) {
                    artService.createArt(dto, user_pk);
                    return ResponseEntity.ok("그림 추가 성공!");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateArt(
            @RequestBody ArtUpdateDto dto,
            @RequestParam(value = "art_pk") Integer art_pk) {
        artService.updateArt(dto, art_pk);
        return ResponseEntity.ok("그림 수정 성공!");
    }

    @PostMapping("/delete")
        public ResponseEntity<String> deleteArt(
         //해당 userId검사 --> 나중에.
         @RequestParam(value = "art_pk") Integer art_pk) {
        artService.deleteArt(art_pk);
        return ResponseEntity.ok("그림 삭제 성공!");
    }

    @PostMapping("/detail")
    public ResponseEntity<Map<String, Object>> detailArt(
            //해당 userId검사 --> 나중에.
            @RequestParam(value = "art_pk") Integer art_pk) {
        artService.artDetail(art_pk);
        return ResponseEntity.ok(artService.artDetail(art_pk));
    }
}