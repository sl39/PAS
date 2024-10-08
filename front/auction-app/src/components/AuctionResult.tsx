import React from 'react';

interface AuctionResultProps {
  userBid: string | null;
  finalPrice: number | null;
  winnerName: string;
  winnerContact: string;
  winnerAddress: string;
  shippingMethod: string;
  setWinnerName: (name: string) => void;
  setWinnerContact: (contact: string) => void;
  setWinnerAddress: (address: string) => void;
  setShippingMethod: (method: string) => void;
  handlePayment: () => void;
}

const AuctionResult: React.FC<AuctionResultProps> = ({
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
}) => {
  return (
    <div>
      {userBid && finalPrice ? (
        parseInt(userBid) < finalPrice ? (
          <div>
            <h5>입찰이 종료되었습니다.</h5>
            <h5>낙찰가: KRW {finalPrice?.toLocaleString()}</h5>
            <h5>입찰가: KRW {parseInt(userBid)?.toLocaleString()}</h5>
          </div>
        ) : (
          <div>
            <h5>당신이 낙찰을 받았습니다!</h5>
            <h5>낙찰가: KRW {finalPrice?.toLocaleString()}</h5>
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
            <div className="form-group select-container">
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
            <button className="btn btn-success mt-3" onClick={handlePayment}>
              결제하기
            </button>
          </div>
        )
      ) : (
        <h5>입찰이 종료되었습니다.</h5>
      )}
    </div>
  );
};

export default AuctionResult;
