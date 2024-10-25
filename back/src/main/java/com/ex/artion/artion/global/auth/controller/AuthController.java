package com.ex.artion.artion.global.auth.controller;

import com.ex.artion.artion.global.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

//@RequestMapping("/api/auth")
@RequestMapping
@RestController
@RequiredArgsConstructor
@Controller
public class AuthController {

    @GetMapping("/login")
    public String redirectToKakaoLogin() {
        return "redirect:http://localhost:3000/oauth2/authorization/kakao";
    }
}