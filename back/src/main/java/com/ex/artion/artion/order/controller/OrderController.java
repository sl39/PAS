package com.ex.artion.artion.order.controller;

import com.ex.artion.artion.order.dto.OrderCreateDto;
import com.ex.artion.artion.order.dto.OrderGetResponseDto;
import com.ex.artion.artion.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ResponseEntity<OrderGetResponseDto> getOrder(@RequestParam Integer payingPk) {
        return ResponseEntity.ok(orderService.getOrder(payingPk));
    }
    @GetMapping("/test")
    public String test(){
        return "test";
    }
}
