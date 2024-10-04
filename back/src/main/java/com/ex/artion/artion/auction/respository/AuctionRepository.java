package com.ex.artion.artion.auction.respository;

import com.ex.artion.artion.auction.entity.AuctionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionRepository extends JpaRepository<AuctionEntity, Integer> {
}
