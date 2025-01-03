package com.ex.artion.artion.artcategory.respository;

import com.ex.artion.artion.artcategory.entity.ArtArtCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArtArtCategoryRepository extends JpaRepository<ArtArtCategory,Integer> {
    @Query(value = "SELECT * FROM art_art_category a " +
    "where a.art_art_pk = :art_pk "
    ,nativeQuery = true)
    List<ArtArtCategory> findByArtEntity(@Param("art_pk") Integer art_pk);
}