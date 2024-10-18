package com.ex.artion.artion.user.controller;


import com.ex.artion.artion.user.dto.UserCreateDto;
import com.ex.artion.artion.user.dto.UserUpdateDto;
import com.ex.artion.artion.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<String> createUser(
            @RequestBody UserCreateDto dto) {
        userService.createUser(dto);
        return ResponseEntity.ok("회원가입 성공!");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(
            @RequestBody UserUpdateDto dto,
            @RequestParam(value = "user_pk") Integer user_pk) {
        userService.updateUser(dto, user_pk);
        return ResponseEntity.ok("회원정보 수정!");
    }

    @PostMapping("/delete")
    public ResponseEntity<String> deleteUser(
            @RequestParam(value = "user_pk") Integer user_pk) {
        userService.deleteUser(user_pk);
        return ResponseEntity.ok("회원가입 해제!");
    }

    @GetMapping("/purbid")
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseBid(
            @RequestParam(value = "user_pk") Integer user_pk) {
        return userService.requestPurchaseBid(user_pk);
    }

    @GetMapping("/pursuc")
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseSuccess(
            @RequestParam(value = "user_pk") Integer user_pk) {
        return userService.requestPurchaseSuccess(user_pk);
    }

    @GetMapping("/purend")
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseEnd(
            @RequestParam(value="user_pk") Integer user_pk) {
        return userService.requestPurchaseEnd(user_pk);
    }

    @GetMapping("/purall")
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseAll(
            @RequestParam(value="user_pk") Integer user_pk) {
        return userService.requestPurchaseAll(user_pk);
    }

    @GetMapping("/salebid")
    public ResponseEntity<List<Map<String, Object>>> requestSaleBid(
            @RequestParam(value = "user_pk") Integer user_pk) {
        return userService.requestSaleBid(user_pk);
    }

    @GetMapping("/salesuc")
    public ResponseEntity<List<Map<String, Object>>> requestSaleSuccess(
            @RequestParam(value = "user_pk") Integer user_pk) {
        return userService.requestSaleSuccess(user_pk);
    }

    @GetMapping("/saleend")
    public ResponseEntity<List<Map<String, Object>>> requestSaleEnd(
            @RequestParam(value = "user_pk") Integer user_pk) {
        return userService.requestSaleEnd(user_pk);
    }

    @GetMapping("/saleall")
    public ResponseEntity<List<Map<String, Object>>> requestSaleAll(
            @RequestParam(value="user_pk") Integer user_pk) {
        return userService.requestSaleAll(user_pk);
    }

    @GetMapping("/myart/{user_pk}")
    public ResponseEntity<Map<String, Object>> myProfile(
            @PathVariable(value = "user_pk") Integer user_pk) {
        return userService.requestMyArt(user_pk);
    }

    @GetMapping("/myp/{user_pk}")
    public ResponseEntity<Map<String, Object>> myProfiles(
            @PathVariable(value = "user_pk") Integer user_pk) {
        return userService.requestMyProfile(user_pk);
    }

    @GetMapping("/mypafs/{user_pk}")
    public ResponseEntity<Map<String, Object>> myProfileAndFollows(
            @PathVariable(value = "user_pk") Integer user_pk) {
        return userService.requestMyProfileAndFollows(user_pk);
    }

    @GetMapping("/artfol/{user_pk}")
    public ResponseEntity<List<Map<String, Object>>> artFollowing(
        @PathVariable(value = "user_pk") Integer user_pk) {
        return userService.requestArtFollowing(user_pk);
    }

    @GetMapping("/fol/{user_pk}")
    public ResponseEntity<List<Map<String, Object>>> Following(
        @PathVariable(value = "user_pk") Integer user_pk) {
        return userService.requestFollowing(user_pk);
    }

    @GetMapping("/myfol/{user_pk}")
    public ResponseEntity<List<Map<String, Object>>> myFollower(
        @PathVariable(value = "user_pk") Integer user_pk) {
        return userService.requestMyFollower(user_pk);
    }
}