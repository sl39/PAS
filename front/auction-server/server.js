// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let currentPrice = 1000000; // 초기 가격 설정

io.on('connection', (socket) => {
  console.log('A user connected');

  // 클라이언트에게 현재 가격 전송
  socket.emit('bidUpdate', currentPrice);

  socket.on('placeBid', (bid) => {
    if (bid > currentPrice) { // 입찰가가 현재가보다 높을 경우
      currentPrice = bid; // 현재가 업데이트
      io.emit('bidUpdate', currentPrice); // 모든 클라이언트에 현재가 전송
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// 서버 실행
server.listen(4000, () => {
  console.log('Socket.IO server running on port 4000');
});
