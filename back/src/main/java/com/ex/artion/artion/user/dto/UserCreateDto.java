package com.ex.artion.artion.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateDto {
    private String user_name;
    private String address;
    private String phone_number;
    private String user_account;
    private String bank_name;
    private String kakao_pk;
}
