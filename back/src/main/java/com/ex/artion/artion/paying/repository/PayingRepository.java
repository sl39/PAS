package com.ex.artion.artion.paying.repository;

import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.global.scheduler.redisscheduler.PayingEntityRedis;
import com.ex.artion.artion.paying.entity.PayingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

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

    Optional<PayingEntity> findByAuction(AuctionEntity auction);

    @Transactional
    void deleteAllByAuction(AuctionEntity auction);

    @Query(value = "SELECT p.* FROM " +
            "paying_entity as p " +
            "LEFT JOIN auction_entity as a on p.auction_auction_pk = a.auction_pk " +
            "WHERE a.art_entity_art_pk=:artPk ",nativeQuery = true)
    Optional<PayingEntity> findByArtPk(@Param(value = "artPk") Integer artPk);

    @Query(value = "SELECT new com.ex.artion.artion.global.scheduler.redisscheduler.PayingEntityRedis(p.paying_pk,p.status,a.art_entity.art_pk) " +
            "FROM PayingEntity as p " +
            "LEFT JOIN AuctionEntity as a on p.auction.auction_pk = a.auction_pk " +
            "LEFT JOIN OrderEntity  as  o on p.paying_pk = o.paying.paying_pk " +
            "WHERE o.paying.paying_pk IS NULL AND p.status = 0")
    List<PayingEntityRedis> findAllWithoutOrder();
}