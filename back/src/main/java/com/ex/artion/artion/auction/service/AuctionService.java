package com.ex.artion.artion.auction.service;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.auction.dto.AuctionBitRequestDto;
import com.ex.artion.artion.auction.dto.AuctionBitResponseDto;
import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.auction.respository.AuctionRepository;
import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuctionService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ArtRepository artRepository;
    private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;


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
                .price(auction.getCurrent_price())
                .userPk(auction.getBid_user().getUser_pk())
                .build();
        messagingTemplate.convertAndSend("/sub/auction/" + artPk, auctionBitResponseDto);
        return auctionBitResponseDto;
    }

    
}
