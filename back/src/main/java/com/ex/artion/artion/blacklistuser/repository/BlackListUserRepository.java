package com.ex.artion.artion.blacklistuser.repository;

import com.ex.artion.artion.blacklistuser.entity.BlackListUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlackListUserRepository extends JpaRepository<BlackListUserEntity,Integer> {
}
