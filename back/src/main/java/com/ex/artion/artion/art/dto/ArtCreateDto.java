package com.ex.artion.artion.art.dto;

import com.ex.artion.artion.artcategory.entity.ArtCategoryEntity;
import com.ex.artion.artion.artimage.entity.ArtImageEntity;
import com.ex.artion.artion.user.entity.UserEntity;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ArtCreateDto {
    private String art_name;
    private String art_info;
    private Long minP;
    private Long maxP;
    private Double width;
    private Double depth;
    private Double height;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate createdAt; // 그림을 만든 날짜

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    private String painter;

    private List<String> artImage = new ArrayList<>();

    private List<String> artCategory = new ArrayList<>();
}