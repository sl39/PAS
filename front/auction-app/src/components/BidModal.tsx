import React from 'react';

interface BidModalProps {
  showBidModal: boolean;
  setShowBidModal: (show: boolean) => void;
  bidPrice: string;
  setBidPrice: (price: string) => void;
  handleBid: () => void;
  currentPrice: number;
}

const BidModal: React.FC<BidModalProps> = ({ showBidModal, setShowBidModal, bidPrice, setBidPrice, handleBid, currentPrice }) => {
  return (
    showBidModal && (
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
    )
  );
};

export default BidModal;
