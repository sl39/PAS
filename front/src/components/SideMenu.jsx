import { TfiClose } from "react-icons/tfi";
import styled from "styled-components";
import React from "react";
import { Link } from "react-router-dom";

const MenuContainer = styled.div`
  position: fixed;
  width: 200px;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1;
  padding: 20px 35px 20px 20px;
  background-color: white;
`;

const CategoryContainer = styled.div`
  margin: 10px 0px 15px 10px;
`;

const MenuIcon = styled.div`
  cursor: pointer;
  margin-bottom: 30px;
`;

const MenuContent = styled.div`
  margin-top: 0px;
`;

const StyledLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;

const StyledParagraph = styled.p`
  margin: 0px;
  font-weight: 500;
  font-size: 15px;
  user-select: none;
`;

const StyledHeading = styled.h3`
  margin-top: 10px;
  margin-bottom: 0px;
  font-weight: 500;
  font-size: 18px;
  user-select: none;
`;

export default function SideMenu({ handleToggle, isMenuOpen }) {
  const categories = [
    { name: "유화", value: "유화" },
    { name: "수채화", value: "수채화" },
    { name: "아크릴화", value: "아크릴화" },
    { name: "수묵화", value: "수묵화" },
    { name: "채색화", value: "채색화" },
    { name: "벽화", value: "벽화" },
    { name: "판화", value: "판화" },
    { name: "콜라쥬", value: "콜라쥬" },
    { name: "풍경화", value: "풍경화" },
    { name: "인물화", value: "인물화" },
    { name: "정물화", value: "정물화" },
    { name: "크로키", value: "크로키" },
    { name: "추상화", value: "추상화" },
    { name: "누드화", value: "누드화" },
    { name: "초상화", value: "초상화" },
  ];

  return (
    <MenuContainer>
      <MenuIcon>
        <TfiClose size={20} onClick={handleToggle} />
      </MenuIcon>
      <MenuContent>
        <StyledHeading>Category</StyledHeading>
        <CategoryContainer>
          {categories.map((category) => (
            <StyledLink
              key={category.value}
              to={`/search?category=${encodeURIComponent(category.value)}`}
            >
              <StyledParagraph>{category.name}</StyledParagraph>
            </StyledLink>
          ))}
        </CategoryContainer>
        <StyledLink to="/">
          <StyledHeading>My Page</StyledHeading>
        </StyledLink>
        <StyledLink to="/following/liked">
          <StyledHeading>Subscribe & Like</StyledHeading>
        </StyledLink>
        <StyledLink to="/">
          <StyledHeading>Login</StyledHeading>
        </StyledLink>
      </MenuContent>
    </MenuContainer>
  );
}
