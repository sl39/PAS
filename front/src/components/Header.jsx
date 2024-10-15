import { CiMenuBurger } from "react-icons/ci";
import { PiUserCircleThin } from "react-icons/pi";
import styled from "styled-components";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import SideMenu from "./SideMenu";

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen((isMenuOpen) => !isMenuOpen);
  };

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

  return (
    <>
      <HeaderContainer>
        <MenuIcon>
          <CiMenuBurger size={30} onClick={handleToggle} />
        </MenuIcon>
        <StyledLink to="/">
          <Logo>Artion</Logo>
        </StyledLink>
        <StyledLink to="/">
          <PiUserCircleThin size={40} />
        </StyledLink>
      </HeaderContainer>
      {isMenuOpen && (
        <SideMenu
          handleToggle={handleToggle}
          isMenuOpen={isMenuOpen}
        ></SideMenu>
      )}
    </>
  );
}
