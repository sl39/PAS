import React, { useEffect, useState } from 'react';
import AuctionResult from './AuctionResult';
import axios from 'axios';

const AuctionInfo = ({
  currentPrice,
  maxPrice,
  setShowBidModal,
  myCurrentPrice,
  isAuctionEnded,
  winnerName,
  winnerContact,
  winnerAddress,
  shippingMethod,
  setWinnerName,
  setWinnerContact,
  setWinnerAddress,
  setShippingMethod,
  artPk, // artPk를 props로 추가
  userPk // userPk를 props로 추가
}) => {
  const [auctionData, setAuctionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [payingPk, setPayingPk] = useState(null);

  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get(`/api/auction/detail`, {
        params: { artPk: 7, userPk:7 }, // props로 받은 값을 사용
      });
      setAuctionData(response.data);
      const endTime = new Date(response.data.endTime);
      const now = new Date();
      setTimeRemaining(endTime - now);
      if (response.data.paying_pk) {
        setPayingPk(response.data.paying_pk);
      }
    } catch (error) {
      setError('경매 정보를 가져오는 데 실패했습니다.');
      console.error('Error fetching auction details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetails();
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  const { artName } = auctionData;

  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };

  return (
    <div className="row text-left">
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
          isAuctionEnded={isAuctionEnded}
          artName={artName}
          payingPk={payingPk}
        />
      ) : (
        <>
          <h3>남은 시간: {formatTime(timeRemaining)}</h3>
          <h2>최대가: KRW {maxPrice?.toLocaleString() || '없음'}</h2>
          <h2>현재가: KRW {currentPrice?.toLocaleString() || '없음'}</h2>
          <h2>내 입찰가: KRW {myCurrentPrice?.toLocaleString() || '없음'}</h2>
          <button className="btn btn-primary" onClick={() => setShowBidModal(true)}>
            입찰하기
          </button>
        </>
      )}
    </div>
  );
};

export default AuctionInfo;
