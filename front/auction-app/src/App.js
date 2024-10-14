import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BidModal from './components/BidModal';
import AuctionInfo from './components/AuctionInfo';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as StompJs from "@stomp/stompjs";
import axios from 'axios';

// axios 기본 URL 설정
axios.defaults.baseURL = 'http://artion.site:8080';

const App = () => {
  const artPk = 7;
  const userPk = 1;
  
  const [currentPrice, setCurrentPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [showBidModal, setShowBidModal] = useState(false);
  const [userBid, setUserBid] = useState(() => JSON.parse(localStorage.getItem('userBid')) || null);
  const [bidPrice, setBidPrice] = useState('');
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [bidResult, setBidResult] = useState(null);
  
  // 결제 정보 상태
  const [winnerName, setWinnerName] = useState('');
  const [winnerContact, setWinnerContact] = useState('');
  const [winnerAddress, setWinnerAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('일반배송');

  // 경매 정보 가져오기
  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get(`/api/auction/detail`, {
        params: { artPk, userPk },
      });
      const data = response.data;
      setCurrentPrice(data.currentPrice);
      setMaxPrice(data.maxPrice);
      localStorage.setItem('currentPrice', JSON.stringify(data.currentPrice));
      localStorage.setItem('maxPrice', JSON.stringify(data.maxPrice));
    } catch (error) {
      console.error('Error fetching auction details:', error.response ? error.response.data : error.message);
      toast.error('경매 정보를 가져오는 데 실패했습니다.');
    }
  };

  // 입찰 처리
  const handleBid = async (maxBid) => {
    if (isAuctionEnded) {
      toast.error('경매가 종료되었습니다. 더 이상 입찰할 수 없습니다.');
      return;
    }

    // 유효성 검증
    if (!validateBid(maxBid)) return;

    try {
      await axios.post(`/api/auction/bid/${artPk}`, {
        userPk,
        price: maxBid,
      });

      // 입찰가가 현재가보다 높고 최대가보다 낮은 경우
      if (maxBid > currentPrice) {
        setUserBid(maxBid);
        localStorage.setItem('userBid', JSON.stringify(maxBid));
        setCurrentPrice(maxBid);
        localStorage.setItem('currentPrice', JSON.stringify(maxBid));
        toast.success('입찰이 성공적으로 이루어졌습니다.');
      }

      // 입찰가가 최대가와 같을 경우 즉시 경매 종료
      if (maxBid === maxPrice) {
        setUserBid(maxBid);
        localStorage.setItem('userBid', JSON.stringify(maxBid));
        setCurrentPrice(maxBid);
        localStorage.setItem('currentPrice', JSON.stringify(maxBid));
        setBidResult({ success: true, myBid: maxBid });
        toast.success('축하합니다! 낙찰되었습니다.');
        setIsAuctionEnded(true);
      }
    } catch (error) {
      console.error('Error placing bid:', error.response ? error.response.data : error.message);
      toast.error('입찰 처리에 실패하였습니다.');
    }
  };

  // WebSocket 설정
  useEffect(() => {
    fetchAuctionDetails();

    const client = new StompJs.Client({
      brokerURL: "ws://artion.site:8080/api/socket/ws",
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        client.subscribe("/sub/auction/7", (message) => {
          const data = JSON.parse(message.body);
          
          // 서버로부터 받은 경매 정보 업데이트
          if (data.currentPrice !== currentPrice) {
            setCurrentPrice(data.currentPrice);
            localStorage.setItem('currentPrice', JSON.stringify(data.currentPrice));
          }
          if (data.maxPrice !== maxPrice) {
            setMaxPrice(data.maxPrice);
            localStorage.setItem('maxPrice', JSON.stringify(data.maxPrice));
          }

          if (data.isAuctionEnded) {
            setIsAuctionEnded(true);
            toast.error('경매가 종료되었습니다.');
          }
        });
      },
    });

    client.activate();

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [currentPrice, maxPrice]); // currentPrice와 maxPrice에 따라 의존성 배열 추가

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
