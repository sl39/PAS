import { MdArrowBack } from "react-icons/md";
import styled from "styled-components";
import React from "react";
import { useNavigate } from "react-router-dom";

// Styled Components
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
`;

const MenuIcon = styled.div`
  cursor: pointer;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 35px;
  font-weight: 300;
  user-select: none;
`;

const Div = styled.div`
  width: 30px;
  height: 30px;
`;

export default function BackHeader() {
  const navigate = useNavigate();

  const handleClick = () => {
    const userConfirmed = window.confirm("변경사항이 저장되지 않습니다. 페이지를 나가시겠습니까?");
    if (userConfirmed) {
      navigate(-1); 
    } else {
      alert("취소되었습니다.");
    }
  };

  const handleClick2 = () => {
    const userConfirmed = window.confirm("변경사항이 저장되지 않습니다. 페이지를 나가시겠습니까?");

    if (userConfirmed) {
      navigate('/'); 
    } else {
      alert("취소되었습니다.");
    }
  };

  return (
    <>
      <HeaderContainer>
        <MenuIcon>
          <MdArrowBack size={30} onClick={handleClick} />
        </MenuIcon>
          <Logo onClick={handleClick2}>Artion</Logo>
        <Div></Div> 
      </HeaderContainer>
    </>
  );
}
