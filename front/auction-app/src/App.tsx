import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BidModal from './components/BidModal';
import AuctionInfo from './components/AuctionInfo';
import AuctionResult from './components/AuctionResult';

interface Bid {
  price: string;
  bidder: string;
}

const App: React.FC = () => {
  const [showBidModal, setShowBidModal] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number>(1000000);
  const [bidPrice, setBidPrice] = useState<string>('');
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [isAuctionEnded, setIsAuctionEnded] = useState<boolean>(false);
  const [userBid, setUserBid] = useState<string | null>(null);
  const [winnerName, setWinnerName] = useState<string>('');
  const [winnerContact, setWinnerContact] = useState<string>('');
  const [winnerAddress, setWinnerAddress] = useState<string>('');
  const [shippingMethod, setShippingMethod] = useState<string>('일반배송');

  const auctionStartDate = new Date();
  const auctionEndDate = new Date(auctionStartDate);
  auctionEndDate.setMinutes(auctionEndDate.getMinutes() + 1);

  const [timeRemaining, setTimeRemaining] = useState<number>(auctionEndDate.getTime() - auctionStartDate.getTime());
  const [bids, setBids] = useState<Bid[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const remaining = auctionEndDate.getTime() - now.getTime();

      if (remaining <= 0) {
        setIsAuctionEnded(true);
        setFinalPrice(currentPrice);
        sendKakaoMessage(currentPrice); // 경매 종료 시 카카오톡 메시지 전송
        clearInterval(timer);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPrice]);

  const handleBid = () => {
    if (parseInt(bidPrice) > currentPrice) {
      const newBid: Bid = {
        price: bidPrice,
        bidder: `Bidder ${bids.length + 1}`,
      };
      setBids([...bids, newBid]);
      setUserBid(bidPrice);
      setCurrentPrice(parseInt(bidPrice));
      setFinalPrice(parseInt(bidPrice));
      setShowBidModal(false);
    } else {
      alert('입찰가는 현재가보다 높아야 합니다.');
    }
  };

  const handlePayment = () => {
    const paymentData = {
      price: finalPrice,
      name: winnerName,
      contact: winnerContact,
      address: winnerAddress,
      shippingMethod: shippingMethod,
    };
    // KG이니시스 결제 요청을 위한 API 호출
    fetch('http://localhost:3000/your_payment_api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('결제가 완료되었습니다.');
        } else {
          alert('결제에 실패했습니다. 다시 시도하세요.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('결제 처리 중 오류가 발생했습니다.');
      });
  };

  const sendKakaoMessage = (price: number | null) => {
    const contact = '010-5597-4662'; // 임의의 연락처

    const kakaoMessageData = {
      to: contact, // 카카오톡으로 보낼 전화번호
      template_object: {
        object_type: 'text',
        text: `축하합니다! 낙찰가: KRW ${price?.toLocaleString()}입니다.`,
        link: {
          web_url: 'http://localhost:3000', // 링크 클릭 시 이동할 URL
        },
      },
    };

    // 카카오톡 메시지 API 호출
    fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer YOUR_ACCESS_TOKEN`, // 실제 토큰으로 교체
      },
      body: JSON.stringify(kakaoMessageData),
    })
      .then(response => {
        if (response.ok) {
          alert('카카오톡 메시지를 성공적으로 보냈습니다.');
        } else {
          alert('카카오톡 메시지 전송에 실패했습니다.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('카카오톡 메시지 전송 중 오류가 발생했습니다.');
      });
  };

  return (
    <div className="container text-center mt-4">
      <AuctionInfo
        currentPrice={currentPrice}
        timeRemaining={timeRemaining}
        isAuctionEnded={isAuctionEnded}
        setShowBidModal={setShowBidModal}
        renderAuctionResult={() => (
          <AuctionResult
            userBid={userBid}
            finalPrice={finalPrice}
            winnerName={winnerName}
            winnerContact={winnerContact}
            winnerAddress={winnerAddress}
            shippingMethod={shippingMethod}
            setWinnerName={setWinnerName}
            setWinnerContact={setWinnerContact}
            setWinnerAddress={setWinnerAddress}
            setShippingMethod={setShippingMethod}
            handlePayment={handlePayment}
          />
        )}
      />
      <BidModal
        showBidModal={showBidModal}
        setShowBidModal={setShowBidModal}
        bidPrice={bidPrice}
        setBidPrice={setBidPrice}
        handleBid={handleBid}
        currentPrice={currentPrice}
      />
    </div>
  );
};

export default App;
