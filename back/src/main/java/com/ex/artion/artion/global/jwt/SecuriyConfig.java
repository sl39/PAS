//package com.ex.artion.artion.global.jwt;
//
//import com.ex.artion.artion.global.OAuth2SuccessHandler;
//import com.ex.artion.artion.global.auth.service.Oauth2UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import java.util.Arrays;
//
//@Configuration
//@EnableWebSecurity
//@RequiredArgsConstructor
//public class SecuriyConfig {
//
//    private final OAuth2SuccessHandler oAuth2SuccessHandler;
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http, Oauth2UserService oauth2UserService) throws Exception {
//        http
//                .formLogin(AbstractHttpConfigurer::disable) // FormLogin 사용X
//                .cors(Customizer.withDefaults())
//                .httpBasic(AbstractHttpConfigurer::disable)// httpBasic 사용X
//                .csrf(AbstractHttpConfigurer::disable) // csrf 보안 사용 X
//                .headers(
//                        headersConfigurer ->
//                                headersConfigurer
//                                        .frameOptions(
//                                                HeadersConfigurer.FrameOptionsConfig::disable
//                                        ))
//                // 세션 사용하지 않으므로 STATELESS 로 설정
//                .sessionManagement(s ->
//                        s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                // url 별 권한 관리 옵션
//                .authorizeHttpRequests(authorizeRequest ->
//                        authorizeRequest
//                                .requestMatchers("/api/**").permitAll()
//                                .anyRequest().authenticated())
//
//                .oauth2Login(oauth2Login -> oauth2Login
//                        .failureUrl("/login/error") // 로그인 실패 시 이동할 경로
//                        .defaultSuccessUrl("/login/success")  // 로그인 성공 후 보여줄 URL
//                        .userInfoEndpoint(userInfoEndpoint ->
//                                userInfoEndpoint
//                                        .userService(oauth2UserService)  // 사용자 정보 서비스
//
//                        ).successHandler(oAuth2SuccessHandler)
//                );
//        ;
//
//        return http.build();
//    }
//    @Bean
//    public CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration config = new CorsConfiguration();
//
//        config.setAllowCredentials(true);
//        config.setAllowedOrigins(Arrays.asList("http://localhost:3000","http://43.202.31.55"));
//        config.setAllowedMethods(Arrays.asList("HEAD","POST","GET","DELETE","PUT"));
//        config.setAllowedHeaders(Arrays.asList("*"));
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", config);
//        return source;
//    }
//}
