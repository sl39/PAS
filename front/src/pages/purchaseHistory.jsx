import styled from "styled-components";
import HistoryBox from "../element/historyBox";
import BaseAppBar from "../element/appBar";
import jjang from '../img/jjang.jpg';

const ImageSize = styled.img`
  width: 25%;
  height: 25%;
`;

const ListStyle = styled.div`
  display:flex;
  flex-direction : row;
  align-items: center;
  padding: 5px;
  border : 3px solid darkgray;
  border-radius: 5px;
`;

const ArrangeBox = styled.div`
width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const AllBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  & > * {
  width: 80%;
  margin-bottom: 10px;
  }
`;

export default function PurchaseHistory() {
  return(
<>
    <BaseAppBar></BaseAppBar>
    <AllBox>  
    <HistoryBox text="구매내역"></HistoryBox>
      <ListStyle>
      <ImageSize src={jjang}></ImageSize>
        <ArrangeBox>
          <div>
            <p>작품이름</p>
            <p>작가이름</p>
            <p>입찰가격</p>
          </div>
          <div>
            <p>종료날짜</p>
          </div>
            <div>
              <p>상태</p>
            </div>
          </ArrangeBox>
      </ListStyle>
    </AllBox>
    
</>
  )
}