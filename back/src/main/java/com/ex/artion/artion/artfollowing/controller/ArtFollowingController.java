package com.ex.artion.artion.artfollowing.controller;


import com.ex.artion.artion.artfollowing.service.ArtFollowingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/artfollowing")
public class ArtFollowingController {
    private final ArtFollowingService artFollowingService;
   @PostMapping("{artId}/artfollowing")
    public String followingArt (@RequestParam Integer userId, @PathVariable Integer artId){
       return artFollowingService.Followingart(userId,artId);
   }
    @DeleteMapping("/{artId}/unlike")
    public String unlike (@RequestParam Integer userId, @PathVariable Integer artId){
       return artFollowingService.unlikeartfollowing(userId,artId);
    }

}
