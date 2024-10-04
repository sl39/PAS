package com.ex.artion.artion.user.respository;

import com.ex.artion.artion.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
}
