import { MdArrowBack } from "react-icons/md";

import styled from "styled-components";
import { Link } from "react-router-dom";
import React, { useState } from "react";

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

const StyledLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;

const Div = styled.div`
  width: 30px;
  height: 30px;
`;

export default function Header() {
 
  return (
    <>
      <HeaderContainer>
        <MenuIcon>
        <StyledLink to="/">
          <MdArrowBack size={30} />
          </StyledLink>
        </MenuIcon>
        <StyledLink to="/">
          <Logo>Artion</Logo>
        </StyledLink>
        <Div></Div> 
      </HeaderContainer>
    </>
  );
}
