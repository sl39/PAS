package com.ex.artion.artion.global.error;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.ResponseEntity;


@Data
@Builder
public class ErrorResponseEntity {

    private int status;
    private String message;
    private String code;
    private String name;

    public static ResponseEntity<ErrorResponseEntity> toResponseEntity(ErrorCode e){
        return ResponseEntity
                .status(e.getHttpStatus())
                .body(ErrorResponseEntity.builder()
                        .status(e.getHttpStatus().value())
                        .message(e.getMessage())
                        .code(e.getCode())
                        .name(e.name())
                        .build());
    }

    public static ErrorResponseEntity toErrorResponseEntity(ErrorCode e) {
        return ErrorResponseEntity.builder()
                .status(e.getHttpStatus().value())
                .name(e.name())
                .code(e.getCode())
                .message(e.getMessage())
                .build();
    }
}
