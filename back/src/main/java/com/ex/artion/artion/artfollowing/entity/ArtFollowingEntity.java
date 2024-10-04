package com.ex.artion.artion.artfollowing.entity;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
public class ArtFollowingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer art_following_pk;

    @ManyToOne
    private UserEntity userEntity;

    @ManyToOne
    private ArtEntity artEntity;
}
