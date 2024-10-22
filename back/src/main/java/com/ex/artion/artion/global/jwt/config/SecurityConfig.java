package com.ex.artion.artion.global.jwt.config;

import com.ex.artion.artion.global.OAuth2SuccessHandler;
import com.ex.artion.artion.global.auth.service.Oauth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final Oauth2UserService oauth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

//    private final KakaoMemberDetailsService kakaoMemberDetailsService;
//
//    // 생성자 주입 방식
//    public SecurityConfig(KakaoMemberDetailsService kakaoMemberDetailsService) {
//        this.kakaoMemberDetailsService = kakaoMemberDetailsService;
//    }
//

    @Bean
    protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> request
                        .requestMatchers(
                                "/",
                                "/api/**",
                                "/oauth2/**",
                                "/login/**",
                                "/error/**",
                                "/kapi/**",
                                "/kakao/**"
                        ).permitAll() // 카카오 콜백 URL 허용
                        .anyRequest().authenticated())

                .oauth2Login(oauth2Login -> oauth2Login
                        .failureUrl("/login/error") // 로그인 실패 시 이동할 경로
                        .defaultSuccessUrl("/login/success")  // 로그인 성공 후 보여줄 URL
                        .userInfoEndpoint(userInfoEndpoint ->
                                userInfoEndpoint
                                        .userService(oauth2UserService)  // 사용자 정보 서비스

                        ).successHandler(oAuth2SuccessHandler)
                );

        return http.build();
    }



    @Bean //cors 에러 잡기 위해서 추가한 것
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000","https://localhost:3000","http://43.202.31.55","http://artion.site","https://artion.site"));
        config.setAllowedMethods(Arrays.asList("HEAD","POST","GET","DELETE","PUT"));
        config.setAllowedHeaders(Arrays.asList("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}





        // 위에서 명시되지 않은 모든 api 요청은 인증된 사용자만 접근 가능
//                .defaultSuccessUrl("/home") // 로그인 성공 후 리다이렉트
//                .failureUrl("/login?error=true"); // 로그인 실패 시 리다이렉트
//            .oauth2Login(withDefaults());

//                .oauth2Login(oauth2Login ->
//                    oauth2Login
//                        .defaultSuccessUrl("/oauth2/loginSuccess")  // 로그인 성공 후 보여줄 URL
//                        .userInfoEndpoint(userInfoEndpoint ->
//                                userInfoEndpoint
//                                        .userService(oauth2UserService)  // 사용자 정보 서비스
//                        )

//                .oauth2Login(oauth2Login -> oauth2Login
//                        .loginPage("/login") // 커스텀 로그인 페이지
//                        .failureUrl("/login?error") // 로그인 실패 시 이동할 경로
//                        .defaultSuccessUrl("/oauth2/loginSuccess")  // 로그인 성공 후 보여줄 URL
//                        .userInfoEndpoint(userInfoEndpoint ->
//                                userInfoEndpoint
//                                        .userService(oauth2UserService)  // 사용자 정보 서비스
//                        )



//    @Bean
//    public OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService() {
//        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
//        return request -> {
//            OAuth2User oAuth2User = delegate.loadUser(request);
//            String accessToken = request.getAccessToken().getTokenValue();
//            // 액세스 토큰을 통해 사용자 정보 가져오기
//            // 필요하면 여기에 사용자 정보 처리 로직 추가
//            return oAuth2User;
//        };
//    }