package com.ex.artion.artion.user.controller;


import com.ex.artion.artion.user.dto.UserCreateDto;
import com.ex.artion.artion.user.dto.UserUpdateDto;
import com.ex.artion.artion.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<String> createUser(@RequestBody UserCreateDto dto) {
        return userService.createUser(dto);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UserUpdateDto dto) {
        return userService.updateUser(dto);
    }

    @GetMapping("/update")
    public ResponseEntity<Map<String, Object>> updateBeforeUser() {
        return userService.updateBeforeUser();
    }

//    @PostMapping("/delete")
//    public ResponseEntity<String> deleteUser(
//            @RequestParam(value = "user_pk") Integer user_pk) {
//        userService.deleteUser(user_pk);
//        return ResponseEntity.ok("회원가입 해제!");
//    }

    @GetMapping("/purbid")
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseBid() {
        return userService.requestPurchaseBid();
    }

    @GetMapping("/pursuc")
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseSuccess() {
        return userService.requestPurchaseSuccess();
    }

    @GetMapping("/purend")
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseEnd() {
        return userService.requestPurchaseEnd();
    }

    @GetMapping("/purall")
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseAll() {
        return userService.requestPurchaseAll();
    }

    @GetMapping("/salebid")
    public ResponseEntity<List<Map<String, Object>>> requestSaleBid() {
        return userService.requestSaleBid();
    }

    @GetMapping("/salesuc")
    public ResponseEntity<List<Map<String, Object>>> requestSaleSuccess() {
        return userService.requestSaleSuccess();
    }

    @GetMapping("/saleend")
    public ResponseEntity<List<Map<String, Object>>> requestSaleEnd() {
        return userService.requestSaleEnd();
    }

    @GetMapping("/saleall")
    public ResponseEntity<List<Map<String, Object>>> requestSaleAll() {
        return userService.requestSaleAll();
    }

    @GetMapping("/myart")
    public ResponseEntity<Map<String, Object>> myProfile(@RequestParam(value="user_pk") Integer user_pk) {
        return userService.requestMyArt(user_pk);
    }

    @GetMapping("/myp")
    public ResponseEntity<Map<String, Object>> myProfiles() {
        return userService.requestMyProfile();
    }

    @GetMapping("/mypafs")
    public ResponseEntity<Map<String, Object>> myProfileAndFollows() {
        return userService.requestMyProfileAndFollows();
    }

    @GetMapping("/artfol")
    public ResponseEntity<List<Map<String, Object>>> artFollowing(@RequestParam(value = "user_pk") Integer user_pk) {
        return userService.requestArtFollowing(user_pk);
    }

    @GetMapping("/fol")
    public ResponseEntity<List<Map<String, Object>>> Following(@RequestParam(value = "user_pk") Integer user_pk) {
        return userService.requestFollowing(user_pk);
    }

    @GetMapping("/myfol")
    public ResponseEntity<List<Map<String, Object>>> myFollower(@RequestParam(value = "user_pk") Integer user_pk) {
        return userService.requestMyFollower(user_pk);
    }
}