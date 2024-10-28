package com.ex.artion.artion.artfollowing.controller;


import com.ex.artion.artion.artfollowing.service.ArtFollowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/artfollowing")
public class ArtFollowingController {

    private final ArtFollowingService artFollowingService;
    @PostMapping("/{artId}")
    public String followingArt (@PathVariable Integer artId){
       return artFollowingService.Followingart(artId);
   }
    @DeleteMapping("/{artId}/unlike")
    public String unlike (@PathVariable Integer artId){
       return artFollowingService.unlikeartfollowing(artId);
    }
}