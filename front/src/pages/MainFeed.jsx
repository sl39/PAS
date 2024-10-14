import React from "react";
import styled from "styled-components";
import { Header, MainFeedItem, SearchBar } from "../components";

export default function MainFeed() {
  const SearchBarContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 40px 30px 0px 30px;
  `;

  const MainFeedContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    justify-content: center;
  `;

  return (
    <>
      <Header></Header>
      <SearchBarContainer>
        <SearchBar></SearchBar>
      </SearchBarContainer>
      <MainFeedContainer>
        <MainFeedItem></MainFeedItem>
        <MainFeedItem></MainFeedItem>
      </MainFeedContainer>
    </>
  );
}
