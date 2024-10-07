package com.ex.artion.artion.following.entity;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class FollowingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer following_pk;

    @ManyToOne
    private UserEntity customer;

    @ManyToOne
    private UserEntity seller;
}
