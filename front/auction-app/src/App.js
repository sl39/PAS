import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // 추가적인 스타일을 위한 CSS 파일

function App() {
  const [showBidModal, setShowBidModal] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(1000000);
  const [bidPrice, setBidPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState(null); // 낙찰가
  const [isAuctionEnded, setIsAuctionEnded] = useState(false); // 경매 종료 상태
  const [userBid, setUserBid] = useState(null); // 사용자의 입찰가
  const [winnerName, setWinnerName] = useState(''); // 낙찰자 이름
  const [winnerContact, setWinnerContact] = useState(''); // 낙찰자 연락처
  const [winnerAddress, setWinnerAddress] = useState(''); // 낙찰자 주소
  const [shippingMethod, setShippingMethod] = useState('일반배송'); // 배송 방법

  // 경매 등록일과 마감일 설정
  const auctionStartDate = new Date(); // 현재 날짜
  const auctionEndDate = new Date(auctionStartDate);
  auctionEndDate.setMinutes(auctionEndDate.getMinutes() + 1); // 1분 후 마감 (예시)

  const [timeRemaining, setTimeRemaining] = useState(auctionEndDate - auctionStartDate);

  // 카운트다운 함수
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const remaining = auctionEndDate - now;

      if (remaining <= 0) {
        setIsAuctionEnded(true);
        setFinalPrice(currentPrice);
        clearInterval(timer);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPrice]);

  const handleBid = () => {
    if (parseInt(bidPrice) > currentPrice) {
      setUserBid(bidPrice); // 사용자의 입찰가 저장
      setCurrentPrice(bidPrice); // 현재가를 사용자의 입찰가로 설정
      setFinalPrice(bidPrice); // 낙찰가 설정
      setShowBidModal(false);
    } else {
      setUserBid(bidPrice); // 입찰가 저장
      alert('입찰가는 현재가보다 높아야 합니다.'); // 경고 메시지
    }
  };

  const renderAuctionResult = () => {
    if (userBid && finalPrice) {
      if (parseInt(userBid) < finalPrice) {
        return (
          <div>
            <h5>입찰이 종료되었습니다.</h5>
            <h5>낙찰가: KRW {finalPrice.toLocaleString()}</h5>
            <h5>입찰가: KRW {parseInt(userBid).toLocaleString()}</h5>
          </div>
        );
      } else {
        return (
          <div>
            <h5>당신이 낙찰을 받았습니다!</h5>
            <h5>낙찰가: KRW {finalPrice.toLocaleString()}</h5>
            <div className="form-group">
              <label htmlFor="winnerName">낙찰자 이름:</label>
              <input
                type="text"
                className="form-control"
                id="winnerName"
                value={winnerName}
                onChange={(e) => setWinnerName(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </div>
            <div className="form-group">
              <label htmlFor="winnerContact">연락처:</label>
              <input
                type="text"
                className="form-control"
                id="winnerContact"
                value={winnerContact}
                onChange={(e) => setWinnerContact(e.target.value)}
                placeholder="연락처를 입력하세요"
              />
            </div>
            <div className="form-group">
              <label htmlFor="winnerAddress">주소:</label>
              <input
                type="text"
                className="form-control"
                id="winnerAddress"
                value={winnerAddress}
                onChange={(e) => setWinnerAddress(e.target.value)}
                placeholder="주소를 입력하세요"
              />
            </div>
            <div className="form-group">
              <label htmlFor="shippingMethod">배송 방법:</label>
              <select
                className="form-control"
                id="shippingMethod"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                <option value="일반배송">일반배송</option>
                <option value="특별배송">특별배송</option>
              </select>
            </div>
            <button className="btn btn-success mt-3">결제하기</button>
          </div>
        );
      }
    }
    return <h5>입찰이 종료되었습니다.</h5>;
  };

  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };

  return (
    <div className="container text-center mt-4">
      <div className="row">
        {/* 경매할 그림 이미지 */}
        <div className="col-md-6 mb-4 image-container">
          <img
            src="https://www.ccnnews.co.kr/news/photo/201511/52489_56243_00.jpg"
            className="img-fluid"
            alt="경매할 그림"
          />
        </div>

        {/* 기타 정보 */}
        <div className="col-md-6 mb-4 info-panel">
          <h5>작품 제목</h5>
          <p>작가 이름</p>
          <p>재질: 팬넬에 아크릴</p>
          <p>사이즈: 40.5 × 30 cm</p>
          <hr className="dotted-line" />
          <p>현재가: KRW {currentPrice.toLocaleString()}</p>
          <p>남은 시간: {formatTime(timeRemaining)}</p>

          {!isAuctionEnded ? (
            <button className="btn btn-primary" onClick={() => setShowBidModal(true)}>
              입찰하기
            </button>
          ) : (
            renderAuctionResult() // 경매 종료 후 결과 표시
          )}
        </div>
      </div>

      {/* 입찰 모달 */}
      {showBidModal && (
        <div className="bid-modal">
          <div className="modal-content">
            <h5>현재가: KRW {currentPrice.toLocaleString()}</h5>
            <div className="form-group">
              <label htmlFor="bidPrice">입찰가:</label>
              <input
                type="number"
                className="form-control"
                id="bidPrice"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                placeholder="입찰가를 입력하세요"
              />
            </div>
            <button className="btn btn-success" onClick={handleBid}>
              입찰하기
            </button>
            <button className="btn btn-secondary" onClick={() => setShowBidModal(false)}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
