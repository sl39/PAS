package com.ex.artion.artion.global.auth.controller;

import com.ex.artion.artion.global.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.web.bind.annotation.*;

//@RequestMapping("/api/auth")
@RequestMapping
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final OAuth2AuthorizedClientService authorizedClientService;

    private final AuthService authService;

//    public AuthController(OAuth2AuthorizedClientService authorizedClientService) {
//        this.authorizedClientService = authorizedClientService;
//    }

//    @GetMapping("/kakao/login")
//    public ResponseEntity<?> kakaoLogin() {
//        return ResponseEntity.ok(new AuthDto());
//    }
//
//    @GetMapping("/kakao/info")
//    public Map<String, Object> getKakaoUserInfo(@AuthenticationPrincipal KakaoMemberDetails kakaoMemberDetails) {
//        // KakaoMemberDetails에서 필요한 정보 추출
//
//        String nickname = (String) kakaoMemberDetails.getAttributes().get("profile_nickname");
//        String profileImage = (String) kakaoMemberDetails.getAttributes().get("profile_image");
//        String kakaoId = kakaoMemberDetails.getName();  // 카카오 ID는 getName()으로 가져옴
//
//        return Map.of(
//                "id", kakaoId,
//                "nickname", nickname,
//                "profileImage", profileImage
//        );
//    }
//
//
//    @GetMapping("/oauth/callback/kakao") // 카카오의 임시 redirect uri
//    public Map<String, Object> getCode(@RequestParam String code) {
//        System.out.println("Received code: " + code);
//        Map<String, Object> tokens = authService.getAccessToken(code);
//
//        if (tokens != null) {
//            String accessToken = (String) tokens.get("access_token");
//            System.out.println("Access Token: " + accessToken);
//
//            // 로그인 및 사용자 정보 요청
//            authService.loginWithAccessToken(accessToken);
//        } else {
//            System.out.println("Failed to get access token.");
//        }
//
//        return tokens;
//    }
}
//
//    @GetMapping("/oauth2/loginSuccess")
//    public ResponseEntity<?> loginSuccess(OAuth2AuthenticationToken authentication) {
//        // 인증 객체가 null인지 확인
//        if (authentication == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
//        }
//
//        OAuth2User oAuth2User = authentication.getPrincipal();
//        if (oAuth2User == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("OAuth2User is null");
//        }
//
//        Map<String, Object> attributes = oAuth2User.getAttributes();
//        // 사용자 정보를 가져와서 처리
//        return ResponseEntity.ok(attributes); // 사용자 정보를 반환
//    }