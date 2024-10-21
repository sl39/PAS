import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  onPaymentComplete,
  paymentCompleted, // 결제 완료 상태 prop 추가
}) => {
  useEffect(() => {
    // 아임포트 스크립트를 동적으로 로드합니다.
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      // 1. 경매 상세 정보에서 paying_pk 가져오기
      const response = await axios.get('/api/auction/detail', {
        params: { artPk: 7, userPk: 7 }, // 필요한 매개변수로 요청
      });
      const fetchedPayingPk = response.data.paying_pk; // 서버에서 받아온 paying_pk

      // 2. 결제 요청
      const IMP = window.IMP; // 아임포트 객체
      IMP.init("imp08864537"); // 가맹점 식별코드

      IMP.request_pay({
        pg: 'html5_inicis', // 결제 서비스 제공자
        pay_method: 'card', // 결제 방식
        merchant_uid: `merchant_${new Date().getTime()}`, // 결제 고유 번호
        name: artName, // 상품명
        amount: finalPrice, // 가격
        buyer_name: winnerName, // 구매자 이름
        buyer_tel: winnerContact, // 구매자 연락처
        buyer_addr: winnerAddress, // 구매자 주소
        buyer_postcode: '123-456', // 구매자 우편번호
      }, async function (rsp) {
        console.log('결제 요청 결과:', rsp);
        if (rsp.success) {
          alert('결제가 완료되었습니다.');
          // 3. 결제 정보를 서버에 전송
          try {
            await axios.post('/api/order', {
              address_order: winnerAddress,  // 배송 주소
              delivery_type: shippingMethod,  // 배송 방법
              imp_uid: rsp.imp_uid,           // 결제 승인 번호
              merchant_uid: rsp.merchant_uid, // 결제 고유 번호
              paying_pk: fetchedPayingPk,     // 자동 생성된 paying_pk
              name: winnerName,               // 구매자 이름
              phone_number: winnerContact,     // 구매자 연락처
            });

            // 결제 완료 후 상위 컴포넌트에게 상태 변경 요청
            onPaymentComplete(); // state 값을 3으로 변경
            alert('주문이 성공적으로 처리되었습니다.');
          } catch (error) {
            console.error('주문 전송 오류:', error.response ? error.response.data : error.message);
            alert('주문 처리에 실패하였습니다. 이유: ' + (error.response ? error.response.data : error.message));
          }
        } else {
          alert(`결제에 실패하였습니다. 이유: ${rsp.error_msg}`);
        }
      });
    } catch (error) {
      console.error('paying_pk 가져오기 오류:', error);
      alert('paying_pk를 가져오는 데 실패하였습니다.');
    }
  };

  return (
    <div>
      {isAuctionEnded ? (
        <>
          {paymentCompleted ? ( // 결제 완료 상태 확인
            <h2>결제가 완료되었습니다.</h2>
          ) : (
            userBid > 0 && userBid >= finalPrice ? (
              <>
                <h2>축하합니다! 낙찰되었습니다.</h2>
                <h2>최종 낙찰가: KRW {finalPrice?.toLocaleString() || '없음'}</h2>
                <h2>내 입찰가: KRW {userBid?.toLocaleString() || '없음'}</h2>
                <hr className="dotted-line" />
                <h2>결제 정보 입력</h2>
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
                <h2>낙찰에 실패하였습니다.</h2>
                <h2>최종 낙찰가: KRW {finalPrice?.toLocaleString() || '없음'}</h2>
                <h2>내 입찰가: KRW {userBid?.toLocaleString() || '없음'}</h2>
              </>
            )
          )}
        </>
      ) : (
        <p>경매가 진행 중입니다.</p>
      )}
    </div>  
  );
};

export default AuctionResult;
