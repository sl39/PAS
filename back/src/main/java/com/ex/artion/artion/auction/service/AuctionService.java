package com.ex.artion.artion.auction.service;

import com.ex.artion.artion.art.dto.ArtDetailResponseDto;
import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.artfollowing.respository.ArtFollowingRepository;
import com.ex.artion.artion.artimage.entity.ArtImageEntity;
import com.ex.artion.artion.artimage.respository.ArtImageRepository;
import com.ex.artion.artion.auction.dto.AuctionBitRequestDto;
import com.ex.artion.artion.auction.dto.AuctionBitResponseDto;
import com.ex.artion.artion.auction.dto.AuctionDetailResponseDto;
import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.auction.respository.AuctionRepository;
import com.ex.artion.artion.blacklistuser.entity.BlackListUserEntity;
import com.ex.artion.artion.blacklistuser.repository.BlackListUserRepository;
import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;
import com.ex.artion.artion.order.entity.OrderEntity;
import com.ex.artion.artion.order.respository.OrderRepostory;
import com.ex.artion.artion.paying.entity.PayingEntity;
import com.ex.artion.artion.paying.repository.PayingRepository;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuctionService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ArtRepository artRepository;
    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
    private final ArtImageRepository artImageRepository;
    private final ArtFollowingRepository artFollowingRepository;
    private final BlackListUserRepository blackListUserRepository;
    private final PayingRepository payingRepository;
    private final OrderRepostory orderRepostory;


    public AuctionBitResponseDto updateBid(Integer artPk, AuctionBitRequestDto auctionBitRequestDto){
        ArtEntity artEntity = artRepository.findById(artPk)
                .orElseThrow(()-> new CustomException(ErrorCode.ART_NOT_FOUND));
        UserEntity userEntity = userRepository.findById(auctionBitRequestDto.getUserPk())
                .orElseThrow(()-> new CustomException(ErrorCode.USER_NOT_FOUND));

        if(userEntity.getUser_pk() == artEntity.getUserEntity().getUser_pk()){
            throw new CustomException(ErrorCode.AUCTION_USER_BAD_REQUEST);
        }

        LocalDateTime now = LocalDateTime.now();
        if((artEntity.getStartTime().isAfter(now)) || (artEntity.getEndTime().isBefore(now))|| (artEntity.getCurrent_auction_status() != 1)){
            throw new CustomException(ErrorCode.AUCTION_TIME_BAD_REQUEST);
        }
        Long price =  auctionRepository.findMaxPriceByArtPk(artEntity.getArt_pk());
        if(price == null){
            price = 0L;
        }
        if(auctionBitRequestDto.getPrice() < artEntity.getMinP() || auctionBitRequestDto.getPrice() <= price || auctionBitRequestDto.getPrice() > artEntity.getMaxP()){
            throw new CustomException(ErrorCode.AUCTION_PRICE_BAD_REQUEST);
        }


        AuctionEntity auction = AuctionEntity.builder()
                .current_price(auctionBitRequestDto.getPrice())
                .bid_user(userEntity)
                .art_entity(artEntity)
                .build();

        auctionRepository.save(auction);
        AuctionBitResponseDto auctionBitResponseDto = AuctionBitResponseDto.builder()
                .currentPrice(auction.getCurrent_price())
                .userPk(auction.getBid_user().getUser_pk())
                .build();
        PayingEntity paying = null;
        if(auctionBitRequestDto.getPrice().longValue() == artEntity.getMaxP().longValue()){
            artEntity.setCurrent_auction_status(2);
            artRepository.save(artEntity);
            paying = PayingEntity.builder()
                    .auction(auction)
                    .status(0)
                    .build();
            payingRepository.save(paying);
            auctionBitResponseDto.setPaying_pk(paying.getPaying_pk());
            // 메시지 처리 해야 됨
        }

        messagingTemplate.convertAndSend("/sub/auction/" + artPk, auctionBitResponseDto);


        return auctionBitResponseDto;
    }


    public AuctionDetailResponseDto getArtDetail(Integer artPk, Integer userPk) {
        Optional<ArtEntity> art = artRepository.findById(artPk);
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
        String end = artEntity.getEndTime().format(formatter);
        Double width = Math.round(artEntity.getWidth() * 10) / 10.0;
        Double depth = Math.round(artEntity.getDepth() * 10) / 10.0;
        Double length = Math.round(artEntity.getHeight() * 10) / 10.0;

        AuctionDetailResponseDto dto = AuctionDetailResponseDto.builder()
                .created(artEntity.getCreatedAt())
                .artInfo(artEntity.getArt_info())
                .endTime(end)
                .startTime(start)
                .maxPrice(artEntity.getMaxP())
                .width(width)
                .depth(depth)
                .length(length)
                .artName(artEntity.getArt_name())
                .artistName(artEntity.getPainter())
                .Qurater(artEntity.getQurator() != null ? artEntity.getQurator() : false)
                .userPk(userEntity.getUser_pk())
                .userName(userEntity.getUser_name())
                .minPrice(artEntity.getMinP())
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
        Long maxPrice = 0L;
        Long userMaxPrice = 0L;
        for (Object[] result : results) {
            maxPrice = result[0] != null ? ((Number) result[0]).longValue() : 0;  // 첫 번째 값 (전체 경매의 최대값)
            userMaxPrice = result[1] != null ? ((Number) result[1]).longValue() : 0;  // 두 번째 값 (유저의 입찰 중 최대값)
        }
        maxPrice = Math.max(dto.getMinPrice(), maxPrice);
        dto.setCurrentPrice(maxPrice);
        dto.setMyCurrentPrice(userMaxPrice);

        Optional<BlackListUserEntity> blackListUserEntity = blackListUserRepository.findByUserEntityAndArtEntity(userEntity,artEntity);
        LocalDateTime now = LocalDateTime.now();
        Optional<AuctionEntity> auction = auctionRepository.findMax(artEntity.getArt_pk());

        // 블랙리스트인지, 블랙리스트 status, 자신의 그림인지
        if(userEntity.getUser_pk() == artEntity.getUserEntity().getUser_pk() || userEntity.getBlack_list_status() == true || blackListUserEntity.isPresent()){
            dto.setState(1);
        } else if(now.isBefore(artEntity.getEndTime()) && now.isAfter(artEntity.getStartTime()) && artEntity.getCurrent_auction_status() == 1){
            dto.setState(0);
        } else if(auction.isEmpty() || auction.get().getBid_user() != userEntity){
            dto.setState(1);
        } else {

            PayingEntity paying = payingRepository.findByAuction(auction.get()).orElseThrow(()-> new CustomException(ErrorCode.PAYING_NOT_FOUND));
            Optional<OrderEntity> order = orderRepostory.findByPaying(paying);
            if(order.isPresent()){
                dto.setState(3);
            } else {
                dto.setState(2);
                dto.setPaying_pk(paying.getPaying_pk());
            }

        }

        return dto;
    }
}
