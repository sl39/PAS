package com.ex.artion.artion.global.error;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,"ACCOUNT-001", "사용자를 찾을 수 없습니다."),
    ART_NOT_FOUND(HttpStatus.NOT_FOUND,"ART-001", "그림을 찾을 수 없습니다."),
    ARTCATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND,"ART-002", "카테고리를 찾을 수 없습니다."),
    MIN_PRICE_MAX_PRICE_NOT_VALID(HttpStatus.BAD_REQUEST,"PRICE-001", "최소 가격이 최대 가격 보다 높을 수 없습니다."),
    SORTEDBY_BAD_REQUEST(HttpStatus.BAD_REQUEST,"SORT-001","sortBy 옵션이 잘못되었습니다."),
    SORT_BAD_REQUEST(HttpStatus.BAD_REQUEST,"SORT-002","sort 옵션은 ASC나 DESC만 가능합니다."),
    PAGE_BAD_REQUEST(HttpStatus.BAD_REQUEST,"PAGE-001","PAGE는 0이상 가능합니다"),
    PAGESIZE_BAD_REQUEST(HttpStatus.BAD_REQUEST,"PAGE-001","PAGESIZE는 1이상 가능합니다");


    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
