package com.ex.artion.artion.global;

import com.ex.artion.artion.global.jwt.JwtTokenProvider;
import com.ex.artion.artion.global.jwt.RefreshTokenEntity;
import com.ex.artion.artion.global.jwt.RefreshTokenRepository;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository tokenRepository;
    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
    private final UserRepository userRepository;

    @Value("${oauth2.success.redirect.isMemberUrl}")
    private String isMemberUrl;

    @Value("${oauth2.success.redirect.isMemberNotUrl}")
    private String notIsMemberUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException
    {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        Long user_pk = Long.parseLong(oauth2User.getName());
        Integer userPk = Integer.parseInt(String.valueOf(oauth2User.getName()));
        UserEntity user = userRepository.findById(userPk).orElse(null);

        System.out.println("로그1" + oauth2User);
        System.out.println("로그 2" + oauth2User.getName());

        // access token, refresh token 발급
        String accessToken = jwtTokenProvider.createAccessToken(user_pk);
        String refreshToken = jwtTokenProvider.createRefreshToken(user_pk);
        log.info("access token : {}", accessToken);
        log.info("refresh token : {}", refreshToken);


        // refreshToken DB에 저장
        RefreshTokenEntity newToken = RefreshTokenEntity.builder()
                .userPk(user_pk)
                .token(refreshToken)
                .build();



        System.out.println("로그 3 : refreshToken 저장? : " + newToken);

        Optional<RefreshTokenEntity> optionalToken = tokenRepository.findByUserPk(user_pk);
        if(optionalToken.isPresent()) {
            RefreshTokenEntity oldToken = optionalToken.get();
            oldToken.setToken(refreshToken);
            tokenRepository.save(oldToken);
            System.out.println("로그 4: 리프레쉬토큰 유효성 검사" + oldToken );
        } else {
            tokenRepository.save(newToken);
            System.out.println("로그 5: 리프레쉬토큰 유효성 검사" + newToken );
        }



        // Response Header 설정
        response.addHeader("Set-Cookie", createCookie("accessToken", accessToken).toString());

        System.out.println("로그 6: 액세스토큰 쿠키 생성 : " + accessToken );

        response.addHeader("Set-Cookie", createCookie("refreshToken", refreshToken).toString());

        System.out.println("로그 7: 리프레쉬토큰 쿠키 생성 : " + refreshToken );


        if(Objects.requireNonNull(user).getAddress() != null && !Objects.requireNonNull(user).getAddress().isEmpty()) {
            System.out.println("기존 유저입니다!");
            redirectStrategy.sendRedirect(request, response, isMemberUrl);
        } else {
            System.out.println("기존 유저가 아닙니다!");
            redirectStrategy.sendRedirect(request, response, notIsMemberUrl);
        }
//        redirectStrategy.sendRedirect(request, response, url);
    }

    private ResponseCookie createCookie(String key, String value) {

        System.out.println("로그 8 :쿠키 생성 ");

        return ResponseCookie.from(key, value)
//                .domain("artion.site")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .build();


    }
}