import React from 'react';

interface AuctionInfoProps {
  currentPrice: number;
  timeRemaining: number;
  isAuctionEnded: boolean;
  setShowBidModal: (show: boolean) => void;
  renderAuctionResult: () => JSX.Element;
}

const AuctionInfo: React.FC<AuctionInfoProps> = ({
  currentPrice,
  timeRemaining,
  isAuctionEnded,
  setShowBidModal,
  renderAuctionResult,
}) => {
  const formatTime = (time: number) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    return `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  };

  return (
    <div className="row">
      <div className="col-md-6 mb-4 image-container">
        <img
          src="https://www.ccnnews.co.kr/news/photo/201511/52489_56243_00.jpg"
          className="img-fluid"
          alt="경매할 그림"
        />
      </div>
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
          renderAuctionResult()
        )}
      </div>
    </div>
  );
};

export default AuctionInfo;
