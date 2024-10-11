import React, { useEffect, useState } from 'react';

const AuctionResult = ({
  userBid,
  finalPrice,
  winnerName,
  winnerContact,
  winnerAddress,
  shippingMethod,
  artName,
  setWinnerName,
  setWinnerContact,
  setWinnerAddress,
  setShippingMethod,
  isAuctionEnded,
}) => {
  const [isImpLoaded, setIsImpLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    script.onload = () => setIsImpLoaded(true);
    document.body.appendChild(script);
  }, []);  

  const handlePayment = async () => {
    try {
      const response = await fetch('/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalPrice,
          buyerName: winnerName,
          buyerTel: winnerContact,
          buyerEmail: 'test@example.com', // 테스트 이메일
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('결제가 완료되었습니다.');
        // 결제 성공 후 처리 로직
      } else {
        alert(`결제에 실패하였습니다. 이유: ${data.message}`);
      }
    } catch (error) {
      alert('결제 요청 중 오류가 발생했습니다.');
      console.error(error);
    }
  };  

  return (
    <div>
      {isAuctionEnded ? (
        <>
          {userBid > 0 && userBid >= finalPrice ? (
            <>
              <h4>축하합니다! 낙찰되었습니다.</h4>
              <p>최종 낙찰가: KRW {finalPrice?.toLocaleString() || '없음'}</p>
              <p>내 입찰가: KRW {userBid?.toLocaleString() || '없음'}</p>
              <h4>결제 정보 입력</h4>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="이름"
                  value={winnerName}
                  onChange={(e) => setWinnerName(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="연락처"
                  value={winnerContact}
                  onChange={(e) => setWinnerContact(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="주소"
                  value={winnerAddress}
                  onChange={(e) => setWinnerAddress(e.target.value)}
                />
                <select
                  className="form-control mb-2"
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                >
                  <option value="일반배송">일반배송</option>
                  <option value="빠른배송">빠른배송</option>
                </select>
                <button className="btn btn-success mt-2" onClick={handlePayment}>
                  결제하기
                </button>
              </div>
            </>
          ) : (
            <>
              <h4>낙찰에 실패하였습니다.</h4>
              <p>최종 낙찰가: KRW {finalPrice?.toLocaleString() || '없음'}</p>
              <p>내 입찰가: KRW {userBid?.toLocaleString() || '없음'}</p>
            </>
          )}
        </>
      ) : (
        <p>경매가 진행 중입니다.</p>
      )}
    </div>
  );
};

export default AuctionResult;
