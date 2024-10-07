package com.ex.artion.artion.following.respository;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.following.entity.FollowingEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FollowingRepository extends JpaRepository<FollowingEntity,Integer> {

}
