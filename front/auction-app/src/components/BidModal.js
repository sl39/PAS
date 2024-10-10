import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const BidModal = ({ showBidModal, setShowBidModal, bidPrice, setBidPrice, handleBid, currentPrice }) => {
  const handleSubmit = () => {
    handleBid(Number(bidPrice)); // 입력한 값을 숫자로 변환하여 전달
    setBidPrice(''); // 입력 필드 초기화
    setShowBidModal(false); // 모달 닫기
  };

  return (
    <Modal show={showBidModal} onHide={() => setShowBidModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>입찰하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="number"
          className="form-control"
          placeholder={`현재가: KRW ${currentPrice.toLocaleString()}`}
          value={bidPrice}
          onChange={(e) => setBidPrice(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowBidModal(false)}>
          닫기
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          입찰
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BidModal;
