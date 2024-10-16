package com.ex.artion.artion.order.controller;

import com.ex.artion.artion.order.dto.OrderCreateDto;
import com.ex.artion.artion.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.PublicKey;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderCreateDto> order(@RequestBody OrderCreateDto order) {
        orderService.save(order);
        return ResponseEntity.ok(order);
    }
}
