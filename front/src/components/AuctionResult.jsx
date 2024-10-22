import React, { useEffect } from 'react';
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
  paymentCompleted,
  artPk, // artPk를 props로 추가
  userPk, // userPk를 props로 추가
}) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      const response = await axios.get('/api/auction/detail', {
        params: { artPk, userPk }, // props로 받은 값을 사용
      });
      const fetchedPayingPk = response.data.paying_pk;

      const IMP = window.IMP;
      IMP.init("imp08864537");

      IMP.request_pay({
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: `merchant_${new Date().getTime()}`,
        name: artName,
        amount: finalPrice,
        buyer_name: winnerName,
        buyer_tel: winnerContact,
        buyer_addr: winnerAddress,
        buyer_postcode: '123-456',
      }, async function (rsp) {
        if (rsp.success) {
          alert('결제가 완료되었습니다.');

          try {
            await axios.post('/api/order', {
              address_order: winnerAddress,
              delivery_type: shippingMethod,
              imp_uid: rsp.imp_uid,
              merchant_uid: rsp.merchant_uid,
              paying_pk: fetchedPayingPk,
              name: winnerName,
              phone_number: winnerContact,
            });

            onPaymentComplete();
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

  const isFormValid = () => {
    return winnerName && winnerContact && winnerAddress && shippingMethod;
  };

  return (
    <div>
      {isAuctionEnded ? (
        <>
          {paymentCompleted ? (
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
                  <button 
                    className="btn btn-success mt-2" 
                    onClick={handlePayment}
                    disabled={!isFormValid()} // 유효성 검사 추가
                  >
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
