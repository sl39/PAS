import { CiMenuBurger } from "react-icons/ci";
import styled from "styled-components";
import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function SideMenu({ handleToggle }) {
  const MenuContainer = styled.div`
    position: fixed;
    width: 30vw;
    height: 100vh;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    padding: 20px;
  `;

  const CategoryContainer = styled.div`
    margin-left: 15px;
    margin-bottom: 15px;
  `;

  const MenuIcon = styled.div`
    cursor: pointer;
    margin-bottom: 30px;
  `;

  const MenuContent = styled.div`
    margin-top: 50px;
  `;

  const UnstyledLink = styled(Link)`
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  `;

  const StyledParagraph = styled.p`
    margin: 1px 0;
  `;

  const StyledHeading = styled.h3`
    margin-top: 10px;
    margin-bottom: 5px;

    font-weight: 500;
  `;

  return (
    <MenuContainer>
      <MenuIcon>
        <CiMenuBurger size={30} onClick={handleToggle} />
      </MenuIcon>
      <SearchBar></SearchBar>
      <MenuContent>
        <StyledHeading>Category</StyledHeading>
        <CategoryContainer>
          <UnstyledLink to="/">
            <StyledParagraph>유화</StyledParagraph>
            <StyledParagraph>수채화</StyledParagraph>
            <StyledParagraph>아크릴화</StyledParagraph>
            <StyledParagraph>수묵화</StyledParagraph>
            <StyledParagraph>채색화</StyledParagraph>
            <StyledParagraph>벽화</StyledParagraph>
            <StyledParagraph>판화</StyledParagraph>
            <StyledParagraph>콜라쥬</StyledParagraph>
            <StyledParagraph>풍경화</StyledParagraph>
            <StyledParagraph>인물화</StyledParagraph>
            <StyledParagraph>정물화</StyledParagraph>
            <StyledParagraph>크로키</StyledParagraph>
            <StyledParagraph>추상화</StyledParagraph>
            <StyledParagraph>누드화</StyledParagraph>
            <StyledParagraph>초상화</StyledParagraph>
          </UnstyledLink>
        </CategoryContainer>
        <UnstyledLink to="/">
          <StyledHeading>My Page</StyledHeading>
        </UnstyledLink>
        <UnstyledLink to="/">
          <StyledHeading>Subscribe & Like</StyledHeading>
        </UnstyledLink>
        <UnstyledLink to="/">
          <StyledHeading>Login</StyledHeading>
        </UnstyledLink>
      </MenuContent>
    </MenuContainer>
  );
}
