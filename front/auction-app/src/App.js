import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BidModal from './components/BidModal';
import AuctionInfo from './components/AuctionInfo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as PortOne from "@portone/browser-sdk/v2";

const App = () => {
  const [currentPrice, setCurrentPrice] = useState(1000000);
  const [maxPrice, setMaxPrice] = useState(1500000);
  const [showBidModal, setShowBidModal] = useState(false);
  const [userBid, setUserBid] = useState(null);
  const [bidPrice, setBidPrice] = useState('');
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [bidResult, setBidResult] = useState(null);
  
  // 결제 정보 상태
  const [winnerName, setWinnerName] = useState('');
  const [winnerContact, setWinnerContact] = useState('');
  const [winnerAddress, setWinnerAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('일반배송');

  const auctionEndTime = new Date('2024-10-11T17:50:00');

  // 남은 시간 계산
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const remaining = auctionEndTime - now;

      if (remaining <= 0) {
        clearInterval(interval);
        setIsAuctionEnded(true);
        toast.error('경매가 종료되었습니다.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auctionEndTime]);

  const validateBid = (maxBid) => {
    if (maxBid <= currentPrice) {
      toast.error('입찰가는 현재가보다 높아야 합니다.');
      return false;
    }
    if (maxBid > maxPrice) {
      toast.error('입찰가는 최대 입찰가보다 낮아야 합니다.');
      return false;
    }
    return true;
  };

  const handleBid = (maxBid) => {
    if (isAuctionEnded) {
      toast.error('경매가 종료되었습니다. 더 이상 입찰할 수 없습니다.');
      return;
    }
  
    // 유효성 검증
    if (!validateBid(maxBid)) return;
  
    // 입찰가가 현재가보다 높고 최대가보다 낮은 경우
    if (maxBid > currentPrice && maxBid < maxPrice) {
      setUserBid(maxBid);
      setCurrentPrice(maxBid); // 현재가를 입찰가로 업데이트
      toast.success('입찰이 성공적으로 이루어졌습니다.');
    }
  
    // 입찰가가 최대가와 같을 경우 즉시 경매 종료
    if (maxBid === maxPrice) {
      setUserBid(maxBid);
      setCurrentPrice(maxBid); // 현재가를 최대가로 업데이트
      setBidResult({ success: true, myBid: maxBid });
      toast.success('축하합니다! 낙찰되었습니다.');
      setIsAuctionEnded(true); // 경매 종료 상태로 설정
    }
    
    // 입찰가가 현재가보다 낮은 경우
    if (maxBid <= currentPrice) {
      setBidResult({ success: false, myBid: maxBid });
      toast.error('입찰가는 현재가보다 높아야 합니다.');
    }
  };  

  const handleCloseModal = () => {
    const bidAmount = Number(bidPrice);
    if (bidAmount) {
      handleBid(bidAmount);
    } else {
      setUserBid(0);
      setBidResult({ success: false, myBid: 0 });
      toast.error('입찰가를 입력하지 않았습니다. 낙찰에 실패하였습니다.');
    }
    setBidPrice('');
    setShowBidModal(false);
  };

  return (
    <div className="container text-center mt-4">
      <AuctionInfo
        currentPrice={currentPrice}
        maxPrice={maxPrice}
        setShowBidModal={setShowBidModal}
        myCurrentPrice={userBid || 0}
        isAuctionEnded={isAuctionEnded}
        bidResult={bidResult}
        winnerName={winnerName}
        winnerContact={winnerContact}
        winnerAddress={winnerAddress}
        setWinnerName={setWinnerName}
        setWinnerContact={setWinnerContact}
        setWinnerAddress={setWinnerAddress}
        shippingMethod={shippingMethod}
        setShippingMethod={setShippingMethod}
      />
      
      <BidModal
        showBidModal={showBidModal}
        setShowBidModal={setShowBidModal}
        bidPrice={bidPrice}
        setBidPrice={setBidPrice}
        handleBid={handleCloseModal}
        currentPrice={currentPrice}
      />
      <ToastContainer />
    </div>
  );
};

export default App;
