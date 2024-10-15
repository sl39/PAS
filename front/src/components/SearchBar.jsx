import React from "react";
import styled from "styled-components";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";

export default function SearchBar() {
  // Styled Components
  const SearchContainer = styled.div`
    display: flex;
    align-items: center;
    padding-right: 12px;
    border: 1px solid #000;
    max-width: 835px;
    width: 100%;
  `;

  const SearchInput = styled.input`
    flex-grow: 1;
    padding: 7px;
    font-size: 13px;
    border: none;
    outline: none;
    margin-right: 12px;
  `;

  const UnstyledLink = styled(Link)`
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  `;

  return (
    <SearchContainer>
      <SearchInput type="text" />
      <UnstyledLink to="/search">
        <IoIosSearch></IoIosSearch>
      </UnstyledLink>
    </SearchContainer>
  );
}
