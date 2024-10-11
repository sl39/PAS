import React from "react";
import styled from "styled-components";
import { Header, SearchBar } from "../components";

export default function MainFeed() {
  const MainFeedContainer = styled.div`
    margin-top: 20px;
    margin-left: 30px;
    margin-right: 30px;
  `;

  return (
    <>
      <Header></Header>
      <MainFeedContainer>
        <SearchBar></SearchBar>
      </MainFeedContainer>
    </>
  );
}
