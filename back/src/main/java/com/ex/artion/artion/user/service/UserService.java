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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
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

    public boolean searchUser(@RequestParam(value="user_pk") Integer user_pk) {
        UserEntity user = userRepository.findById(user_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
        if(user == null) {
            return false;
        } else {
            return true;
        }
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

    // user_pk로 구매내역(낙찰) 조회
    public  List<Map<String, Object>> requestPurchaseSucceess(@RequestParam(value="user_pk") Integer user_pk) {
        UserEntity user = userRepository.findById(user_pk)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
        List<AuctionEntity> auc = auctionRepository.findAllByUser_pk(user.getUser_pk());

        List <Map<String, Object>> result = new ArrayList<>();

        for (AuctionEntity auction : auc) {
            Map<String, Object> map = new HashMap<>();

            ArtEntity artEntity = auction.getArt_entity();
            Integer art_pk = artEntity.getArt_pk();

            Integer auction_pk = auction.getAuction_pk();

            List<PayingEntity> pay = payingRepository.findAllByAuction_pk(auction_pk);

            for(PayingEntity payingEntity : pay) {

                Integer paying_pk = payingEntity.getPaying_pk();

                String artName = artEntity.getArt_name();
                String painter = artEntity.getPainter();
                Integer currentAuctionStatus = artEntity.getCurrent_auction_status();
                LocalDateTime endTime = artEntity.getEndTime();

                Long current_price = auction.getCurrent_price();

                map.put("paying_pk", paying_pk);
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
        }
        return result;
    }

    // user_pk로 판매내역(입찰 중) 조회
    public  ResponseEntity<List<Map<String, Object>>> requestSaleBid(@RequestParam(value="user_pk") Integer user_pk) {
        UserEntity user;
        List <Map<String, Object>> result = new ArrayList<>();

        try {
            user = userRepository.findById(user_pk)
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
        } catch (Exception e) {
            Map<String, Object> errorMessage = new HashMap<>();
            errorMessage.put("에러", "사용자가 존재하지 않습니다");
            result.add(errorMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }

        List<ArtEntity> art = artRepository.findAllByUser_pk(user.getUser_pk());
        System.out.println("유저pk로 조회한 art : " + art);
        if (art.isEmpty()) {
            Map<String, Object> errorMessage = new HashMap<>();
            errorMessage.put("에러", "사용자가 등록한 그림이 없습니다");
            result.add(errorMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        } else {
            for (ArtEntity artEntity : art) {
                Map<String, Object> map = new HashMap<>();
                System.out.println("아트 pk는? :" + artEntity.getArt_pk());
                List<AuctionEntity> auction = auctionRepository.findAllByArt_pk(artEntity.getArt_pk());
                System.out.println("옥션 데이터는 ? :" + auction);
                for (AuctionEntity auctionEntity : auction) {
                    if (!auction.isEmpty()) {
                        Integer auction_pk = auctionEntity.getAuction_pk();
                        Long current_price = auctionEntity.getCurrent_price();

                        Integer art_pk = artEntity.getArt_pk();
                        String artName = artEntity.getArt_name();
                        String painter = artEntity.getPainter();
                        LocalDate createdAt = artEntity.getCreatedAt();
                        LocalDateTime endTime = artEntity.getEndTime();

                        map.put("auction_pk", auction_pk);
                        map.put("current_price", current_price);
                        map.put("art_pk", art_pk);
                        map.put("artName", artName);
                        map.put("painter", painter);
                        map.put("createdAt", createdAt);
                        map.put("endTime", endTime);

                        result.add(map);
                    }
                }
            }
            return ResponseEntity.ok(result);
        }
    }

    // user_pk로 판매내역(낙찰) 조회
    public  ResponseEntity<List<Map<String, Object>>> requestSaleSuccess(@RequestParam(value="user_pk") Integer user_pk) {
        UserEntity user;
        List <Map<String, Object>> result = new ArrayList<>();

        try {
            user = userRepository.findById(user_pk)
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
        } catch (Exception e) {
            Map<String, Object> errorMessage = new HashMap<>();
            errorMessage.put("에러", "사용자가 존재하지 않습니다");
            result.add(errorMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }

        List<ArtEntity> art = artRepository.findAllByUser_pk(user.getUser_pk());
//        System.out.println("유저pk로 조회한 art : " + art);
//        System.out.println("유저pk로 조회한 art 크기 : " + art.size());
        if (art.isEmpty()) {
            Map<String, Object> errorMessage = new HashMap<>();
            errorMessage.put("에러", "사용자가 등록한 그림이 없습니다");
            result.add(errorMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        } else {
            for (ArtEntity artEntity : art) {
                List<AuctionEntity> auction = auctionRepository.findAllByArt_pk(artEntity.getArt_pk());
//                System.out.println("유저로 art 조회 후 모든 art 중 auction 들어가 있는 것들" + auction.size());
                for (AuctionEntity auctionEntity : auction) {
//                    System.out.println("옥션Pk : " + auctionEntity.getAuction_pk());
                    List<PayingEntity> pay = payingRepository.findAllByAuction_pk(auctionEntity.getAuction_pk());
//                    System.out.println("페이 : " + pay);
//                    System.out.println("페이 크기 : " + pay.size());
//                    if (pay.isEmpty()) {
//                        Map<String, Object> errorMessage = new HashMap<>();
//                        errorMessage.put("에러", "사용자가 등록한 그림 중 낙찰된 그림이 없습니다");
//                        result.add(errorMessage);
//                    } else {
                    for(PayingEntity payingEntity : pay) {
                        Map<String, Object> map = new HashMap<>();

                        Integer paying_pk = payingEntity.getPaying_pk();

                        Integer auction_pk = auctionEntity.getAuction_pk();
                        Long current_price = auctionEntity.getCurrent_price();

                        Integer art_pk = artEntity.getArt_pk();
                        String artName = artEntity.getArt_name();
                        String painter = artEntity.getPainter();
                        LocalDate createdAt = artEntity.getCreatedAt();
                        LocalDateTime endTime = artEntity.getEndTime();

                        map.put("paying_pk", paying_pk);
                        map.put("auction_pk", auction_pk);
                        map.put("current_price", current_price);
                        map.put("art_pk", art_pk);
                        map.put("artName", artName);
                        map.put("painter", painter);

                        map.put("createdAt", createdAt);
                        map.put("endTime", endTime);

                        result.add(map);
                    }
                }
            }
            return ResponseEntity.ok(result);
        }
    }
}


    // user_pk로 판매내역(입찰 중) 조회 - 낙찰된 거 클릭이랑 섞인 듯.
//    public  List<Map<String, Object>> requestSaleList(@RequestParam(value="user_pk") Integer user_pk) {
//        UserEntity user = userRepository.findById(user_pk)
//                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
//        List<ArtEntity> art = artRepository.findAllByUser_pk(user.getUser_pk());
//
//        List <Map<String, Object>> result = new ArrayList<>();
//
//        for (ArtEntity artEntity : art) {
//            Map<String, Object> map = new HashMap<>();
//
//            AuctionEntity auction = auctionRepository.findAllByArt_pk(artEntity.getArt_pk());
//            Integer auction_pk = auction.getAuction_pk();
//            Long current_price = auction.getCurrent_price();
//
//            Integer art_pk = artEntity.getArt_pk();
//            String artName = artEntity.getArt_name();
//            String painter = artEntity.getPainter();
//            LocalDate createdAt = artEntity.getCreatedAt();
//            LocalDateTime endTime = artEntity.getEndTime();
//
//            map.put("auction_pk", auction_pk);
//            map.put("current_price", current_price);
//            map.put("art_pk", art_pk);
//            map.put("artName", artName);
//            map.put("painter", painter);
//            map.put("createdAt", createdAt);
//            map.put("endTime", endTime);
//
//            // 결과 리스트에 추가
//            result.add(map);
//            System.out.println(result);
//        }
//        return result;
//    }