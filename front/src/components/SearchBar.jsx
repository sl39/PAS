import React, { useState } from "react";
import styled from "styled-components";
import { IoIosSearch } from "react-icons/io";
import { Link, Navigate } from "react-router-dom";

// Styled Components
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 12px;
  border: 1px solid #000;
  width: 100%;
  max-width: 835px;
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
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;

export default function SearchBar() {
  const [searchText, setSearchText] = useState("");

  // 검색창에 입력될 때마다 저장
  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="검색"
        value={searchText}
        onChange={handleSearchChange}
      />
      <UnstyledLink to={`/search?keyword=${encodeURIComponent(searchText)}`}>
        <IoIosSearch></IoIosSearch>
      </UnstyledLink>
    </SearchContainer>
  );
}
