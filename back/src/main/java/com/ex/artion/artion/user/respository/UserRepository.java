package com.ex.artion.artion.user.respository;

import com.ex.artion.artion.art.dto.ArtistSearchResponseDto;
import com.ex.artion.artion.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    @Query(value = "SELECT new com.ex.artion.artion.art.dto.ArtistSearchResponseDto(u.user_name, u.user_pk, '', COALESCE(follow.cnt,0) )  FROM UserEntity as u " +
            "LEFT JOIN (SELECT f.seller.user_pk as following, count(*) as cnt FROM FollowingEntity as f " +
            "GROUP BY f.seller.user_pk) as follow " +
            "ON u.user_pk = follow.following " +
            "WHERE (:keyword IS NULL OR :keyword = '' or u.user_name LIKE %:keyword%) " +
            "ORDER BY follow.cnt DESC " +
            "LIMIT 10")
    List<ArtistSearchResponseDto> findByPainterKeyword(@Param(value = "keyword") String keyword);
}