import React from 'react';

const AuctionResult = ({
  userBid,
  finalPrice,
  winnerName,
  winnerContact,
  winnerAddress,
  shippingMethod,
  setWinnerName,
  setWinnerContact,
  setWinnerAddress,
  setShippingMethod,
  handlePayment,
  isAuctionEnded,
}) => {
  return (
    <div>
      {isAuctionEnded ? (
        <>          
          {userBid >= finalPrice && (
            <>
              <hr />
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
          )}
        </>
      ) : (
        <p>경매가 진행 중입니다.</p>
      )}
    </div>
  );
};

export default AuctionResult;
