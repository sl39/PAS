package com.ex.artion.artion.order.respository;

import com.ex.artion.artion.order.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepostory extends JpaRepository<OrderEntity,Integer> {
}
