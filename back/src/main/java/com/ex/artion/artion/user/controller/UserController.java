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
        userService.requestPurchaseBid(user_pk);
        return ResponseEntity.ok(userService.requestPurchaseBid(user_pk));
    }

    @GetMapping("/pursucess")
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseSucess(
            @RequestParam(value = "user_pk") Integer user_pk) {
        userService.requestPurchaseSuceess(user_pk);
        return ResponseEntity.ok(userService.requestPurchaseSuceess(user_pk));
    }
}
//    @GetMapping("/salelists")
//    public ResponseEntity<List<Map<String, Object>>> requestSaleList(
//            @RequestParam(value = "user_pk") Integer user_pk) {
//        userService.requestPurchaseList(user_pk);
//        return ResponseEntity.ok(userService.requestSaleList(user_pk));
//    }