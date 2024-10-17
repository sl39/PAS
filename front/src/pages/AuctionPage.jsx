import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // useParams import
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import BidModal from '../components/BidModal';
import AuctionInfo from '../components/AuctionInfo';
import AuctionResult from '../components/AuctionResult';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as StompJs from "@stomp/stompjs";
import axios from 'axios';

axios.defaults.baseURL = 'http://artion.site:8080';

const ActionPage = () => {
  const { art_pk } = useParams(); // URL 파라미터에서 artPk와 userPk 가져오기
  const artPk = Number(art_pk); // 숫자로 변환
  const userPk = 8; // 숫자로 변환

  const [auctionData, setAuctionData] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidPrice, setBidPrice] = useState('');
  const [client, setClient] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // 결제 정보 상태
  const [winnerName, setWinnerName] = useState('');
  const [winnerContact, setWinnerContact] = useState('');
  const [winnerAddress, setWinnerAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('일반배송');

  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get(`/api/auction/detail`, {
        params: { artPk, userPk },
      });
      setAuctionData(response.data);
      const endTime = new Date(response.data.endTime);
      const now = new Date();
      setTimeRemaining(endTime - now);
    } catch (error) {
      console.error('Error fetching auction details:', error);
      toast.error('경매 정보를 가져오는 데 실패했습니다.');
    }
  };

  const handleBid = async () => {
    const maxBid = Number(bidPrice);
    if (!auctionData || auctionData.state !== 0) {
      toast.error('경매가 진행 중이 아닙니다.');
      return;
    }
  
    if (maxBid <= auctionData.currentPrice) {
      toast.error('입찰가는 현재가보다 높아야 합니다.');
      return;
    }
  
    try {
      const response = await axios.post(`/api/auction/bid/${artPk}`, {
        userPk,
        price: maxBid,
      });
  
      if (response.data && response.data.currentPrice) {
        setAuctionData(prev => ({
          ...prev,
          currentPrice: response.data.currentPrice,
          myCurrentPrice: maxBid,
        }));
      }
  
      if (maxBid >= auctionData.maxPrice) {
        toast.success('축하합니다! 낙찰되었습니다.');
        notifyAuctionEnd();
  
        // 상태를 2로 업데이트하여 낙찰 성공 화면으로 변경
        setAuctionData(prev => ({
          ...prev,
          state: 2, // 낙찰 성공 상태로 업데이트
        }));
  
      } else {
        toast.success('입찰이 성공적으로 이루어졌습니다.');
  
        const message = {
          currentPrice: maxBid,
          myCurrentPrice: maxBid,
        };
  
        client.publish({
          destination: `/topic/auction/${artPk}`,
          body: JSON.stringify(message),
        });
      }
  
      setBidPrice('');
      setShowBidModal(false);
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('입찰 처리에 실패하였습니다.');
    }
  };  

  const notifyAuctionEnd = () => {
    if (!client) return;

    client.publish({
      destination: `/pub/auction/end/${artPk}`,
      body: JSON.stringify({ isAuctionEnded: true }),
    });
  };

  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };

  useEffect(() => {
    fetchAuctionDetails();

    const stompClient = new StompJs.Client({
      brokerURL: "ws://artion.site:8080/api/socket/ws",
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket connected");
        stompClient.subscribe(`/sub/auction/${artPk}`, (message) => {
          const data = JSON.parse(message.body);
          setAuctionData(prev => ({
            ...prev,
            currentPrice: data.currentPrice,
            myCurrentPrice: data.myCurrentPrice || 0,
          }));
        });

        stompClient.subscribe(`/sub/auction/end/${artPk}`, (message) => {
          const data = JSON.parse(message.body);
          if (data.isAuctionEnded) {
            toast.error('경매가 종료되었습니다.');
            setAuctionData(prev => ({
              ...prev,
              state: 1 // 낙찰 실패 상태로 변경
            }));
          }
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient.connected) {
        stompClient.deactivate();
      }
    };
  }, [artPk]);

  useEffect(() => {
    if (auctionData) {
      const endTime = new Date(auctionData.endTime);
      const now = new Date();
      setTimeRemaining(endTime - now);
    }
  }, [auctionData]);

  if (!auctionData) return <p>로딩 중...</p>;

  const { state, currentPrice, maxPrice, myCurrentPrice, artImages, created, artistName, artName } = auctionData;

  const handlePaymentComplete = () => {
    setAuctionData(prev => ({
      ...prev,
      state: 3,
    }));
  };

  return (
      <div className="container text-center mt-4">
        <Header /> {/* Header 컴포넌트 추가 */}
        <hr className="dotted-line" />
        {/* 공통적으로 보여줄 경매 정보 */}
        <div className="row">
          <div className="col-md-6 mb-4 image-container">
            {artImages && artImages.length > 0 && (
              <img src={artImages[0]} className="img-fluid" alt={artName} />
            )}
          </div>
          <div className="col-md-6 mb-4 info-panel text-left">
            <h1>{artName}</h1>
            <h1>작가: {artistName}</h1>
            <h1>제작일: {created}</h1>
          </div>
        </div>
        <hr className="dotted-line" />
        {/* 경매 상태에 따라 다르게 렌더링 */}
        {state === 0 && (
          <AuctionInfo
            currentPrice={currentPrice}
            maxPrice={maxPrice}
            myCurrentPrice={myCurrentPrice}
            setShowBidModal={setShowBidModal}
            isAuctionEnded={false} // 경매 진행 중
            timeRemaining={timeRemaining}
          />
        )}
        {state === 1 && (
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
            isAuctionEnded={true} // 낙찰 실패 상태
            artName={artName}
            onPaymentComplete={handlePaymentComplete} // 결제 완료 핸들러 전달
          />
        )}
        {state === 2 && (
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
            isAuctionEnded={true} // 낙찰 성공 상태
            artName={artName}
            onPaymentComplete={handlePaymentComplete} // 결제 완료 핸들러 전달
          />
        )}
        {state === 3 && (
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
         isAuctionEnded={true} // 결제 완료 상태
         artName={artName}
         onPaymentComplete={handlePaymentComplete} // 결제 완료 핸들러 전달
         paymentCompleted={true} // 결제 완료 상태 전달
       />
     )}

     <BidModal
       showBidModal={showBidModal}
       setShowBidModal={setShowBidModal}
       bidPrice={bidPrice}
       setBidPrice={setBidPrice}
       handleBid={handleBid}
       currentPrice={currentPrice}
     />

     <ToastContainer />
   </div>
);
};

export default ActionPage;
