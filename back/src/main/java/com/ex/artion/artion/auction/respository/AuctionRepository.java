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
}
