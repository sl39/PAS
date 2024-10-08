package com.ex.artion.artion.artfollowing.respository;

import com.ex.artion.artion.artfollowing.entity.ArtFollowingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ArtFollowingRepository extends JpaRepository<ArtFollowingEntity,Integer> {

    @Query(value = "SELECT COUNT(*) " +
            "FROM art_following_entity " +
            "WHERE art_entity_art_pk = :art_pk"
        ,nativeQuery = true
    )
    Integer countByArtPk(@Param("art_pk") Integer art_pk);
}
