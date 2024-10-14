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

  const handlePayment = () => {
    const IMP = window.IMP; // 아임포트 객체
    IMP.init("imp08864537"); // 가맹점 식별코드
  
    IMP.request_pay({
      pg: 'html5_inicis', // 새로운 PG 코드
      pay_method: 'card', // 결제 방식
      merchant_uid: `merchant_${new Date().getTime()}`, // 결제 고유 번호
      name: artName, // 상품명
      amount: finalPrice, // 가격
      buyer_email: 'test@example.com', // 구매자 이메일
      buyer_name: winnerName, // 구매자 이름
      buyer_tel: winnerContact, // 구매자 연락처
      buyer_addr: winnerAddress, // 구매자 주소
      buyer_postcode: '123-456', // 구매자 우편번호
    }, function (rsp) {
      console.log('결제 요청 결과:', rsp); // 응답 로그 추가
      if (rsp.success) {
        // 결제 성공 처리
        alert('결제가 완료되었습니다.');
        // 추가적인 처리 로직
      } else {
        alert(`결제에 실패하였습니다. 이유: ${rsp.error_msg}`);
      }
    });
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
