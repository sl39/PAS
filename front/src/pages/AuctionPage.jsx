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

axios.defaults.baseURL = 'https:/artion.site';

const ActionPage = () => {
  const { art_pk } = useParams(); // URL 파라미터에서 artPk와 userPk 가져오기
  const artPk = Number(art_pk); // 숫자로 변환

  const [auctionData, setAuctionData] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidPrice, setBidPrice] = useState('');
  const [client, setClient] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [winnerName, setWinnerName] = useState('');
  const [winnerContact, setWinnerContact] = useState('');
  const [winnerAddress, setWinnerAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('일반배송');
  const [paying_pk, setpaying_pk] = useState('');

  const fetchAuctionDetails = async () => {
    try {
      const response = await axios.get(`/api/auction/detail`, 
        {
        params: { artPk},
        withCredentials: true
      });
      console.log('API 응답:', response.data); // 응답 데이터 확인
      setAuctionData(response.data);
      setpaying_pk(response.data.paying_pk); // payingPk 설정
      const endTime = new Date(response.data.endTime);
      const now = new Date();
      setTimeRemaining(endTime - now);
    } catch (error) {
      console.error('Error fetching auction details:', error);
      toast.error('경매 정보를 가져오는 데 실패했습니다.');
    }
  };  
  
  useEffect(() => {
    // payingPk가 업데이트될 때마다 로그 출력
    console.log('현재 payingPk:', paying_pk);
  }, [paying_pk]); // payingPk가 변경될 때마다 호출
  

  const notifyAuctionEnd = () => {
    if (!client) return; // 클라이언트가 없으면 종료

    client.publish({
      destination: `/pub/auction/end/${artPk}`,
      body: JSON.stringify({ isAuctionEnded: true }),
    });
  };

  useEffect(() => {
    fetchAuctionDetails();

    const stompClient = new StompJs.Client({
      brokerURL: "ws://localhost:8000/api/socket/ws",
      // brokerURL: "wss://artion.site/api/socket/ws",
      debug: (str) => { console.log(str); },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("WebSocket connected");
        stompClient.subscribe(`/sub/auction/${artPk}`, (message) => {
          const data = JSON.parse(message.body);
          
          // 현재 가격 업데이트
          setAuctionData(prev => {
            const updatedCurrentPrice = data.currentPrice;

            // 최대가와 현재가가 동일해질 때 경매 종료 처리
            if (updatedCurrentPrice >= prev.maxPrice) {
              notifyAuctionEnd(); // 경매 종료 알림
              return {
                ...prev,
                currentPrice: updatedCurrentPrice,
                state: 2, // 낙찰 성공 상태로 업데이트
              };
            }

            return {
              ...prev,
              currentPrice: updatedCurrentPrice,
              // myCurrentPrice는 유지
            };
          });
        });

        stompClient.subscribe(`/sub/auction/end/${artPk}`, (message) => {
          const data = JSON.parse(message.body);
          if (data.isAuctionEnded) {
            toast.error('경매가 종료되었습니다.');
            setAuctionData(prev => ({
              ...prev,
              state: prev.myCurrentPrice >= prev.currentPrice ? 2 : 1 // 낙찰 성공 또는 실패 상태로 변경
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
        //userPk,
        price: maxBid,
      }, {
        withCredentials : true
      });

      if (response.data && response.data.currentPrice) {
        setAuctionData(prev => ({
          ...prev,
          currentPrice: response.data.currentPrice,
          myCurrentPrice: maxBid, // 입찰 후 myCurrentPrice 업데이트
        }));
      }

      if (maxBid >= auctionData.maxPrice) {
        toast.success('축하합니다! 낙찰되었습니다.');
        // notifyAuctionEnd(); // 경매 종료 알림
        setAuctionData(prev => ({
          ...prev,
          state: 2, // 낙찰 성공 상태로 업데이트
        }));
      } else {
        toast.success('입찰이 성공적으로 이루어졌습니다.');

        const message = {
          currentPrice: maxBid,
          myCurrentPrice: maxBid, // 입찰 후 myCurrentPrice 업데이트
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

  console.log(paying_pk)

  return (
    <>
    <Header />
    <hr 
      className="dotted-line" 
      style={{ 
        width: '100%', // 원하는 길이로 조정 (예: 80%로 설정)
        border: 'none', // 기본 경계 없애기
        borderTop: '2px dotted #000', // 점선 스타일 설정
        margin: '20px auto' // 수직 중앙 정렬 및 여유 공간 추가
      }} 
    />
    <div className="container text-center mt-4">
      <div className="auction-content"> {/* 경매 내용 컨테이너 */}
        <div className="row">
          <div className="col-md-6 mb-4 image-container">
            {artImages && artImages.length > 0 && (
              <img src={artImages[0]} className="img-fluid" alt={artName} />
            )}
          </div>
          <div className="col-md-6 mb-4 info-panel">
            <h1>{artName}</h1>
            <div style={{ height: '20px' }}></div>
            <h2>작가: {artistName}</h2>
            <div style={{ height: '20px' }}></div>
            <h2>제작일: {created}</h2>
          </div>
        </div>
        <hr 
          className="dotted-line" 
          style={{ 
            width: '100%', // 원하는 길이로 조정 (예: 80%로 설정)
            border: 'none', // 기본 경계 없애기
            borderTop: '2px dotted #000', // 점선 스타일 설정
            margin: '20px auto' // 수직 중앙 정렬 및 여유 공간 추가
          }} 
        />
        {state === 0 && (
          <AuctionInfo
            currentPrice={currentPrice}
            maxPrice={maxPrice}
            myCurrentPrice={myCurrentPrice}
            setShowBidModal={setShowBidModal}
            isAuctionEnded={false}
            timeRemaining={timeRemaining}
            artPk={artPk} // artPk를 전달
            // userPk={userPk} // userPk를 전달
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
            isAuctionEnded={true}
            artName={artName}
            onPaymentComplete={handlePaymentComplete}
            artPk={artPk} // artPk를 전달
            // userPk={userPk} // userPk를 전달
            paying_pk={paying_pk}
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
            isAuctionEnded={true}
            artName={artName}
            onPaymentComplete={handlePaymentComplete}
            artPk={artPk} // artPk를 전달
            // userPk={userPk} // userPk를 전달
            paying_pk={paying_pk}
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
            isAuctionEnded={true}
            artName={artName}
            onPaymentComplete={handlePaymentComplete}
            paymentCompleted={true}
            artPk={artPk} // artPk를 전달
            // userPk={userPk} // userPk를 전달
            paying_pk={paying_pk}
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
      </div>
      <ToastContainer />
    </div>
    </>
  );  
};

export default ActionPage;