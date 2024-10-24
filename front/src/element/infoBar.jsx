import styled from "styled-components"
import { IoIosArrowForward } from "react-icons/io";

const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin : 20px 50px 20px 50px;
  cursor: pointer;
`;

const Logo = styled(IoIosArrowForward)`
  width: 30px;
  height: 30px;
`;

const P = styled.p`
  margin : 5px;
`;

export default function InfoBar({ id, text, onClick }) {
  return(
   <Div onClick={onClick}>
    <P>{text}</P>
    <Logo></Logo>
   </Div> 
  )
}