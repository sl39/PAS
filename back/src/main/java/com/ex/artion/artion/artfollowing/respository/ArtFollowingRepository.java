package com.ex.artion.artion.artfollowing.respository;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.artfollowing.entity.ArtFollowingEntity;
import com.ex.artion.artion.following.entity.FollowingEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ArtFollowingRepository extends JpaRepository<ArtFollowingEntity,Integer> {

    @Query(value = "SELECT COUNT(*) " +
            "FROM art_following_entity " +
            "WHERE art_entity_art_pk = :art_pk"
        ,nativeQuery = true
    )
    Integer countByArtPk(@Param("art_pk") Integer art_pk);
    Optional<ArtFollowingEntity> findByUserEntityAndArtEntity(UserEntity userEntity, ArtEntity artEntity);
    void deleteByUserEntityAndArtEntity(UserEntity userEntity, ArtEntity artEntity);
}
