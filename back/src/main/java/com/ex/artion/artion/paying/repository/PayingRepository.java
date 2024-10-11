package com.ex.artion.artion.paying.repository;

import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.paying.entity.PayingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PayingRepository extends JpaRepository<PayingEntity,Integer> {

    @Query(value = "SELECT * FROM paying_entity a " +
            "WHERE a.auction_auction_pk = :auction "
            ,nativeQuery = true)
List<PayingEntity> findAllByAuction_pk(@Param("auction") Integer auction);

    @Query(value = "SELECT * FROM paying_entity a " +
            "WHERE a.auction_auction_pk = :auction "
            ,nativeQuery = true)
    PayingEntity findOneByAuction_pk(@Param("auction") Integer auction);
}