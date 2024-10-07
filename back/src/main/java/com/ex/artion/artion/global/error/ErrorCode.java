package com.ex.artion.artion.global.error;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,"ACCOUNT-001", "사용자를 찾을 수 없습니다."),
    ART_NOT_FOUND(HttpStatus.NOT_FOUND,"ART-001", "그림을 찾을 수 없습니다.");
    
    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
