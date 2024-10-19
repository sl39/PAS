package com.ex.artion.artion.artfollowing.entity;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "art_following_entity",uniqueConstraints = {
        @UniqueConstraint(name = "likes_uk",
                columnNames = {"art_entity_art_pk", "user_entity_user_pk"})
})
public class ArtFollowingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer art_following_pk;

    @ManyToOne
    private UserEntity userEntity;

    @ManyToOne
    private ArtEntity artEntity;
}
