import styled from "styled-components";
import { Link } from "react-router-dom";
import React, { useState } from "react";

// Styled Components
const HeaderContainer = styled.header`
  display: flex;
  justify-content: center;
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

export default function DefaultHeader() {

  return (
    <>
      <HeaderContainer>
        <MenuIcon>
        </MenuIcon>
          <Logo>Artion</Logo>
      </HeaderContainer>
    </>
  );
}
