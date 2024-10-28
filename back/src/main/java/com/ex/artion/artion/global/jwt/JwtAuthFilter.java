package com.ex.artion.artion.global.jwt;

import com.ex.artion.artion.global.auth.service.Oauth2UserService;
import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;
import com.ex.artion.artion.global.error.ErrorResponseEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.ErrorResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final Oauth2UserService userService;
    private final BlacklistRepository blacklistRepository;

    @Value("${jwt.secret_key}")
    private String secretKey;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException
    {
        try {
            Cookie[] cookies = request.getCookies();
            String accessToken = null;

            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("accessToken".equals(cookie.getName())) {
                        accessToken = cookie.getValue();
                        break;
                    }
                }
            }

            jwtTokenProvider.validateJwtToken(accessToken);

            System.out.println("jwt 검증 통과");
//            log.info("jwt 검증 통과");

            // BlackList 확인
            Optional<BlacklistEntity> entity = blacklistRepository.findByToken(accessToken);
            if (entity.isPresent()) {
                throw new CustomException(ErrorCode.RELOGIN_REQUIRED);
            }

            Integer userPk = jwtTokenProvider.getPkFromJwtToken(accessToken);
            UserDetails userDetails = userService.loadUserByPk(userPk);

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(request, response);

        } catch (SignatureException e) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.setContentType("application/json; charset=UTF-8");
            ErrorResponseEntity entity = ErrorResponseEntity.toErrorResponseEntity(ErrorCode.TOKEN_NOT_VALID);
            response.getWriter().write(new ObjectMapper().writeValueAsString(entity));

        } catch (CustomException e) {
            response.setStatus(e.getErrorCode().getHttpStatus().value());
            response.setContentType("application/json; charset=UTF-8");
            ErrorResponseEntity entity = ErrorResponseEntity.toErrorResponseEntity(e.getErrorCode());
            response.getWriter().write(new ObjectMapper().writeValueAsString(entity));
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String[] excludePathList = {
                "/", "/index.html", // 소셜로그인 테스트 페이지
                "/api/socket/**",
                "/api/user/**", // user 관련 pai
                "/api/art/**", // art 관련 api
                "/api/following/**", // following 관련 api
                "/api/artfollowing/**", // artfollowing 관련 api
                "/api/auction/**", // auction 관련 api
                "/api/order/**", // order 관련 api
                "/localhost:3000/api/**"
        };

        AntPathMatcher antPathMatcher = new AntPathMatcher();
        String path = request.getServletPath();

        for(String excludePath : excludePathList) {
            if(antPathMatcher.match(excludePath, path)) {
                return true;
            }
        }

        return false;
    }
}