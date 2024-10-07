package com.ex.artion.artion.artfollowing.respository;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.artfollowing.entity.ArtFollowingEntity;
import com.ex.artion.artion.following.entity.FollowingEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArtFollowingRepository extends JpaRepository<ArtFollowingEntity,Integer> {
    Optional<ArtFollowingEntity> findByUserEntityAndArtEntity(UserEntity userEntity, ArtEntity artEntity);
    void deleteByUserEntityAndArtEntity(UserEntity userEntity, ArtEntity artEntity);
}
