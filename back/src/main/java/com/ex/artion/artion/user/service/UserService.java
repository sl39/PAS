package com.ex.artion.artion.user.service;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.auction.respository.AuctionRepository;
import com.ex.artion.artion.paying.entity.PayingEntity;
import com.ex.artion.artion.paying.repository.PayingRepository;
import com.ex.artion.artion.user.dto.UserCreateDto;
import com.ex.artion.artion.user.dto.UserUpdateDto;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.*;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final ArtRepository artRepository;
    private final AuctionRepository auctionRepository;
    private final PayingRepository payingRepository;

    // 소셜로그인 전 기본적인 유저 생성 테스트
    public void createUser(@RequestBody UserCreateDto dto) {
        
        UserEntity user = new UserEntity();
        user.setPhone_number(dto.getPhone_number());
        user.setBank_name(dto.getBank_name());
        user.setAddress(dto.getAddress());
        user.setUser_name(dto.getUser_name());
        user.setUser_account(dto.getUser_account());

        user.setBlack_list_status(false);
        user.setUser_cash(Long.valueOf(0));

        this.userRepository.save(user);
    }

    // 유저 정보 수정
    public void updateUser(@RequestBody UserUpdateDto dto, @RequestParam(value="user_pk") Integer user_pk) {
        UserEntity user = userRepository.findById(user_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));

        user.setUser_name(dto.getUser_name());
        user.setPhone_number(dto.getPhone_number());
        user.setBank_name(dto.getBank_name());
        user.setUser_account(dto.getUser_account());
        user.setAddress(dto.getAddress());

        this.userRepository.save(user);
     }

     // 유저 삭제(회원탈퇴)
     public void deleteUser(@RequestParam(value="user_pk") Integer user_pk) {
         UserEntity user = userRepository.findById(user_pk)
                 .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
        this.userRepository.delete(user);
     }

     // user_pk로 구매내역(입찰 중) 조회
     public  List<Map<String, Object>> requestPurchaseBid(@RequestParam(value="user_pk") Integer user_pk) {
        UserEntity user = userRepository.findById(user_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
         List<AuctionEntity> auc = auctionRepository.findAllByUser_pk(user.getUser_pk());

         List <Map<String, Object>> result = new ArrayList<>();

         for (AuctionEntity auction : auc) {
             Map<String, Object> map = new HashMap<>();

             ArtEntity artEntity = auction.getArt_entity();
             Integer art_pk = artEntity.getArt_pk();

             Integer auction_pk = auction.getAuction_pk();

             String artName = artEntity.getArt_name();
             String painter = artEntity.getPainter();
             Integer currentAuctionStatus = artEntity.getCurrent_auction_status();
             LocalDateTime endTime = artEntity.getEndTime();

             Long current_price = auction.getCurrent_price();

             map.put("auction_pk", auction_pk);
             map.put("current_price", current_price);
             map.put("art_pk", art_pk);
             map.put("artName", artName);
             map.put("painter", painter);
             map.put("currentAuctionStatus", currentAuctionStatus);
             map.put("endTime", endTime);

             // 결과 리스트에 추가
             result.add(map);
             System.out.println(result);
         }
            return result;
     }

    public  List<Map<String, Object>> requestPurchaseSuceess(@RequestParam(value="user_pk") Integer user_pk) {
        UserEntity user = userRepository.findById(user_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
        List<AuctionEntity> auc = auctionRepository.findAllByUser_pk(user.getUser_pk());

        List <Map<String, Object>> result = new ArrayList<>();

        for (AuctionEntity auction : auc) {
            Map<String, Object> map = new HashMap<>();

            ArtEntity artEntity = auction.getArt_entity();
            Integer art_pk = artEntity.getArt_pk();

            Integer auction_pk = auction.getAuction_pk();

            Optional<PayingEntity> payingEntity = payingRepository.findAllByAuction_pk(auction_pk);
            if(payingEntity.isPresent()) {
                Integer paying_pk = payingEntity.get().getPaying_pk(); //
                System.out.println("낙찰되었습니다! PK: " + paying_pk);
                map.put("paying_pk", paying_pk);
            } else {
                System.out.println("낙찰되지 않았습니다!");
            }


            String artName = artEntity.getArt_name();
            String painter = artEntity.getPainter();
            Integer currentAuctionStatus = artEntity.getCurrent_auction_status();
            LocalDateTime endTime = artEntity.getEndTime();

            Long current_price = auction.getCurrent_price();

            map.put("auction_pk", auction_pk);
            map.put("current_price", current_price);
            map.put("art_pk", art_pk);
            map.put("artName", artName);
            map.put("painter", painter);
            map.put("currentAuctionStatus", currentAuctionStatus);
            map.put("endTime", endTime);

            // 결과 리스트에 추가
            result.add(map);
            System.out.println(result);
        }
        return result;
    }

//    public  List<Map<String, Object>> requestSaleList(@RequestParam(value="user_pk") Integer user_pk) {
//        UserEntity user = userRepository.findById(user_pk)
//                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
//        List<AuctionEntity> auc = auctionRepository.findAllByUser_pk(user_pk);
//
//        List <Map<String, Object>> result = new ArrayList<>();
//
//        for (AuctionEntity auction : auc) {
//            Map<String, Object> map = new HashMap<>();
//
//            ArtEntity artEntity = auction.getArt_entity();
//            Integer art_pk = artEntity.getArt_pk();
//
//            Integer auction_pk = auction.getAuction_pk();
//
//            String artName = artEntity.getArt_name();
//            String painter = artEntity.getPainter();
//            Integer currentAuctionStatus = artEntity.getCurrent_auction_status();
//            LocalDateTime endTime = artEntity.getEndTime();
//
//            Long current_price = auction.getCurrent_price();
//
//            map.put("auction_pk", auction_pk);
//            map.put("current_price", current_price);
//            map.put("art_pk", art_pk);
//            map.put("artName", artName);
//            map.put("painter", painter);
//            map.put("currentAuctionStatus", currentAuctionStatus);
//            map.put("endTime", endTime);
//
//            // 결과 리스트에 추가
//            result.add(map);
//            System.out.println(result);
//        }
//        return result;
//    }
}