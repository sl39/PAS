package com.ex.artion.artion.user.service;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.art.respository.ArtRepository;
import com.ex.artion.artion.artfollowing.entity.ArtFollowingEntity;
import com.ex.artion.artion.artfollowing.respository.ArtFollowingRepository;
import com.ex.artion.artion.artimage.entity.ArtImageEntity;
import com.ex.artion.artion.artimage.respository.ArtImageRepository;
import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.auction.respository.AuctionRepository;
import com.ex.artion.artion.following.entity.FollowingEntity;
import com.ex.artion.artion.following.respository.FollowingRepository;
import com.ex.artion.artion.global.auth.repository.AuthRepository;
import com.ex.artion.artion.global.auth.service.AuthService;
import com.ex.artion.artion.global.error.CustomException;
import com.ex.artion.artion.global.error.ErrorCode;
import com.ex.artion.artion.global.jwt.UserPrincipal;
import com.ex.artion.artion.paying.entity.PayingEntity;
import com.ex.artion.artion.paying.repository.PayingRepository;
import com.ex.artion.artion.order.respository.OrderRepostory;
import com.ex.artion.artion.order.entity.OrderEntity;
import com.ex.artion.artion.user.dto.UserCreateDto;
import com.ex.artion.artion.user.dto.UserUpdateDto;
import com.ex.artion.artion.user.entity.UserEntity;
import com.ex.artion.artion.user.respository.UserRepository;
import kotlin.reflect.jvm.internal.pcollections.HashPMap;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final OrderRepostory orderRepostory;
    private final ArtImageRepository artImageRepository;
    private final ArtFollowingRepository artFollowingRepository;
    private final FollowingRepository followingRepository;

    // 소셜로그인 전 기본적인 유저 생성 테스트
    public ResponseEntity<String> createUser(@RequestBody UserCreateDto dto) {
//    public ResponseEntity<String> createUser(@RequestBody UserCreateDto dto, @RequestParam(value="user_pk") Integer user_pk) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findById(userPrincipal.getUserPk())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
//        UserEntity user = userRepository.findById(user_pk)
//                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        user.setPhone_number(dto.getPhone_number());
        user.setBank_name(dto.getBank_name());
        user.setAddress(dto.getAddress());
        user.setUser_name(dto.getUser_name());
        user.setUser_account(dto.getUser_account());
        user.setBlack_list_status(false);
        user.setUser_cash(Long.valueOf(0));

        this.userRepository.save(user);

        return ResponseEntity.ok("회원가입 성공!");
    }

    // 이거 상대방 user_pk 사용하는 거겠지?
    public UserEntity searchUser(@RequestParam(value = "user_pk") Integer user_pk) {
        UserEntity founduser = userRepository.findById(user_pk)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return founduser;
    }

    // 유저 정보 수정
    public ResponseEntity<String> updateUser(@RequestBody UserUpdateDto dto) {
//    public ResponseEntity<String> updateUser(@RequestBody UserUpdateDto dto, @RequestParam(value = "user_pk") Integer user_pk) {

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserEntity user = userRepository.findById(userPrincipal.getUserPk())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

//        UserEntity user = userRepository.findById(user_pk)
//                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        user.setUser_name(dto.getUser_name());
        user.setPhone_number(dto.getPhone_number());
        user.setBank_name(dto.getBank_name());
        user.setUser_account(dto.getUser_account());
        user.setAddress(dto.getAddress());

        this.userRepository.save(user);

        return ResponseEntity.ok("유저 정보 수정!");
    }

    public ResponseEntity<Map<String, Object>> updateBeforeUser() {
//        public ResponseEntity<Map<String, Object>> updateBeforeUser(@RequestParam(value = "user_pk") Integer user_pk) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println(userPrincipal);

        Map<String, Object> Message = new HashMap<>();

        UserEntity user = userRepository.findById(userPrincipal.getUserPk())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

//        UserEntity user = userRepository.findById(user_pk)
//                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Message.put("user_name", user.getUser_name());
        Message.put("phone_number", user.getPhone_number());
        Message.put("bank_name", user.getBank_name());
        Message.put("user_account", user.getUser_account());
        Message.put("address", user.getAddress());

        return ResponseEntity.ok(Message);
    }

    // 유저 삭제(회원탈퇴)
//    public void deleteUser() {
//        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        Integer userId = userPrincipal.getUserPk();
//
//        UserEntity user = userRepository.findById(userId)
//                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
//
//        this.userRepository.delete(user);
//    }

    // user_pk로 구매내역(입찰 중) 조회
//    public ResponseEntity<List<Map<String, Object>>> requestPurchaseBid() {
        public ResponseEntity<List<Map<String, Object>>> requestPurchaseBid() {
        List<Map<String, Object>> result = new ArrayList<>();
        UserEntity user;
        List<Object[]> prices = new ArrayList<>();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        user = userRepository.findById(userPrincipal.getUserPk())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<AuctionEntity> auc = auctionRepository.findAllByUser_pk(user.getUser_pk());

        for (AuctionEntity auction : auc) {
            if (!auc.isEmpty() && auction.getArt_entity().getCurrent_auction_status() == 1) {
                prices = auctionRepository.findMaxPriceAndUserMaxPriceByArtPkAndUserPkNative(auction.getArt_entity().getArt_pk(), userPrincipal.getUserPk());
                Object[] row = prices.get(0);
                Long userMaxPrice = ((Number) row[1]).longValue();
                if (userMaxPrice.equals(auction.getCurrent_price())) {
                    Map<String, Object> map = new HashMap<>();
                    ArtEntity artEntity = auction.getArt_entity();
                    Integer art_pk = artEntity.getArt_pk();

                    Integer auction_pk = auction.getAuction_pk();

                    String artName = artEntity.getArt_name();
                    String painter = artEntity.getPainter();
                    Integer currentAuctionStatus = artEntity.getCurrent_auction_status();
                    LocalDateTime endTime = artEntity.getEndTime();

                    List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());

                    if (!artImage.isEmpty()) {
                        String image = String.valueOf(artImage.get(0).getArt_image_url());
                        map.put("image", image);
                    } else {
                        String image = null;
                        map.put("image", image);
                    }

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
            }

        }
        return ResponseEntity.ok(result);
    }


    // user_pk로 구매내역(낙찰) 조회
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseSuccess() {
        List<Map<String, Object>> result = new ArrayList<>();
        UserEntity user;

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        user = userRepository.findById(userPrincipal.getUserPk())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<AuctionEntity> auc = auctionRepository.findAllByUser_pk(user.getUser_pk());

        for (AuctionEntity auction : auc) {
            Map<String, Object> map = new HashMap<>();

            ArtEntity artEntity = auction.getArt_entity();
            Integer art_pk = artEntity.getArt_pk();

            Integer auction_pk = auction.getAuction_pk();

            List<PayingEntity> pay = payingRepository.findAllByAuction_pk(auction_pk);

            for (PayingEntity payingEntity : pay) {
                if (!pay.isEmpty() && artEntity.getCurrent_auction_status() == 2) {
                    Integer paying_pk = payingEntity.getPaying_pk();

                    String artName = artEntity.getArt_name();
                    String painter = artEntity.getPainter();
                    Integer currentAuctionStatus = artEntity.getCurrent_auction_status();
                    LocalDateTime endTime = artEntity.getEndTime();

                    Long current_price = auction.getCurrent_price();

                    List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());

                    if (!artImage.isEmpty()) {
                        String image = String.valueOf(artImage.get(0).getArt_image_url());
                        map.put("image", image);
                    } else {
                        String image = null;
                        map.put("image", image);
                    }

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
        }
        return ResponseEntity.ok(result);
    }

    //구매내역(종료)
    //종료 = 1. 입금O + 2. 낙찰실패로 나뉨.

    public ResponseEntity<List<Map<String, Object>>> requestPurchaseEnd() {
        List<Map<String, Object>> result = new ArrayList<>();
        UserEntity user;

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        user = userRepository.findById(userPrincipal.getUserPk())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        //auc = 사용자가 참여한 경매 뽑아내기.
        List<AuctionEntity> auc = auctionRepository.findAllByUser_pk(user.getUser_pk());

        if (auc != null) {
            for (AuctionEntity auction : auc) {
                List<Object[]> prices = new ArrayList<>();

                // user_pk -> auction_pk -> art_pk 뽑아내기.
                ArtEntity artEntity = auction.getArt_entity();
                Integer art_pk = artEntity.getArt_pk();
                List<PayingEntity> pay = payingRepository.findAllByAuction_pk(auction.getAuction_pk());

                //auc에서 최대 가격이랑 내 최대 가격이랑 다른 것들 = 경매는 참여했으나 낙찰하지 못한 것들 뽑아내기
                prices = auctionRepository.findMaxPriceAndUserMaxPriceByArtPkAndUserPkNative(art_pk, userPrincipal.getUserPk());
                Object[] row = prices.get(0);
                Long maxPrice = ((Number) row[0]).longValue();
                Long userMaxPrice = ((Number) row[1]).longValue();
                if (!userMaxPrice.equals(maxPrice) && userMaxPrice.equals(auction.getCurrent_price())) {
                    Map<String, Object> map = new HashMap<>();

                    Integer auction_pk = auction.getAuction_pk();

                    String artName = artEntity.getArt_name();
                    String painter = artEntity.getPainter();
                    Integer currentAuctionStatus = artEntity.getCurrent_auction_status();
                    LocalDateTime endTime = artEntity.getEndTime();

                    Long current_price = auction.getCurrent_price();

                    List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());

                    if (!artImage.isEmpty()) {
                        String image = String.valueOf(artImage.get(0).getArt_image_url());
                        map.put("image", image);
                    } else {
                        String image = null;
                        map.put("image", image);
                    }

                    map.put("auction_pk", auction_pk);
                    map.put("current_price", current_price);
                    map.put("art_pk", art_pk);
                    map.put("artName", artName);
                    map.put("painter", painter);
                    map.put("currentAuctionStatus", currentAuctionStatus);
                    map.put("endTime", endTime);

                    if (!result.contains(map)) {
                        result.add(map); // 중복이 아닐 때만 추가
                    }
                } else {
                for (PayingEntity payingEntity : pay) {
                    List<OrderEntity> order = orderRepostory.findAllByPaying_pk(payingEntity.getPaying_pk());
                    for (OrderEntity orderEntity : order) {
                        Map<String, Object> map = new HashMap<>();

                        String order_pk = orderEntity.getOrder_pk();
                        Integer paying_pk = payingEntity.getPaying_pk();
                        Integer auction_pk = auction.getAuction_pk();

                        String artName = artEntity.getArt_name();
                        String painter = artEntity.getPainter();
                        LocalDate createdAt = artEntity.getCreatedAt();
                        LocalDateTime endTime = artEntity.getEndTime();
                        Integer currentAuctionStatus = artEntity.getCurrent_auction_status();

                        List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());

                        if (!artImage.isEmpty()) {
                            String image = String.valueOf(artImage.get(0).getArt_image_url());
                            map.put("image", image);
                        } else {
                            String image = null;
                            map.put("image", image);
                        }

                        map.put("order_pk", order_pk);
                        map.put("paying_pk", paying_pk);
                        map.put("auction_pk", auction_pk);
                        map.put("art_pk", art_pk);
                        map.put("artName", artName);
                        map.put("painter", painter);
                        map.put("currentAuctionStatus", currentAuctionStatus);
                        map.put("createdAt", createdAt);
                        map.put("endTime", endTime);

                        if (!result.contains(map)) {
                            result.add(map); // 중복이 아닐 때만 추가
                        }
                    }
                }
            }
        }
    }
    return ResponseEntity.ok(result);
}

    // 구매내역 전체
    public ResponseEntity<List<Map<String, Object>>> requestPurchaseAll() {
        List<Map<String, Object>> result = new ArrayList<>();

        if(requestPurchaseBid() != null || requestPurchaseSuccess() != null || requestPurchaseEnd().getBody() != null) {
            result.addAll(requestPurchaseBid().getBody());
            result.addAll(requestPurchaseSuccess().getBody());
            result.addAll(requestPurchaseEnd().getBody());
        } else {
//            Map<String, Object> errorMessage = new HashMap<>();
//            errorMessage.put("에러", "구매이력이 존재하지 않습니다");
//            result.add(errorMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
        return ResponseEntity.ok(result);
    }


    // user_pk로 판매내역(입찰 중) 조회
    public ResponseEntity<List<Map<String, Object>>> requestSaleBid() {
        UserEntity user;
        List<Map<String, Object>> result = new ArrayList<>();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        System.out.println(userPrincipal);

            user = userRepository.findById(userPrincipal.getUserPk())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<ArtEntity> art = artRepository.findAllByUser_pk(user.getUser_pk());
        if (art.isEmpty()) {
//            Map<String, Object> errorMessage = new HashMap<>();
////            errorMessage.put("에러", "사용자가 등록한 그림이 없습니다");
//            result.add(errorMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        } else {
            for (ArtEntity artEntity : art) {

                AuctionEntity auction = auctionRepository.findMaxOneByArt_pk(artEntity.getArt_pk());
//                List<AuctionEntity> auction = auctionRepository.findAllByArt_pk(artEntity.getArt_pk());
//                for (AuctionEntity auctionEntity : auction) {
                    if (auction != null && artEntity.getCurrent_auction_status() == 1) {
                        Map<String, Object> map = new HashMap<>();
                        Integer auction_pk = auction.getAuction_pk();
                        Long current_price = auction.getCurrent_price();

                        Integer art_pk = artEntity.getArt_pk();
                        String artName = artEntity.getArt_name();
                        String painter = artEntity.getPainter();
                        LocalDate createdAt = artEntity.getCreatedAt();
                        LocalDateTime endTime = artEntity.getEndTime();
                        Integer currentAuctionStatus = artEntity.getCurrent_auction_status();

                        List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());

                        if (!artImage.isEmpty()) {
                            String image = String.valueOf(artImage.get(0).getArt_image_url());
                            map.put("image", image);
                        } else {
                            String image = null;
                            map.put("image", image);
                        }

                        map.put("auction_pk", auction_pk);
                        map.put("current_price", current_price);
                        map.put("art_pk", art_pk);
                        map.put("artName", artName);
                        map.put("painter", painter);
                        map.put("createdAt", createdAt);
                        map.put("endTime", endTime);
                        map.put("currentAuctionStatus", currentAuctionStatus);

                        result.add(map); // 중복이 아닐 때만 추가

                    }
                }
            }
            return ResponseEntity.ok(result);
        }



    // user_pk로 판매내역(낙찰) 조회
    public ResponseEntity<List<Map<String, Object>>> requestSaleSuccess() {
        UserEntity user;
        List<Map<String, Object>> result = new ArrayList<>();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        System.out.println(userPrincipal);

        user = userRepository.findById(userPrincipal.getUserPk())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<ArtEntity> art = artRepository.findAllByUser_pk(user.getUser_pk());
//        System.out.println("유저pk로 조회한 art : " + art);
//        System.out.println("유저pk로 조회한 art 크기 : " + art.size());
        if (art.isEmpty()) {
//            Map<String, Object> errorMessage = new HashMap<>();
//            errorMessage.put("에러", "사용자가 등록한 그림이 없습니다");
//            result.add(errorMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        } else {
            for (ArtEntity artEntity : art) {
//                System.out.println("유저로 art 조회 후 모든 art 중 auction 들어가 있는 것들" + auction.size());
//                List<AuctionEntity> auction = auctionRepository.findAllByArt_pk(artEntity.getArt_pk());
//                for (AuctionEntity auctionEntity : auction) {
//                    System.out.println("옥션Pk : " + auctionEntity.getAuction_pk());
//                List<PayingEntity> pay = payingRepository..findAllByAuction_pk(auctionEntity.getAuction_pk());
//                    System.out.println("페이 : " + pay);
//                    System.out.println("페이 크기 : " + pay.size());
//                    if (pay.isEmpty()) {
//                        Map<String, Object> errorMessage = new HashMap<>();
//                        errorMessage.put("에러", "사용자가 등록한 그림 중 낙찰된 그림이 없습니다");
//                        result.add(errorMessage);
//                    } else {
                //                    for (PayingEntity payingEntity : pay) {

                AuctionEntity auction = auctionRepository.findMaxOneByArt_pk(artEntity.getArt_pk());

                if(auction != null) {
                    PayingEntity pay = payingRepository.findOneByAuction_pk(auction.getAuction_pk());

                    if (pay != null && artEntity.getCurrent_auction_status() == 2) {
                        Map<String, Object> map = new HashMap<>();

                        Integer paying_pk = pay.getPaying_pk();

                        Integer auction_pk = auction.getAuction_pk();
                        Long current_price = auction.getCurrent_price();

                        Integer art_pk = artEntity.getArt_pk();
                        String artName = artEntity.getArt_name();
                        String painter = artEntity.getPainter();
                        LocalDate createdAt = artEntity.getCreatedAt();
                        LocalDateTime endTime = artEntity.getEndTime();
                        Integer currentAuctionStatus = artEntity.getCurrent_auction_status();

                        List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());

                        if (!artImage.isEmpty()) {
                            String image = String.valueOf(artImage.get(0).getArt_image_url());
                            map.put("image", image);
                        } else {
                            String image = null;
                            map.put("image", image);
                        }

                        map.put("paying_pk", paying_pk);
                        map.put("auction_pk", auction_pk);
                        map.put("current_price", current_price);
                        map.put("art_pk", art_pk);
                        map.put("artName", artName);
                        map.put("painter", painter);
                        map.put("currentAuctionStatus", currentAuctionStatus);

                        map.put("createdAt", createdAt);
                        map.put("endTime", endTime);

                        result.add(map);

                    }
                    }
                }
            }
            return ResponseEntity.ok(result);
        }

    // user_pk로 판매내역(종료) 조회
    // 종료는 입금까지 끝난 것들 + 아무도 입찰하지 않은 것들로 나뉨. 구분은 current_auction_status = 0이면 입찰X, 3이면 입금O
    public ResponseEntity<List<Map<String, Object>>> requestSaleEnd() {
        UserEntity user;
        List<Map<String, Object>> result = new ArrayList<>();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        System.out.println(userPrincipal);

        user = userRepository.findById(userPrincipal.getUserPk())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<ArtEntity> art = artRepository.findAllByUser_pk(user.getUser_pk());
        if (art.isEmpty()) {
//            Map<String, Object> errorMessage = new HashMap<>();
//            errorMessage.put("에러", "사용자가 등록한 그림이 없습니다");
//            result.add(errorMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        } else {
            for (ArtEntity artEntity : art) {
                List<AuctionEntity> auction = auctionRepository.findAllByArt_pk(artEntity.getArt_pk());
                if (auction == null) {
//                    Map<String, Object> errorMessage = new HashMap<>();
//                    errorMessage.put("에러", "사용자는 경매를 진행한 적이 없습니다");
//                    result.add(errorMessage);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
                } else {
                    for (AuctionEntity auctionEntity : auction) {
                        if (artEntity.getCurrent_auction_status() == 0) {
                            Map<String, Object> map = new HashMap<>();

                            Integer auction_pk = auctionEntity.getAuction_pk();

                            Integer art_pk = artEntity.getArt_pk();
                            String artName = artEntity.getArt_name();
                            String painter = artEntity.getPainter();
                            LocalDate createdAt = artEntity.getCreatedAt();
                            LocalDateTime endTime = artEntity.getEndTime();

                            List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());

                            if (!artImage.isEmpty()) {
                                String image = String.valueOf(artImage.get(0).getArt_image_url());
                                map.put("image", image);
                            } else {
                                String image = null;
                                map.put("image", image);
                            }

                            map.put("auction_pk", auction_pk);
                            map.put("art_pk", art_pk);
                            map.put("artName", artName);
                            map.put("painter", painter);

                            map.put("createdAt", createdAt);
                            map.put("endTime", endTime);
                            map.put("current_auction_status", 0);

                            if (!result.contains(map)) {
                                result.add(map); // 중복이 아닐 때만 추가
                            }

                            System.out.println(result);
                        } else if (artEntity.getCurrent_auction_status() == 3) {
                            List<PayingEntity> pay = payingRepository.findAllByAuction_pk(auctionEntity.getAuction_pk());
                            if (pay.isEmpty()) {
//                                Map<String, Object> errorMessage = new HashMap<>();
//                                errorMessage.put("에러", "사용자가 등록한 그림 중 낙찰된 그림이 없습니다");
//                                result.add(errorMessage);
                                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
                            } else {
                                for (PayingEntity payingEntity : pay) {
                                    List<OrderEntity> order = orderRepostory.findAllByPaying_pk(payingEntity.getPaying_pk());
                                    if (pay.isEmpty()) {
//                                        Map<String, Object> errorMessage = new HashMap<>();
//                                        errorMessage.put("에러", "해당 사용자의 판매완료된 그림이 없습니다");
//                                        result.add(errorMessage);
                                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
                                    } else {
                                        for (OrderEntity orderEntity : order) {
                                            Map<String, Object> map = new HashMap<>();

                                            String order_pk = orderEntity.getOrder_pk();

                                            Integer paying_pk = payingEntity.getPaying_pk();

                                            Integer auction_pk = auctionEntity.getAuction_pk();
                                            Long current_price = auctionEntity.getCurrent_price();

                                            Integer art_pk = artEntity.getArt_pk();
                                            String artName = artEntity.getArt_name();
                                            String painter = artEntity.getPainter();
                                            LocalDate createdAt = artEntity.getCreatedAt();
                                            LocalDateTime endTime = artEntity.getEndTime();

                                            List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());

                                            if (!artImage.isEmpty()) {
                                                String image = String.valueOf(artImage.get(0).getArt_image_url());
                                                map.put("image", image);
                                            } else {
                                                String image = null;
                                                map.put("image", image);
                                            }

                                            map.put("order_pk", order_pk);
                                            map.put("paying_pk", paying_pk);
                                            map.put("auction_pk", auction_pk);
                                            map.put("current_price", current_price);
                                            map.put("art_pk", art_pk);
                                            map.put("artName", artName);
                                            map.put("painter", painter);

                                            map.put("createdAt", createdAt);
                                            map.put("endTime", endTime);
                                            map.put("current_auction_status", 3);

                                            if (!result.contains(map)) {
                                                result.add(map); // 중복이 아닐 때만 추가
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return ResponseEntity.ok(result);
    }

    // 판매내역 전체
    public ResponseEntity<List<Map<String, Object>>> requestSaleAll() {
        List<Map<String, Object>> result = new ArrayList<>();

//        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        System.out.println(userPrincipal);

        if(requestSaleBid().getBody() != null || requestSaleSuccess().getBody() != null || requestSaleEnd().getBody() != null) {
            result.addAll(requestSaleBid().getBody());
            result.addAll(requestSaleSuccess().getBody());
            result.addAll(requestSaleEnd().getBody());
        } else {
//            Map<String, Object> errorMessage = new HashMap<>();
//            errorMessage.put("에러", "판매이력이 존재하지 않습니다");
//            result.add(errorMessage);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
        return ResponseEntity.ok(result);
    }

    //내 작품 페이지 - 그림, current_auction_status에 따라 price가 달라지게,
    public ResponseEntity<Map<String, Object>> requestMyArt(@RequestParam (value="user_pk") Integer user_pk) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> itemList = new ArrayList<>();
        List<Map<String, Object>> itemDESC = new ArrayList<>();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        System.out.println(userPrincipal);

        UserEntity user;

        UserEntity user2;

//        if(user.equals(user2)) {
        if(userPrincipal.getUserPk().equals(user_pk)) {
            user = userRepository.findById(user_pk)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
            result.put("isSelf", true);

            user2 = userRepository.findById(user_pk)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

            Optional<FollowingEntity> follower = followingRepository.findByCustomerAndSeller(user, user2);

            if(follower.isPresent()) {
                result.put("followState", true);
            } else {
                result.put("followState", false);
            }

        } else {
            user = userRepository.findById(user_pk)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

            result.put("isSelf", false);

            user2 = userRepository.findById(user_pk)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

            Optional<FollowingEntity> follower = followingRepository.findByCustomerAndSeller(user, user2);

            if(follower.isPresent()) {
                result.put("followState", true);
            } else {
                result.put("followState", false);
            }
        }

//        try {
//            user = userRepository.findById(userPrincipal.getUserPk())
//                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));
//        } catch (Exception e) {
//            result.put("에러", "사용자가 존재하지 않습니다");
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
//        }

        String user_Image = user.getKakao_image();
        result.put("user_Image", user_Image);

        String User_name = user.getUser_name();
        result.put("User_name", User_name);

        List<FollowingEntity> Follow = followingRepository.findBySeller(user);
        result.put("Follow", Follow.size());

        List<ArtEntity> art = artRepository.findAllByUser_pk(user.getUser_pk());

        // 분기처리 전에 정렬한거라 의미 없음
//        List<ArtEntity> artDESC = art.stream()
//                        .sorted(Comparator.comparing(ArtEntity::getCreatedAt).reversed())
////                        .collect(Collectors.toList());
//                        .toList();

        if (art.isEmpty()) {
            result.put("에러", "사용자가 등록한 그림이 없습니다");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        } else {
            for (ArtEntity artEntity : art) {
                List<AuctionEntity> auction = auctionRepository.findAllByArt_pk(artEntity.getArt_pk());
                if (auction == null) {
                    result.put("에러", "사용자는 경매를 진행한 적이 없습니다");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
                } else {
                    if (artEntity.getCurrent_auction_status() != 0) {
                        Map<String, Object> itemData = new HashMap<>();
                        Integer art_pk = artEntity.getArt_pk();
                        String art_name = artEntity.getArt_name();
                        Long price = auctionRepository.findMaxPriceByArtPk(art_pk);
                        List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());
                        LocalDate upload = artEntity.getUpload();
                        String painter = artEntity.getPainter();

                        if (!artImage.isEmpty()) {
                            String image = String.valueOf(artImage.get(0).getArt_image_url());
                            itemData.put("image", image);
                        } else {
                            String image = null;
                            itemData.put("image", image);
                        }

                        Integer artFollows = artFollowingRepository.countByArtPk(artEntity.getArt_pk());

                        if (artFollows != null) {
                            itemData.put("follows", artFollows);
                        } else {
                            itemData.put("follows", 0);
                        }

                        itemData.put("painter", painter);
                        itemData.put("price", price);
                        itemData.put("art_name", art_name);
                        itemData.put("art_pk", art_pk);
                        itemData.put("upload", upload);

                        itemDESC.add(itemData);

                    } else {
                        Map<String, Object> itemData = new HashMap<>();
                        Integer art_pk = artEntity.getArt_pk();
                        String art_name = artEntity.getArt_name();
                        Long price = artEntity.getMinP();
                        List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(artEntity.getArt_pk());
                        LocalDate upload = artEntity.getUpload();
                        String painter = artEntity.getPainter();

                        if (!artImage.isEmpty() && artImage != null) {
                            String image = String.valueOf(artImage.get(0).getArt_image_url());
                            itemData.put("image", image);
                        } else {
                            String image = null;
                            itemData.put("image", image);
                        }

                        Integer artFollows = artFollowingRepository.countByArtPk(artEntity.getArt_pk());

                        if (artFollows != null) {
                            itemData.put("follows", artFollows);
                        } else {
                            itemData.put("follows", 0);
                        }

                        itemData.put("painter", painter);
                        itemData.put("price", price);
                        itemData.put("art_name", art_name);
                        itemData.put("art_pk", art_pk);
                        itemData.put("upload", upload);

                        itemDESC.add(itemData);

                    }

                    //upload DESC 정렬,
                    itemDESC.sort((m1, m2) -> {
                        int compareUploadAt = ((LocalDate) m2.get("upload")).compareTo((LocalDate) m1.get("upload"));

                        // createdAt이 같다면, art_pk을 기준으로 정렬
                        if (compareUploadAt == 0) {
                            return ((Integer) m2.get("art_pk")).compareTo((Integer) m1.get("art_pk"));
                        }

                        return compareUploadAt;
                    });
                }
            }

            for (Map<String, Object> item : itemDESC) {
                item.remove("upload");
            }

            // result에 추가.
            result.put("artList", itemDESC);

            return ResponseEntity.ok(result);
        }
    }

    //유저 정보 반환
    public ResponseEntity<Map<String, Object>> requestMyProfile() {
        UserEntity user;
        Map<String, Object> result = new HashMap<>();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            user = userRepository.findById(userPrincipal.getUserPk())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String User_name = user.getUser_name();

        // 카카오 로그인 시 이미지 불러오기 해야함.
        String Image = user.getKakao_image();

        result.put("User_name", User_name);
        result.put("User_image", Image);

        return ResponseEntity.ok(result);
    }

    public ResponseEntity<Map<String, Object>> requestMyProfileAndFollows() {
        UserEntity user;
        Map<String, Object> result = new HashMap<>();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        System.out.println(userPrincipal);

        user = userRepository.findById(userPrincipal.getUserPk())
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다!"));

        String User_name = user.getUser_name();

        // 카카오 로그인 시 이미지 불러오기 해야함.
        String Image = user.getKakao_image();

        result.put("User_name", User_name);
        result.put("User_image", Image);

        Integer artFollow = artFollowingRepository.findByUserEntity(user).size();
        result.put("art_following", artFollow);

        Integer follower = followingRepository.findByCustomer(user).size();
        result.put("follower", follower);

        Integer following = followingRepository.findBySeller(user).size();
        result.put("following", following);

        return ResponseEntity.ok(result);
    }

    public ResponseEntity<List<Map<String, Object>>> requestArtFollowing(@RequestParam(value = "user_pk") Integer user_pk) {
        UserEntity user;
        List<Map<String, Object>> result = new ArrayList<>();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        System.out.println(userPrincipal);

        if(user_pk.equals(userPrincipal.getUserPk())) {
            user = userRepository.findById(userPrincipal.getUserPk())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        } else {
            user = userRepository.findById(user_pk)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        }

        List<ArtFollowingEntity> artFollowing = artFollowingRepository.findByUserEntity(user);
        if (artFollowing != null) {
            for (ArtFollowingEntity artFollowingEntity : artFollowing) {
                Map<String, Object> map = new HashMap<>();

                ArtEntity art = artFollowingEntity.getArtEntity();
                String art_name = art.getArt_name();
                Integer art_pk = art.getArt_pk();
                Integer seller_pk = art.getUserEntity().getUser_pk();
                LocalDate upload = art.getUpload();

                List<ArtImageEntity> artImage = artImageRepository.findAllByArtEntity(art_pk);
                if (!artImage.isEmpty()) {
                    String image = String.valueOf(artImage.get(0).getArt_image_url());
                    map.put("image", image);
                } else {
                    String image = null;
                    map.put("image", image);
                }

                map.put("art_pk", art_pk);
                map.put("art_name", art_name);
                map.put("seller_pk", seller_pk);
                map.put("upload", upload);
                result.add(map);
            }
        }
        return ResponseEntity.ok(result);
    }

    public ResponseEntity<List<Map<String, Object>>> requestFollowing(@RequestParam(value = "user_pk") Integer user_pk) {
        UserEntity user;
        List<Map<String, Object>> result = new ArrayList<>();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(user_pk.equals(userPrincipal.getUserPk())) {
            user = userRepository.findById(userPrincipal.getUserPk())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        } else {
            user = userRepository.findById(user_pk)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        }

//        user = userRepository.findById(user_pk)
//                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));


            // 여기서 이미 내가 구독한 사람들 다 가져왔음.
            List<FollowingEntity> Following = followingRepository.findByCustomer(user);
            if (Following != null) {
                for (FollowingEntity followingEntity : Following) {
                    Map<String, Object> map = new HashMap<>();

                    Integer Seller_pk = followingEntity.getSeller().getUser_pk();

                    // 카카오 로그인 시 이미지 불러오기 해야함.
                    String user_image = user.getKakao_image();

                    String user_name = followingEntity.getSeller().getUser_name();

                    map.put("user_image", user_image);
                    map.put("user_name", user_name);
                    map.put("user_pk", Seller_pk);
                    result.add(map);
                }
            }
            return ResponseEntity.ok(result);
        }


    public ResponseEntity<List<Map<String, Object>>> requestMyFollower (@RequestParam(value = "user_pk") Integer user_pk) {
        UserEntity user;
        List<Map<String, Object>> result = new ArrayList<>();

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        System.out.println(userPrincipal);

        if(user_pk.equals(userPrincipal.getUserPk())) {
            user = userRepository.findById(userPrincipal.getUserPk())
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        } else {
            user = userRepository.findById(user_pk)
                    .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        }

        // 날 구독한 사람들
        List<FollowingEntity> Following = followingRepository.findBySeller(user);
        if (Following != null) {
            for (FollowingEntity followingEntity : Following) {
                Map<String, Object> map = new HashMap<>();

                Integer Customer_pk = followingEntity.getCustomer().getUser_pk();

                // 카카오 로그인 시 이미지 불러오기 해야함.
                String user_image = user.getKakao_image();

                String user_name = followingEntity.getCustomer().getUser_name();

                map.put("user_pk", Customer_pk);
                map.put("user_image", user_image);
                map.put("user_name", user_name);
                result.add(map);
            }
        }
        return ResponseEntity.ok(result);
    }
}