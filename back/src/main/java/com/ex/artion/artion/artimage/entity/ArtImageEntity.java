package com.ex.artion.artion.artimage.entity;

import com.ex.artion.artion.art.entity.ArtEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class ArtImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer art_image_pk;

    private String art_image_url;

    @ManyToOne(cascade = CascadeType.REMOVE)
    private ArtEntity art_entity;
}
