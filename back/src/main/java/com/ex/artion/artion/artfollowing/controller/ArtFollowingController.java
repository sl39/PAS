package com.ex.artion.artion.artfollowing.controller;


import com.ex.artion.artion.artfollowing.service.ArtFollowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/artfollowing")
public class ArtFollowingController {
    private final ArtFollowingService artFollowingService;
    @PostMapping("/{artId}/{userId}")
    public String followingArt (@PathVariable Integer userId, @PathVariable Integer artId){
       return artFollowingService.Followingart(userId,artId);
   }
    @DeleteMapping("/{artId}/{userId}/unlike")
    public String unlike (@PathVariable Integer userId, @PathVariable Integer artId){
       return artFollowingService.unlikeartfollowing(userId,artId);
    }
}
