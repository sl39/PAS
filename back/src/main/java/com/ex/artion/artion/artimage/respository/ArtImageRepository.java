package com.ex.artion.artion.artimage.respository;

import com.ex.artion.artion.artimage.entity.ArtImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArtImageRepository extends JpaRepository<ArtImageEntity,Integer> {
    @Query(value = "SELECT * FROM art_image_entity a " +
            "WHERE a.art_entity_art_pk = :art_pk "
            ,nativeQuery = true)
    List<ArtImageEntity> findAllByArtEntity(@Param("art_pk") Integer art_pk);
}
