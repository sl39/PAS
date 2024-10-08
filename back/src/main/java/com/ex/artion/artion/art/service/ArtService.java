package com.ex.artion.artion.art.service;

import com.ex.artion.artion.art.dto.ArtCreateDto;
import com.ex.artion.artion.art.dto.ArtUpdateDto;
import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.artcategory.entity.ArtArtCategory;
import com.ex.artion.artion.artcategory.entity.ArtCategoryEntity;
import com.ex.artion.artion.artcategory.respository.ArtArtCategoryRepository;
import com.ex.artion.artion.artcategory.respository.ArtCategoryRepository;
import com.ex.artion.artion.artcategory.service.ArtCategoryService;
import com.ex.artion.artion.artimage.entity.ArtImageEntity;
import com.ex.artion.artion.artimage.respository.ArtImageRepository;
import com.ex.artion.artion.artimage.service.ArtImageService;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import com.ex.artion.artion.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class ArtService {
    private final ArtRepository artRepository;

    private final UserService userService;
    private final UserRepository userRepository;

    private final ArtImageService artImageService;
    private final ArtImageRepository artImageRepository;

    private final ArtCategoryService artCategoryService;
    private final ArtCategoryRepository artCategoryRepository;
    private final ArtArtCategoryRepository artArtCategoryRepository;

    public void createArt(@RequestBody ArtCreateDto dto, @RequestParam(value = "user_pk") Integer user_pk) {
        UserEntity userEntity = userRepository.findById(user_pk).orElseThrow(() -> new IllegalArgumentException("해당하는 user_pk가 없습니다!"));
        ArtEntity art = new ArtEntity();

        art.setArt_name(dto.getArt_name());
        art.setPainter(dto.getPainter());
        art.setCreatedAt(dto.getCreatedAt());
        art.setWidth(dto.getWidth());
        art.setDepth(dto.getDepth());
        art.setHeight(dto.getHeight());

        art.setStartTime(dto.getStartTime());
        art.setEndTime(dto.getEndTime());
        art.setMinP(dto.getMinP());
        art.setMaxP(dto.getMaxP());
        art.setArt_info(dto.getArt_info());

        art.setUpload(LocalDate.now());

        art.setUserEntity(userEntity);
        art.setQurator(false);
        art.setCurrent_auction_status(0);
        ArtEntity savedArt = artRepository.save(art);

        // 이미지 넣는 거 처리
        for (String imageLists : dto.getArtImage()) {
            ArtImageEntity image = new ArtImageEntity();
            image.setArt_entity(savedArt);
            image.setArt_image_url(imageLists);
            this.artImageRepository.save(image);
        }

        // 입력한 카테고리에 해당하는 pk 반환
        for (String category : dto.getArtCategory()) {
        ArtCategoryEntity cateId = artCategoryRepository.findIdByArtCategoryName(category);

        //art_artCategory에 반환된 값 저장.
        ArtArtCategory artCat = new ArtArtCategory();
        artCat.setArt(savedArt);
        artCat.setArt_category(cateId);
        this.artArtCategoryRepository.save(artCat);
        }
    }

    @Transactional
    public void updateArt(@RequestBody ArtUpdateDto dto, @RequestParam(value = "art_pk") Integer art_pk) {
        ArtEntity art = artRepository.findById(art_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 그림이 없습니다!"));

        art.setArt_name(dto.getArt_name());
        art.setPainter(dto.getPainter());
        art.setCreatedAt(dto.getCreatedAt());
        art.setWidth(dto.getWidth());
        art.setDepth(dto.getDepth());
        art.setHeight(dto.getHeight());

        art.setStartTime(dto.getStartTime());
        art.setEndTime(dto.getEndTime());
        art.setMinP(dto.getMinP());
        art.setMaxP(dto.getMaxP());
        art.setArt_info(dto.getArt_info());

        art.setUpload(LocalDate.now());

        art.setQurator(false);
        art.setCurrent_auction_status(0);

        ArtEntity savedArt = artRepository.save(art);

        List<ArtImageEntity> beforeImages = artImageRepository.findAllByArtEntity(art_pk);
        List<ArtImageEntity> imagesToDelete = new ArrayList<>();
        List<String> imagesToAdd = new ArrayList<>(dto.getArtImage());

        // 이미지 넣는 거 처리
        for (ArtImageEntity existingImage : beforeImages) {
            if (!dto.getArtImage().contains(existingImage.getArt_image_url())) {
                imagesToDelete.add(existingImage);
            } else {
                imagesToAdd.remove(existingImage.getArt_image_url());
            }
        }

        for (String imageUrl : imagesToAdd) {
            ArtImageEntity newImage = new ArtImageEntity();
            newImage.setArt_entity(savedArt);
            newImage.setArt_image_url(imageUrl);
            artImageRepository.save(newImage);
        }

        for (ArtImageEntity imageToDelete : imagesToDelete) {
            artImageRepository.delete(imageToDelete);
        }

        List<ArtArtCategory> beforeCates = artArtCategoryRepository.findByArtEntity(art_pk);
        List<ArtArtCategory> deleteCates = new ArrayList<>(beforeCates);

        // 입력한 카테고리에 해당하는 pk 반환
        for (String category : dto.getArtCategory()) {
            ArtCategoryEntity cateId = artCategoryRepository.findIdByArtCategoryName(category);

            boolean found = false;
            for (ArtArtCategory existingCate : beforeCates) {
                if (existingCate.getArt_category().equals(category)) {
                    found = true;
                    deleteCates.remove(existingCate);
                    break;
                }
            }

            if (!found) {
                // 새로운 Cates 추가
                ArtArtCategory newCates = new ArtArtCategory();
                newCates.setArt(savedArt);
                newCates.setArt_category(cateId);
                artArtCategoryRepository.save(newCates);
            }

            for (ArtArtCategory catesToDelete : deleteCates) {
                artArtCategoryRepository.delete(catesToDelete);
            }
        }
    }

    // 그림 삭제
    public void deleteArt(@RequestParam(value = "art_pk") Integer art_pk) {
        ArtEntity art = artRepository.findById(art_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 그림이 없습니다!"));
        this.artRepository.delete(art);
    }

    // 그림상세보기 -> 인데 userEntity가 첨가된.
    public Map<String, Object> artDetail(@RequestParam(value = "art_pk") Integer art_pk) {
        ArtEntity art = artRepository.findById(art_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 그림이 없습니다!"));

        Map<String, Object> artDetails = new HashMap<>();
        Field[] fields = art.getClass().getDeclaredFields();  // Entity의 모든 필드 가져오기

        for (Field field : fields) {
            field.setAccessible(true);  // private 필드 접근 가능하게 설정
            if(!field.getName().equals("userEntity")) {
                Object value = null;  // 필드 값 가져오기
                try {
                    value = field.get(art);
                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
                if (value != null) {
                    artDetails.put(field.getName(), value);  // 필드명과 값을 맵에 추가
                }
            }
        }
        return artDetails;
    }
}