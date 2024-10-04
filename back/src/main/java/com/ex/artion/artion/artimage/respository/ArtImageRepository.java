package com.ex.artion.artion.artimage.respository;

import com.ex.artion.artion.artimage.entity.ArtImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArtImageRepository extends JpaRepository<ArtImageEntity,Integer> {
}
