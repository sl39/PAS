import { CiMenuBurger } from "react-icons/ci";
import { PiUserCircleThin } from "react-icons/pi";
import styled from "styled-components";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import SideMenu from "./SideMenu";
import axios from "axios";

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

export async function userFeedApi() {
  const response = await axios.get("https://artion.site/api/user/mine",  {
    withCredentials: true,
  });
  return response.data;
}

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [userPk, setUserPk] = useState(0);

  const handleToggle = () => {
    setMenuOpen((isMenuOpen) => !isMenuOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
      const User = await userFeedApi();
      setUserPk(User)
       
      } catch (error) {
        console.error("데이터를 가져오는 중에 오류가 발생했습니다: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <HeaderContainer>
        <MenuIcon>
          <CiMenuBurger size={30} onClick={handleToggle} />
        </MenuIcon>
        <StyledLink to="/">
          <Logo>Artion</Logo>
        </StyledLink>
        <StyledLink to={`/artist/${userPk}`}>
          <PiUserCircleThin size={40} />
        </StyledLink>
      </HeaderContainer>
      {isMenuOpen && (
        <SideMenu
          handleToggle={handleToggle}
          isMenuOpen={isMenuOpen}
          myPk={userPk}
        ></SideMenu>
      )}
    </>
  );
}
