package com.ex.artion.artion.auction.respository;

import com.ex.artion.artion.auction.entity.AuctionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuctionRepository extends JpaRepository<AuctionEntity, Integer> {
    @Query(value = "SELECT * FROM auction_entity a " +
            "WHERE a.bid_user_user_pk = :user_pk "
            ,nativeQuery = true)
    List<AuctionEntity> findAllByUser_pk(@Param("user_pk") Integer user_pk);

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


    @Query(value = "SELECT max(a.current_price) " +
            "FROM AuctionEntity as a " +
            "WHERE a.art_entity.art_pk = :artPk " +
            "GROUP BY a.art_entity "
            )
    Long findMaxPriceByArtPk(@Param("artPk") Integer artPk);

}
