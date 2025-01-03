package com.ex.artion.artion.global.jwt;
import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
@Slf4j
@Component
public class JwtTokenProvider {
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 60 * 60 * 1000L; //1시간
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000L; //7일

    private final Key key;

    public JwtTokenProvider(@Value("${jwt.secret_key}") String secretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /*
     *       정보 -> 토큰
     * */

    // header "alg" : "HS256"
    // payload "sub" : "1"
    // payload "role" : "ROLE_OWNER"
    // payload "exp" : 149283812

    public String createAccessToken(Long pk) {
        Claims claims = Jwts.claims().setSubject(pk.toString());
        Date now = new Date();
        log.info("현재 시간 : {}", now);
        log.info("토큰 만료 시간 : {}", new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME));
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(new Date(now.getTime() + ACCESS_TOKEN_EXPIRE_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String createRefreshToken(Long pk) {
        Claims claims = Jwts.claims().setSubject(pk.toString());
        Date now = new Date();
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(new Date(now.getTime() + REFRESH_TOKEN_EXPIRE_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /*
     *       토큰 -> 정보
     * */

    public Integer getPkFromJwtToken(String token) {
        try {
            return Integer.parseInt(Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject());
        } catch (Exception e) {
            throw new CustomException(ErrorCode.TOKEN_NOT_VALID);
        }
    }
//
//    public String getRoleFromJwtToken(String token) {
//        try {
//            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().get("role", String.class);
//        } catch (Exception e) {
//            throw new CustomException(ErrorCode.TOKEN_NOT_VALID);
//        }
//    }

    public boolean validateJwtToken(String token) throws CustomException {
        try {
            // parseClaimsJws() 부분에서 유효기간 검증 알아서 해준다
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        throw new CustomException(ErrorCode.TOKEN_NOT_VALID);
    }
}