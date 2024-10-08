package com.ex.artion.artion.artcategory.respository;

import com.ex.artion.artion.artcategory.entity.ArtCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ArtCategoryRepository extends JpaRepository<ArtCategoryEntity,Integer> {
    @Query(value = "SELECT * FROM art_category_entity a " +
            "WHERE a.art_category_name = :category "
            ,nativeQuery = true)
    ArtCategoryEntity findIdByArtCategoryName(@Param("category") String category);
}