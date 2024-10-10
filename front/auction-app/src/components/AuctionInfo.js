import React from 'react';

const AuctionInfo = ({
  artImages,
  created,
  curator,
  artName,
  artistName,
  startPrice,
  maxPrice,
  currentPrice,
  timeRemaining,
  setShowBidModal,
  isAuctionEnded,
  myCurrentPrice, // 실제 입력한 입찰가
}) => {
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
        {artImages.length > 0 && (
          <img
            src={artImages[0]} // 첫 번째 이미지를 표시
            className="img-fluid"
            alt={artName}
          />
        )}
      </div>
      <div className="col-md-6 mb-4 info-panel">
        <h5>{artName}</h5>
        <p>작가: {artistName}</p>
        <p>재질: 팬넬에 아크릴</p>
        <p>사이즈: 40.5 × 30 cm</p>
        <p>제작일: {created}</p>
        <p>큐레이터: {curator ? '있음' : '없음'}</p>
        <hr className="dotted-line" />
        
        {isAuctionEnded && myCurrentPrice >= currentPrice ? (
          <>
            <p>최종 낙찰가: KRW {currentPrice.toLocaleString()}</p>
            <p>내 입찰가: KRW {myCurrentPrice?.toLocaleString() || '없음'}</p>
          </>
        ) : (
          <>
            <p>시작가: KRW {startPrice.toLocaleString()}</p>
            <p>최대가: KRW {maxPrice.toLocaleString()}</p>
            <p>현재가: KRW {currentPrice.toLocaleString()}</p>
            <p>내 입찰가: KRW {myCurrentPrice?.toLocaleString() || '없음'}</p>
            <p>남은 시간: {isAuctionEnded ? '0일 0시간 0분 0초' : formatTime(timeRemaining)}</p>
            {!isAuctionEnded && (
              <button className="btn btn-primary" onClick={() => setShowBidModal(true)}>
                입찰하기
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuctionInfo;
