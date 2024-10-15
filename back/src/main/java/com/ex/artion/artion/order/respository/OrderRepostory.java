package com.ex.artion.artion.order.respository;

import com.ex.artion.artion.auction.entity.AuctionEntity;
import com.ex.artion.artion.order.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepostory extends JpaRepository<OrderEntity,Integer> {
    @Query(value = "SELECT * FROM order_entity a " +
            "WHERE a.paying_paying_pk = :paying_pk "
            ,nativeQuery = true)
    List<OrderEntity> findAllByPaying_pk(@Param("paying_pk") Integer paying_pk);

    @Query(value = "SELECT * FROM order_entity a " +
            "WHERE a.paying_paying_pk = :paying_pk "
            ,nativeQuery = true)
    OrderEntity findOneByPaying_pk(@Param("paying_pk") Integer paying_pk);


}
