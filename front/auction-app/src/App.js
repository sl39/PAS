import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BidModal from './components/BidModal';
import AuctionInfo from './components/AuctionInfo';
import AuctionResult from './components/AuctionResult';
import KakaoLogin from './components/KakaoLogin';
import io from 'socket.io-client';

// Socket.IO 클라이언트 설정
const socket = io('http://localhost:4000');

const App = () => {
  const REST_API_KEY = 'ef8def78c431df0084fcd11140308ae9'; // 카카오 REST API 키
  const [showBidModal, setShowBidModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(1000000);
  const [finalPrice, setFinalPrice] = useState(null);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [userBid, setUserBid] = useState(null);
  const [winnerName, setWinnerName] = useState('');
  const [winnerContact, setWinnerContact] = useState('');
  const [winnerAddress, setWinnerAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('일반배송');
  const [accessToken, setAccessToken] = useState(null); // 액세스 토큰 상태 추가
  const [timeRemaining, setTimeRemaining] = useState(0); // 초기값을 0으로 설정

  // 더미 데이터 정의
  const dummyData = {
    artImages: [
      'https://www.ccnnews.co.kr/news/photo/201511/52489_56243_00.jpg',
      'https://example.com/another_image.jpg'
    ],
    created: '2023-01-01',
    curator: true,
    artName: '아름다운 풍경',
    artistName: '홍길동',
    startPrice: 500000,
    maxPrice: 1500000,
  };

  // 경매 시간 설정
  const auctionStartDate = new Date();
  const auctionEndDate = new Date(auctionStartDate);
  auctionEndDate.setMinutes(auctionEndDate.getMinutes() + 1);

  // 앱 시작 시 localStorage에서 accessToken 불러오기
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    if (token) {
      setAccessToken(token);
      console.log('Loaded Access Token:', token); // 확인용 로그
    }
    if (userId) {
      console.log('Loaded User ID:', userId); // 확인용 로그
    }
  }, []);

  // 남은 시간 초기화
  useEffect(() => {
    const remaining = auctionEndDate.getTime() - Date.now(); // 현재 시간과 종료 시간 차이
    setTimeRemaining(remaining > 0 ? remaining : 0); // 남은 시간이 0보다 크면 설정
  }, [auctionEndDate]);

  // 웹소켓 이벤트 리스너 설정
  useEffect(() => {
    socket.on('bidUpdate', (newBid) => {
      setCurrentPrice(newBid); // 현재가 업데이트
    });

    return () => {
      socket.off('bidUpdate'); // 컴포넌트 언마운트 시 리스너 제거
    };
  }, []);

  // 경매 남은 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(timer);
          setIsAuctionEnded(true);
          setFinalPrice(currentPrice);
          return 0; // 남은 시간을 0으로 설정
        }
        return prev - 1000; // 1초 감소
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPrice]);

  const handleBid = (maxBid) => {
    // 로그인 상태 확인
    if (!accessToken) {
      alert('로그인이 필요합니다. 카카오톡으로 로그인합니다.');
      const loginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=http://localhost:3000/oauth&response_type=code`;
      window.location.href = loginUrl; // 로그인 페이지로 이동
      return;
    }

    // 입찰가 유효성 검사
    if (maxBid > currentPrice && maxBid <= dummyData.maxPrice) {
      setUserBid(maxBid);
      setCurrentPrice(maxBid); // 현재가 업데이트
      socket.emit('placeBid', maxBid); // 서버에 입찰가 전송
      if (maxBid === dummyData.maxPrice) {
        setIsAuctionEnded(true); // 경매 종료
      }
    } else if (maxBid > dummyData.maxPrice) {
      alert('입찰가는 최대가를 초과할 수 없습니다.');
    } else {
      alert('입찰가는 현재가보다 높아야 합니다.');
    }
  };

  return (
    <div className="container text-center mt-4">
      <AuctionInfo
        artImages={dummyData.artImages}
        created={dummyData.created}
        curator={dummyData.curator}
        artName={dummyData.artName}
        artistName={dummyData.artistName}
        startPrice={dummyData.startPrice}
        maxPrice={dummyData.maxPrice}
        currentPrice={currentPrice}
        timeRemaining={Math.floor(timeRemaining / 1000)} // 초 단위로 변환
        setShowBidModal={setShowBidModal}
        isAuctionEnded={isAuctionEnded} // 경매 종료 상태 전달
        myCurrentPrice={userBid} // 실제 입력한 입찰가 전달
      />

      {/* 경매 결과 표시 */}
      {isAuctionEnded && (
        <AuctionResult
          finalPrice={currentPrice} // 최종 낙찰가를 현재가로 설정
          userBid={userBid}
          winnerName={winnerName}
          winnerContact={winnerContact}
          winnerAddress={winnerAddress}
          shippingMethod={shippingMethod}
          setWinnerName={setWinnerName}
          setWinnerContact={setWinnerContact}
          setWinnerAddress={setWinnerAddress}
          setShippingMethod={setShippingMethod}
          handlePayment={() => {/* 결제 처리 로직 */}}
          isAuctionEnded={isAuctionEnded}
        />
      )}

      <BidModal
        showBidModal={showBidModal}
        setShowBidModal={setShowBidModal}
        handleBid={handleBid} // 단일 입찰 처리 함수
        currentPrice={currentPrice}
      />

      {/* 카카오톡 로그인 컴포넌트는 경매 창 아래에 위치 */}
      {!accessToken && <KakaoLogin setAccessToken={setAccessToken} />}
    </div>
  );
};

export default App;
