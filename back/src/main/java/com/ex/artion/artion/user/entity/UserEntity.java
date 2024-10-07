package com.ex.artion.artion.user.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer user_pk;

    private String user_name;

    private String address;

    private String phone_number;

    private String user_cash;

    private Boolean black_list_status;

    private String user_account;

    private String bank_name;

}
