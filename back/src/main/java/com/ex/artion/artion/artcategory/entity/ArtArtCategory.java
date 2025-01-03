package com.ex.artion.artion.artcategory.entity;

import com.ex.artion.artion.art.entity.ArtEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtArtCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer art_art_category_pk;

    @ManyToOne(cascade = CascadeType.ALL)
    private ArtEntity art;

    @ManyToOne
    private ArtCategoryEntity art_category;
}
