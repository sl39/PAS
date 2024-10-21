import styled from "styled-components"
import { IoIosArrowForward } from "react-icons/io";

const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin : 20px 50px 20px 50px;
`;

const Logo = styled(IoIosArrowForward)`
  width: 30px;
  height: 30px;
`;

export default function InfoBar({ text }) {
  return(
   <Div>
    <p>{text}</p>
    <Logo></Logo>
   </Div> 
  )
}