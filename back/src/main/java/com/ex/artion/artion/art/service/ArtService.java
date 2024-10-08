package com.ex.artion.artion.art.service;

import com.ex.artion.artion.art.dto.ArtDetailResponseDto;
import com.ex.artion.artion.art.dto.ArtSearchKeywordResponseDto;
import com.ex.artion.artion.art.dto.ArtSearchResponseDto;
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
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Key;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ArtService {

    private final ArtRepository artRepository;
    private final UserRepository userRepository;
    private final ArtImageRepository artImageRepository;
    private final ArtFollowingRepository artFollowingRepository;
    private final AuctionRepository auctionRepository;
    private final BlackListUserRepository blackListUserRepository;

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

    public List<ArtSearchResponseDto> getPopular(){
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
                Long auctionPrice = auctionRepository.findMaxPriceByArtPk(art.getArt_pk());
                if(auctionPrice != null && (auctionPrice > price)){
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
                if(auctionPrice != null && (auctionPrice > price)){
                    price = auctionPrice;
                }
                result.setPrice(price);
            }
        }
        return ob;
    }

    public List<ArtSearchKeywordResponseDto> getSearch(String keyword, String category, Long minPrice, Long maxPrice, String sortBy, String sort){
//        List<ArtSearchKeywordResponseDto> ob = new ArrayList<>();
//        if(sortBy.equals("LIKE")) {
//
//        } else if(sortBy.equals("PRICE")){
//
//        } else{
//
//        }

        return artRepository.findAllWithDetails();
    }
}
