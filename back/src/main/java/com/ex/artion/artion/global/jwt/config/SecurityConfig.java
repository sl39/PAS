package com.ex.artion.artion.global.jwt.config;

import com.ex.artion.artion.global.OAuth2SuccessHandler;
import com.ex.artion.artion.global.auth.service.Oauth2UserService;
import com.ex.artion.artion.global.jwt.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
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
    private final JwtAuthFilter jwtAuthFilter;


//    public SecurityConfig(Oauth2UserService oauth2UserService,
//                          OAuth2SuccessHandler oAuth2SuccessHandler,
//                          JwtAuthFilter jwtAuthFilter) {
//        this.oauth2UserService = oauth2UserService;
//        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
//        this.jwtAuthFilter = jwtAuthFilter;
//    }

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
                                "/kakao/**",
                                "/kauth"
                        ).permitAll() // 카카오 콜백 URL 허용
                        .anyRequest().authenticated())

                .oauth2Login(oauth2Login -> oauth2Login
                        .failureUrl("/login/error") // 로그인 실패 시 이동할 경로
                        .userInfoEndpoint(userInfoEndpoint ->
                                userInfoEndpoint
                                        .userService(oauth2UserService)  // 사용자 정보 서비스
                        ).successHandler(oAuth2SuccessHandler)
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); // JwtAuthFilter 추가

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