package com.ex.artion.artion.blacklistuser.repository;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.blacklistuser.entity.BlackListUserEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlackListUserRepository extends JpaRepository<BlackListUserEntity,Integer> {


    Optional<BlackListUserEntity> findByUserEntityAndArtEntity(UserEntity userEntity, ArtEntity artEntity);
}
