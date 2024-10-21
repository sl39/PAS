package com.ex.artion.artion.global.auth.repository;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.parser.Entity;
import java.util.List;
import java.util.Optional;

@Repository
public interface  AuthRepository extends JpaRepository<UserEntity, Integer> {
    @Query(value = "SELECT * FROM user_entity a " +
            "WHERE a.kakao_pk = :kakao_pk "
            ,nativeQuery = true)
    Optional<UserEntity> findByKakao_pk(String kakao_pk);
}