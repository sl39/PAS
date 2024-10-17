package com.ex.artion.artion.auction.respository;

import com.ex.artion.artion.art.entity.ArtEntity;
import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.user.dto.UserMaxDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AuctionRepository extends JpaRepository<AuctionEntity, Integer> {
    // 유저 정보로 옥션 엔티티 조회
    @Query(value = "SELECT * FROM auction_entity a " +
            "WHERE a.bid_user_user_pk = :user_pk "
            ,nativeQuery = true)
    List<AuctionEntity> findAllByUser_pk(@Param("user_pk") Integer user_pk);

    @Query(value = "SELECT * FROM auction_entity a " +
            "WHERE a.art_entity_art_pk = :art_pk "
            ,nativeQuery = true)
    List<AuctionEntity> findAllByArt_pk(@Param("art_pk") Integer art_pk);

    @Query(value = "SELECT * FROM auction_entity a " +
            "WHERE a.art_entity_art_pk = :art_pk "
            ,nativeQuery = true)
    AuctionEntity findOneByArt_pk(@Param("art_pk") Integer art_pk);

    // 경매하는 미술품의 최고 값과 자신의 최고 값
    @Query(value = "SELECT " +
            "MAX(a.current_price) AS maxPrice, " +
            "(SELECT MAX(b.current_price) " +
            " FROM auction_entity b " +
            " WHERE b.art_entity_art_pk = :artPk " +
            " AND b.bid_user_user_pk = :userPk) AS userMaxPrice " +
            "FROM auction_entity a " +
            "WHERE a.art_entity_art_pk = :artPk", nativeQuery = true)
    List<Object[]> findMaxPriceAndUserMaxPriceByArtPkAndUserPkNative(@Param("artPk") Integer artPk, @Param("userPk") Integer userPk);


    @Query(value = "SELECT COALESCE(max(a.current_price),0) " +
            "FROM AuctionEntity as a " +
            "WHERE a.art_entity.art_pk = :artPk " +
            "GROUP BY a.art_entity "
            )
    Long findMaxPriceByArtPk(@Param("artPk") Integer artPk);

    @Query(value = "SELECT a.* FROM auction_entity as a " +
            "WHERE a.art_entity_art_pk =:artPk and a.current_price = " +
            "(SELECT MAX(b.current_price) FROM auction_entity b WHERE b.art_entity_art_pk = :artPk)" , nativeQuery = true
    )
    Optional<AuctionEntity> findMax(@Param("artPk") Integer artPk);

    @Query( value = "" +
            "SELECT a.* " +
            "FROM auction_entity as a " +
            "WHERE a.art_entity_art_pk = :artPk AND a.current_price = (SELECT MAX(b.current_price) FROM auction_entity as b WHERE b.art_entity_art_pk= :artPk) "
            , nativeQuery = true
    )
    Optional<AuctionEntity> findByIdAndMaxPrice(@Param(value = "artPk") Integer artPk);

    @Modifying
    @org.springframework.transaction.annotation.Transactional
    @Query("DELETE FROM AuctionEntity a WHERE a.art_entity.art_pk = :artPk")
    void deleteAllByArt_entity(@Param(value = "artPk") Integer artPk);





}
