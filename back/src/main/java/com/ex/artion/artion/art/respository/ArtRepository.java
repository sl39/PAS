package com.ex.artion.artion.art.respository;

import com.ex.artion.artion.art.entity.ArtEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArtRepository extends JpaRepository<ArtEntity, Integer> {
    @Query(value = "SELECT * FROM art_entity a " +
            "WHERE a.user_entity_user_pk = :user_pk "
            ,nativeQuery = true)
    List<ArtEntity> findAllByUser_pk(@Param("user_pk") Integer user_pk);
}