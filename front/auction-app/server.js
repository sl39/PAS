const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let currentBid = 1000000; // 초기 입찰가

io.on('connection', (socket) => {
  console.log('New client connected');

  // 클라이언트가 입찰할 때
  socket.on('placeBid', (bid) => {
    if (bid > currentBid) {
      currentBid = bid;
      io.emit('bidUpdate', currentBid); // 모든 클라이언트에 새 입찰가 전송
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 서버 시작
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
