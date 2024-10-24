package com.ex.artion.artion.art.service;

import com.ex.artion.artion.art.dto.*;
import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.artcategory.entity.ArtArtCategory;
import com.ex.artion.artion.artcategory.entity.ArtCategoryEntity;
import com.ex.artion.artion.artcategory.respository.ArtArtCategoryRepository;
import com.ex.artion.artion.artcategory.respository.ArtCategoryRepository;
import com.ex.artion.artion.artcategory.service.ArtCategoryService;
import com.ex.artion.artion.artfollowing.entity.ArtFollowingEntity;
import com.ex.artion.artion.artimage.entity.ArtImageEntity;
import com.ex.artion.artion.artimage.respository.ArtImageRepository;
import com.ex.artion.artion.artimage.service.ArtImageService;
import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.global.jwt.UserPrincipal;
import com.ex.artion.artion.order.entity.OrderEntity;
import com.ex.artion.artion.order.respository.OrderRepostory;
import com.ex.artion.artion.paying.entity.PayingEntity;
import com.ex.artion.artion.paying.repository.PayingRepository;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import com.ex.artion.artion.user.service.UserService;
import jakarta.transaction.Transactional;
import com.ex.artion.artion.art.dto.ArtDetailResponseDto;
import com.ex.artion.artion.artfollowing.respository.ArtFollowingRepository;
import com.ex.artion.artion.auction.respository.AuctionRepository;
import com.ex.artion.artion.blacklistuser.entity.BlackListUserEntity;
import com.ex.artion.artion.blacklistuser.repository.BlackListUserRepository;
import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import java.time.format.DateTimeFormatter;

@Slf4j
@RequiredArgsConstructor
@Service
public class ArtService {

    private final ArtRepository artRepository;
    private final UserRepository userRepository;
    private final ArtImageRepository artImageRepository;
    private final ArtCategoryRepository artCategoryRepository;
    private final ArtArtCategoryRepository artArtCategoryRepository;

    private final ArtFollowingRepository artFollowingRepository;
    private final AuctionRepository auctionRepository;
    private final BlackListUserRepository blackListUserRepository;
    private final OrderRepostory orderRepostory;
    private final PayingRepository payingRepository;

    public ResponseEntity<String> createArt(@RequestBody ArtCreateDto dto) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserEntity userEntity = userRepository.findById(userPrincipal.getUserPk()).orElseThrow(() -> new IllegalArgumentException("해당하는 user_pk가 없습니다!"));


//        UserEntity userEntity = userRepository.findById(user_pk).orElseThrow(() -> new IllegalArgumentException("해당하는 user_pk가 없습니다!"));
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

        return ResponseEntity.ok("그림 추가 성공!");
    }

    @Transactional
    public ResponseEntity<String> updateArt(@RequestBody ArtUpdateDto dto, @RequestParam(value = "art_pk") Integer art_pk) {
        ArtEntity art = artRepository.findById(art_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 그림이 없습니다!"));

        if (art.getCurrent_auction_status() == 0) {
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

            List<ArtImageEntity> beforeImages = artImageRepository.findAllByArtEntity(art_pk);
            List<String> imagesToAdd = new ArrayList<>(dto.getArtImage());
            artImageRepository.deleteAll(beforeImages);

            for (String imageUrl : imagesToAdd) {
                ArtImageEntity newImage = new ArtImageEntity();
                newImage.setArt_entity(art);
                newImage.setArt_image_url(imageUrl);
                artImageRepository.save(newImage);
                System.out.println(newImage);
            }

            List<ArtArtCategory> beforeCates = artArtCategoryRepository.findByArtEntity(art_pk);
            artArtCategoryRepository.deleteAll(beforeCates);
            // 입력한 카테고리에 해당하는 카테고리_pk return
            for (String category : dto.getArtCategory()) {
                System.out.println("카테고리" + category);

                ArtCategoryEntity cateId = artCategoryRepository.findIdByArtCategoryName(category);

                System.out.println("카테고리 id" + cateId);
                // 새로운 Cates 추가
                ArtArtCategory newCates = new ArtArtCategory();
                newCates.setArt(art);
                newCates.setArt_category(cateId);
                artArtCategoryRepository.save(newCates);
            }

            artRepository.save(art);

            return ResponseEntity.ok("그림 수정 성공!");
        } else {
            return ResponseEntity.badRequest().body("경매 중 혹은 판매 완료된 그림입니다!");
        }
    }

    public void changedArt(@RequestBody ArtBidDto dto, @RequestParam(value = "art_pk") Integer art_pk) {
        ArtEntity art = artRepository.findById(art_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 그림이 없습니다!"));
        art.setCurrent_auction_status(dto.getCurrent_auction_status());

        artRepository.save(art);
    }

    // 그림 수정전 정보 불러오기
    public ResponseEntity<Map<String, Object>> updateBeforeArt(@RequestParam(value = "art_pk") Integer art_pk) {

        ArtEntity art = artRepository.findById(art_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 그림이 없습니다!"));

        Map<String, Object> result = new HashMap<>();
        List<String> itemImageList = new ArrayList<>();
        List<String> itemCateList = new ArrayList<>();

        result.put("art_name", art.getArt_name());
        result.put("painter", art.getPainter());
        result.put("createdAt", art.getCreatedAt());
        result.put("width", art.getWidth());
        result.put("depth", art.getDepth());
        result.put("height", art.getHeight());
        result.put("startTime", art.getStartTime());
        result.put("endTime", art.getEndTime());
        result.put("minP", art.getMinP());
        result.put("maxP", art.getMaxP());
        result.put("art_info", art.getArt_info());

        List<ArtImageEntity> beforeImages = artImageRepository.findAllByArtEntity(art_pk);

        for (ArtImageEntity artImage : beforeImages) {
            itemImageList.add(artImage.getArt_image_url());
        }

        result.put("artImage", itemImageList);

        List<ArtArtCategory> beforeCates = artArtCategoryRepository.findByArtEntity(art_pk);

        for(ArtArtCategory artCategory : beforeCates) {
            itemCateList.add(artCategory.getArt_category().getArt_category_name());
        }

        result.put("artCategory", itemCateList);

        return ResponseEntity.ok(result);
        }


    // 그림 삭제
    @Transactional
    public void deleteArt(@RequestParam(value = "art_pk") Integer art_pk) {
        ArtEntity art = artRepository.findById(art_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 그림이 없습니다!"));

        if (art.getCurrent_auction_status() == 0) {
            List<ArtImageEntity> beforeImges = artImageRepository.findAllByArtEntity(art_pk);
            List<ArtArtCategory> beforeCates = artArtCategoryRepository.findByArtEntity(art_pk);
            if (beforeImges != null || beforeCates != null) {
                artImageRepository.deleteAll(beforeImges);
                artArtCategoryRepository.deleteAll(beforeCates);
            }
            this.artRepository.delete(art);
        }
    }

    //낙찰된 그림 클릭 시 정보
    public ResponseEntity <Map<String, Object>> orderedArt(@PathVariable(value = "art_pk") Integer art_pk) {
        ArtEntity art = artRepository.findById(art_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 그림이 없습니다!"));
        Map<String, Object> result = new HashMap<>();

        String art_name = art.getArt_name();
        String painter = art.getPainter();
        LocalDate createdAt = art.getCreatedAt();

        // 이거 왜주고 있음? - 아마도 낙찰 가격이 2개라 하나는 경매 시작, 하나는 낙찰 가격인 듯.
        Long minP = art.getMinP();


        //그림 이미지 불러오기
        List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(art.getArt_pk());
        if (!artImage.isEmpty()) {
            String image = String.valueOf(artImage.get(0).getArt_image_url());
            result.put("image", image);
        } else {
            String image = null;
            result.put("image", image);
        }
        //낙찰 가격
        AuctionEntity auction = auctionRepository.findMaxOneByArt_pk(art_pk);
        Long current_price = auction.getCurrent_price();

        //배송 방식
        PayingEntity paying = payingRepository.findOneByAuction_pk(auction.getAuction_pk());
        OrderEntity order = orderRepostory.findOneByPaying_pk(paying.getPaying_pk());
        String delivery = order.getDelivery_type();

        result.put("art_name", art_name);
        result.put("painter", painter);
        result.put("minP", minP);
        result.put("createdAt", createdAt);
        result.put("delivery", delivery);
        result.put("current_price", current_price);

        return ResponseEntity.ok(result);
    }


    public ArtDetailResponseDto getArtDetail(Integer artpk, Integer userPk) {
        Optional<ArtEntity> art = artRepository.findById(artpk);
        if (art.isEmpty()) {
            throw new CustomException(ErrorCode.ART_NOT_FOUND);
        }

        Optional<UserEntity> user = userRepository.findById(userPk);
        if (user.isEmpty()) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
        UserEntity userEntity = user.get();
        ArtEntity artEntity = art.get();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        Double width = Math.round(artEntity.getWidth() * 10) / 10.0;
        Double depth = Math.round(artEntity.getDepth() * 10) / 10.0;
        Double length = Math.round(artEntity.getHeight() * 10) / 10.0;

        String start = artEntity.getStartTime().format(formatter);
        String end = artEntity.getEndTime().format(formatter);
        ArtDetailResponseDto dto = ArtDetailResponseDto.builder()
                .created(artEntity.getCreatedAt())
                .artInfo(artEntity.getArt_info())
                .AuctionState(artEntity.getCurrent_auction_status())
                .uploadAt(artEntity.getUpload())
                .endTime(end)
                .startTime(start)
                .maxPrice(artEntity.getMaxP())
                .width(width)
                .depth(depth)
                .length(length)
                .artName(artEntity.getArt_name())
                .artistName(artEntity.getPainter())
                .Qurater(artEntity.getQurator() != null ? artEntity.getQurator() : false)
                .sellerPk(artEntity.getUserEntity().getUser_pk())
                .sellerName(artEntity.getUserEntity().getUser_name())
                .isArtFollowing(false)
                .build();

        Optional<ArtFollowingEntity> artFollowing = artFollowingRepository.findByUserEntityAndArtEntity(userEntity, artEntity);
        if(artFollowing.isPresent()) {
            dto.setIsArtFollowing(true);
        }

        // 그림 이미지들
        List<ArtImageEntity> images = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());
        List<String> imageUrls = new ArrayList<>();
        for (ArtImageEntity imageEntity : images) {
            imageUrls.add(imageEntity.getArt_image_url());
        }
        dto.setArtImages(imageUrls);

        // 그림 팔로윙
        Integer count = artFollowingRepository.countByArtPk(artEntity.getArt_pk());
        dto.setArtFollowingNum(count);

        // 그림의 최대값과 최솟값
        List<Object[]> results = auctionRepository.findMaxPriceAndUserMaxPriceByArtPkAndUserPkNative(artEntity.getArt_pk(), userPk);
        Long maxPrice = 0L;
        Long userMaxPrice = 0L;
        for (Object[] result : results) {
            maxPrice = result[0] != null ? ((Number) result[0]).longValue() : 0;  // 첫 번째 값 (전체 경매의 최대값)
            userMaxPrice = result[1] != null ? ((Number) result[1]).longValue() : 0;  // 두 번째 값 (유저의 입찰 중 최대값)
        }
        maxPrice = Math.max(artEntity.getMinP(), maxPrice);
        dto.setCurrentPrice(maxPrice);
        dto.setMyCurrentPrice(userMaxPrice);

        Optional<BlackListUserEntity> blackListUserEntity = blackListUserRepository.findByUserEntityAndArtEntity(userEntity, artEntity);

        // 블랙리스트인지, 블랙리스트 status, 자신의 그림인지
        if (userEntity.getUser_pk() == artEntity.getUserEntity().getUser_pk() || userEntity.getBlack_list_status() == true || blackListUserEntity.isPresent()) {
            dto.setIsPossible(false);
        } else {
            dto.setIsPossible(true);
        }
        return dto;
    }

    public List<ArtSearchResponseDto> getPopular() {
        List<ArtSearchResponseDto> ob = artRepository.findAllWithFollowerCount();
        for (ArtSearchResponseDto result : ob) {
            List<ArtImageEntity> images = artImageRepository.findAllByArtEntity(result.getArt_pk());
            ArtEntity art = artRepository.findById(result.getArt_pk()).get();
            if(art == null){
                continue;
            }
            if(!images.isEmpty()){
                result.setArtImage(images.get(0).getArt_image_url());
            }
            if(art.getCurrent_auction_status() == 0){
                result.setPrice(art.getMinP());
            } else  {
                Long price = art.getMinP();
                Long auctionPrice = auctionRepository.findMaxPriceByArtPk(art.getArt_pk()) != null ? auctionRepository.findMaxPriceByArtPk(art.getArt_pk()) : 0 ;
                if(auctionPrice > price){
                    price = auctionPrice;
                }
                result.setPrice(price);
            }
        }
        return ob;

    }

    public List<ArtSearchResponseDto> getRecent() {
        List<ArtSearchResponseDto> ob = artRepository.findAllWithRecent();
        for (ArtSearchResponseDto result : ob) {
            List<ArtImageEntity> images = artImageRepository.findAllByArtEntity(result.getArt_pk());
            ArtEntity art = artRepository.findById(result.getArt_pk()).get();
            if(art == null){
                continue;
            }
            if(!images.isEmpty()){
                result.setArtImage(images.get(0).getArt_image_url());
            }
            if(art.getCurrent_auction_status() == 0){
                result.setPrice(art.getMinP());
            } else  {
                Long price = art.getMinP();
                Long auctionPrice = auctionRepository.findMaxPriceByArtPk(art.getArt_pk());
                if(auctionPrice != null && auctionPrice > price){
                    price = auctionPrice;
                }
                result.setPrice(price);
            }
        }
        return ob;
    }

    public PageArtSearchResponseDto getSearch(String keyword, String category, Long minPrice, Long maxPrice, String sortBy, String sort, Integer page, Integer pageSize){
        Optional<ArtCategoryEntity> artCategory =artCategoryRepository.findByCategoryName(category);
        if(category != null && !category.equals("") && artCategory.isEmpty()){
            throw new CustomException(ErrorCode.ARTCATEGORY_NOT_FOUND);
        }
        if(minPrice > maxPrice){
            throw new CustomException(ErrorCode.MIN_PRICE_MAX_PRICE_NOT_VALID);
        }

        String sortType = "";
        if (sortBy.equals("LIKE")) {
            sortType = "artFollowingNum";
        } else if (sortBy.equals("PRICE")) {
            sortType = "price";
        } else if (sortBy.equals("DATE")) {
            sortType = "a.upload";
        } else {
            throw new CustomException(ErrorCode.SORTEDBY_BAD_REQUEST);
        }
        if (!sort.equals("ASC") && !sort.equals("DESC")) {
            throw new CustomException(ErrorCode.SORT_BAD_REQUEST);
        }

        if(page < 0 ){
            throw new CustomException(ErrorCode.PAGE_BAD_REQUEST);
        }
        if(pageSize < 1){
            throw new CustomException(ErrorCode.PAGESIZE_BAD_REQUEST);
        }



        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(Sort.Direction.fromString(sort),sortType).and(Sort.by("id")));
        Page<ArtSearchKeywordResponseDto> dto = artRepository.findAllWithDetails(keyword,category,minPrice,maxPrice,pageable);
        PageArtSearchResponseDto pages = PageArtSearchResponseDto.builder()
                .content(dto.getContent())
                .totalPages(dto.getTotalPages())
                .totalElements(dto.getTotalElements())
                .pageSize(dto.getSize())
                .page(dto.getNumber())
                .build();
        return pages;
    }

    public List<ArtistSearchResponseDto> getPainter(String keyword) {

        List<ArtistSearchResponseDto> artistSearchResponseDto = userRepository.findByPainterKeyword(keyword);
        return artistSearchResponseDto;
    }
}