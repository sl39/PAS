package com.ex.artion.artion.auction.controller;


import com.ex.artion.artion.auction.dto.AuctionBitRequestDto;
import com.ex.artion.artion.auction.dto.AuctionBitResponseDto;
import com.ex.artion.artion.auction.service.AuctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auction")
@RequiredArgsConstructor
public class AuctionController {

    private final AuctionService auctionService;

    @PostMapping("/bid/{artPk}")
    public ResponseEntity<AuctionBitResponseDto> bid(@PathVariable(value = "artPk") Integer artPk, @RequestBody AuctionBitRequestDto auctionBitRequestDto){
        System.out.println(artPk);
        // 해야 될 일
        // 값이 들어왔을 때 유효성 검증
        return new ResponseEntity<>(auctionService.updateBid(artPk,auctionBitRequestDto ),HttpStatus.OK);
    }

}
