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
import com.ex.artion.artion.art.dto.ArtDetailResponseDto;
import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.artfollowing.respository.ArtFollowingRepository;
import com.ex.artion.artion.artimage.entity.ArtImageEntity;
import com.ex.artion.artion.artimage.respository.ArtImageRepository;
import com.ex.artion.artion.auction.respository.AuctionRepository;
import com.ex.artion.artion.blacklistuser.entity.BlackListUserEntity;
import com.ex.artion.artion.blacklistuser.repository.BlackListUserRepository;
import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
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


import java.security.Key;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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

    private final ArtFollowingRepository artFollowingRepository;
    private final AuctionRepository auctionRepository;
    private final BlackListUserRepository blackListUserRepository;

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




    public ArtDetailResponseDto getArtDetail(Integer artpk, Integer userPk) {
        Optional<ArtEntity> art = artRepository.findById(artpk);
        if(art.isEmpty()){
            throw new CustomException(ErrorCode.ART_NOT_FOUND);
        }

        Optional<UserEntity> user = userRepository.findById(userPk);
        if(user.isEmpty()){
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
        UserEntity userEntity = user.get();
        ArtEntity artEntity = art.get();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        String start = artEntity.getStartTime().format(formatter);
        String end = artEntity.getEndTime().format(formatter);;

        ArtDetailResponseDto dto = ArtDetailResponseDto.builder()
                .created(artEntity.getCreatedAt())
                .artInfo(artEntity.getArt_info())
                .AuctionState(artEntity.getCurrent_auction_status())
                .endTime(end)
                .startTime(start)
                .maxPrice(artEntity.getMaxP())
                .width(artEntity.getWidth())
                .depth(artEntity.getDepth())
                .length(artEntity.getHeight())
                .artName(artEntity.getArt_name())
                .artistName(artEntity.getPainter())
                .Qurater(artEntity.getQurator())
                .userPk(userEntity.getUser_pk())
                .userName(userEntity.getUser_name())
                .build();

        // 그림 이미지들
        List<ArtImageEntity> images = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());
        List<String> imageUrls = new ArrayList<>();
        for(ArtImageEntity imageEntity : images){
            imageUrls.add(imageEntity.getArt_image_url());
        }
        dto.setArtImages(imageUrls);

        // 그림 팔로윙
        Integer count = artFollowingRepository.countByArtPk(artEntity.getArt_pk());
        dto.setArtFollowingNum(count);

        // 그림의 최대값과 최솟값
        List<Object[]> results = auctionRepository.findMaxPriceAndUserMaxPriceByArtPkAndUserPkNative(artEntity.getArt_pk(), userPk);
        Long maxPrice = null;
        Long userMaxPrice = null;
        for (Object[] result : results) {
            maxPrice = result[0] != null ? ((Number) result[0]).longValue() : null;  // 첫 번째 값 (전체 경매의 최대값)
            userMaxPrice = result[1] != null ? ((Number) result[1]).longValue() : null;  // 두 번째 값 (유저의 입찰 중 최대값)
        }
        dto.setMaxPrice(maxPrice);
        dto.setMyCurrentPrice(userMaxPrice);

        Optional<BlackListUserEntity> blackListUserEntity = blackListUserRepository.findByUserEntityAndArtEntity(userEntity,artEntity);


        // 블랙리스트인지, 블랙리스트 status, 자신의 그림인지
        if(userEntity.getUser_pk() == artEntity.getUserEntity().getUser_pk() || userEntity.getBlack_list_status() == true || blackListUserEntity.isPresent()){
            dto.setIsPossible(false);
        } else {
            dto.setIsPossible(true);
        }
        return dto;

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