package com.ex.artion.artion.following.controller;

import com.ex.artion.artion.following.entity.FollowingEntity;
import com.ex.artion.artion.following.respository.FollowingRepository;
import com.ex.artion.artion.following.service.FollowingService;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/following")
@RequiredArgsConstructor
public class FollowingController {
    private final FollowingService followingService;
    private final UserService userService;
    @PostMapping("/follow/{sellerId}")
    public String follow (@PathVariable Integer sellerId) {
        UserEntity seller = userService.searchUser(sellerId);
        followingService.follow(seller);
        return "success";
    }
    @DeleteMapping("/unfollow/{sellerId}")
    public String unfollow (@PathVariable Integer sellerId) {
        UserEntity seller = userService.searchUser(sellerId);
        followingService.unfollow(seller);
        return "unfollow";
    }
    @GetMapping("/{customerId}")
    public List<FollowingEntity> getFollowings(@PathVariable Integer customerId) {
        UserEntity customer = userService.searchUser(customerId);
        return followingService.getFollowingsByCustomer(customer);
    }

    @GetMapping("/{sellerId}/followers")
    public List<FollowingEntity> getFollowers(@PathVariable Integer sellerId) {
        UserEntity seller = userService.searchUser(sellerId);
        return followingService.getFollowingsBySeller(seller);
    }
}
