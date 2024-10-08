package com.ex.artion.artion.art.controller;

import com.ex.artion.artion.art.dto.ArtDetailResponseDto;
import com.ex.artion.artion.art.service.ArtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/art")
public class ArtController {

    private final ArtService artService;

    @GetMapping("/detail")
    public ResponseEntity<ArtDetailResponseDto> artDetail(@RequestParam Integer artPk, @RequestParam Integer userPk) {
        return new ResponseEntity<>(artService.getArtDetail(artPk,userPk), HttpStatus.OK);
    }

    @GetMapping()



}
