import BaseAppBar from '../element/appBar';
import jjang from '../img/jjang.jpg';
import styled from "styled-components";

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
  &>*{
    width: 80%;
  }
`;

const InputDivSize = styled.div`
   &>*{
    width: 100%;
  }
`;

const InputSize = styled.input`
  font-size: 20px;
`;

const Pstyle = styled.p`
  font-size: 20px;
`;

export default function Receipt() {
  return(
    <>
    <BaseAppBar></BaseAppBar>
    <AllBox>
    <Pstyle>주문상세</Pstyle>
       <ListStyle>
        <ImageSize src={jjang}></ImageSize>
        <ArrangeBox>
          <div>
            <p>작품이름</p>
            <p>작가이름</p>
            <p>낙찰가격</p>
          </div>
          <div>
            <p>종료날짜</p>
          </div>
          </ArrangeBox>
      </ListStyle> 
      <InputDivSize>
        <p>낙찰가격</p>
        <InputSize type="text" value="100000" disabled></InputSize>
        <p>결제정보</p>
        <InputSize type="text" value="BC카드, 일시불" disabled></InputSize>
        <p>배송방식</p>
        <InputSize type="text" value="픽업" disabled></InputSize>
      </InputDivSize>
      </AllBox>
    </>
  )
}
