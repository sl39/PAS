import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BidModal from './components/BidModal';
import AuctionInfo from './components/AuctionInfo';
import AuctionResult from './components/AuctionResult';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as StompJs from "@stomp/stompjs";
import axios from 'axios';

axios.defaults.baseURL = 'http://artion.site:8080';

const App = () => {
  const artPk = 7;
  const userPk = 7;

  const [currentPrice, setCurrentPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [showBidModal, setShowBidModal] = useState(false);
  const [userBid, setUserBid] = useState(0);
  const [bidPrice, setBidPrice] = useState('');
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [bidResult, setBidResult] = useState(null);
  const [winnerName, setWinnerName] = useState('');
  const [winnerContact, setWinnerContact] = useState('');
  const [winnerAddress, setWinnerAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('일반배송');

  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get(`/api/auction/detail`, {
        params: { artPk, userPk },
      });
      const data = response.data;
      setCurrentPrice(data.currentPrice);
      setMaxPrice(data.maxPrice);
      setRemainingTime(data.remainingTime);
      fetchUserBid();
    } catch (error) {
      console.error('Error fetching auction details:', error);
      toast.error('경매 정보를 가져오는 데 실패했습니다.');
    }
  };

  const fetchUserBid = async () => {
    try {
      const response = await axios.get(`/api/auction/detail`, {
        params: { userPk, artPk },
      });
      setUserBid(response.data.myCurrentPrice || 0);
    } catch (error) {
      console.error('Error fetching user bid:', error);
    }
  };

  const handleBid = async () => {
    const maxBid = Number(bidPrice);
    if (isAuctionEnded) {
      toast.error('경매가 종료되었습니다. 더 이상 입찰할 수 없습니다.');
      return;
    }

    const isValid = validateBid(maxBid);
    if (!isValid) return;

    try {
      const response = await axios.post(`/api/auction/bid/${artPk}`, {
        userPk,
        price: maxBid,
      });

      if (response.data && response.data.currentPrice) {
        setCurrentPrice(response.data.currentPrice);
      }

      // 입찰가가 최대가에 도달한 경우
      if (maxBid === maxPrice) {
        setUserBid(maxBid);
        setCurrentPrice(maxBid);
        setBidResult({ success: true, myBid: maxBid });
        toast.success('축하합니다! 낙찰되었습니다.');
        setIsAuctionEnded(true);
        setRemainingTime(0); // 남은 시간 0으로 설정
        notifyAuctionEnd(); // 경매 종료 알림 전송
      } else if (maxBid > currentPrice && maxBid < maxPrice) {
        setCurrentPrice(maxBid);
        setUserBid(maxBid);
        toast.success('입찰이 성공적으로 이루어졌습니다.');
      }

      fetchUserBid();
      setBidPrice('');
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('입찰 처리에 실패하였습니다.');
    }
  };

  const notifyAuctionEnd = () => {
    const client = new StompJs.Client({
      brokerURL: "ws://artion.site:8080/api/socket/ws",
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        client.publish({
          destination: `/pub/auction/end/${artPk}`,
          body: JSON.stringify({ isAuctionEnded: true, remainingTime: 0 }),
        });
      },
    });

    client.activate();
  };

  useEffect(() => {
    fetchAuctionDetails();

    const client = new StompJs.Client({
        brokerURL: "ws://artion.site:8080/api/socket/ws",
        debug: (str) => { console.log(str); },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
            console.log("WebSocket connected");
            client.subscribe(`/sub/auction/${artPk}`, (message) => {
                const data = JSON.parse(message.body);
                console.log("Received data:", data);
                
                // 현재가 업데이트
                if (data.currentPrice !== currentPrice) {
                    setCurrentPrice(data.currentPrice);
                }

                // 사용자 입찰가 업데이트
                if (data.myCurrentPrice !== userBid) {
                    setUserBid(data.myCurrentPrice || 0);
                }
            });

            // 경매 종료 알림 수신
            client.subscribe(`/sub/auction/end/${artPk}`, (message) => {
                const data = JSON.parse(message.body);
                if (data.isAuctionEnded) {
                    setIsAuctionEnded(true);
                    setRemainingTime(0); // 남은 시간 0으로 설정
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
}, [artPk]);

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
    if (bidPrice) {
      handleBid();
    } else {
      setUserBid(0);
      setBidResult({ success: false, myBid: 0 });
      toast.error('입찰가를 입력하지 않았습니다. 낙찰에 실패하였습니다.');
    }
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
        remainingTime={remainingTime}
        bidResult={bidResult}
      />

      {isAuctionEnded ? (
        <AuctionResult
          userBid={userBid}
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
        />
      ) : (
        <BidModal
          showBidModal={showBidModal}
          setShowBidModal={setShowBidModal}
          bidPrice={bidPrice}
          setBidPrice={setBidPrice}
          handleBid={handleCloseModal}
          currentPrice={currentPrice}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
