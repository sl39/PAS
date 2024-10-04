package com.ex.artion.artion.artcategory.entity;

import com.ex.artion.artion.art.entity.ArtEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ArtArtCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer art_art_category_pk;

    @ManyToOne
    private ArtEntity art;

    @ManyToOne
    private ArtCategoryEntity art_category;
}
