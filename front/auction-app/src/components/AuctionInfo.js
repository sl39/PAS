import React, { useEffect, useState } from 'react';
import AuctionResult from './AuctionResult';

const AuctionInfo = ({
  artImages = ['https://www.ccnnews.co.kr/news/photo/201511/52489_56243_00.jpg'],
  created = '2024-10-01',
  curator = true,
  artName = '임의 작품 이름',
  artistName = '임의 작가 이름',
  startPrice = 500000,
  maxPrice = 1500000,
  currentPrice,
  setShowBidModal,
  myCurrentPrice,
  isAuctionEnded,
  bidResult, // 입찰 결과 추가
  winnerName,
  winnerContact,
  winnerAddress,
  setWinnerName,
  setWinnerContact,
  setWinnerAddress,
  shippingMethod,
  setShippingMethod,
  handlePayment,
}) => {
  const auctionEndTime = new Date('2024-10-11T17:50:00');

  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const remaining = auctionEndTime - now;

      if (remaining <= 0) {
        clearInterval(interval);
        setTimeRemaining(0);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionEndTime]);

  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };

  return (
    <div className="row">
      <div className="col-md-6 mb-4 image-container">
        {artImages && artImages.length > 0 && (
          <img
            src={artImages[0]}
            className="img-fluid"
            alt={artName}
          />
        )}
      </div>
      <div className="col-md-6 mb-4 info-panel">
        <h5>{artName}</h5>
        <p>작가: {artistName}</p>
        <p>재질: 팬넬에 아크릴</p>
        <p>사이즈: 30 × 50 cm</p>
        <p>제작일: {created}</p>
        <p>큐레이터: {curator ? '있음' : '없음'}</p>
        <hr className="dotted-line" />

        {/* 경매 종료 상태에 따라 AuctionResult 컴포넌트 사용 */}
        {isAuctionEnded ? (
          <AuctionResult
            userBid={myCurrentPrice}
            finalPrice={currentPrice}
            winnerName={winnerName}
            winnerContact={winnerContact}
            winnerAddress={winnerAddress}
            shippingMethod={shippingMethod}
            setWinnerName={setWinnerName}
            setWinnerContact={setWinnerContact}
            setWinnerAddress={setWinnerAddress}
            setShippingMethod={setShippingMethod}
            handlePayment={handlePayment}
            isAuctionEnded={isAuctionEnded}
          />
        ) : (
          <>
            <p>시작가: KRW {startPrice?.toLocaleString() || '없음'}</p>
            <p>최대가: KRW {maxPrice?.toLocaleString() || '없음'}</p>
            <p>현재가: KRW {currentPrice?.toLocaleString() || '없음'}</p>
            <p>내 입찰가: KRW {myCurrentPrice?.toLocaleString() || '없음'}</p>
            <p>남은 시간: {formatTime(timeRemaining)}</p>
            <button className="btn btn-primary" onClick={() => setShowBidModal(true)}>
              입찰하기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuctionInfo;

