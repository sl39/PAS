package com.ex.artion.artion.artcategory.respository;

import com.ex.artion.artion.artcategory.entity.ArtCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtCategoryRepository extends JpaRepository<ArtCategoryEntity,Integer> {
}
