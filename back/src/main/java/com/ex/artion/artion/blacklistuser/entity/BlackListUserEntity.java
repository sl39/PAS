package com.ex.artion.artion.blacklistuser.entity;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class BlackListUserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer black_list_user_pk;

    @ManyToOne
    private ArtEntity artEntity;

    @ManyToOne
    private UserEntity userEntity;
}
