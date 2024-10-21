import styled from "styled-components"
import InfoBar from "./infoBar";

const Div = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly; 
  background-color: lightgray;
  border-radius: 20px;
`;

const P = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Line = styled.div`
  border-left: 2px solid darkgray;
  height: auto;
`;

const Pstyle = styled.p`
  font-size: 20px;
`;

export default function HistoryBox({text}) {
  return(
  <>
  <Pstyle>{text}</Pstyle>
    <Div>
      <div>
        <p>전체</p>
        <P>0</P>
      </div>
      <Line />
      <div>
        <p>입찰</p>
        <P>0</P>
      </div>
      <Line />
      <div>
        <p>낙찰</p>
        <P>0</P>
      </div>
      <Line />
      <div>
        <p>종료</p>
        <P>0</P>
      </div>
    </Div>
  </>
  )
}