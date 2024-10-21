import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Header, MainFeedItem, SearchBar } from "../components";
import axios from "axios";

export async function newFeedApi() {
  const response = await axios.get("https://artion.site/api/art/main/recent");
  return response.data;
}

export async function bestFeedApi() {
  const response = await axios.get("https://artion.site/api/art/main/popular");
  return response.data;
}

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 30px 50px 30px;
`;

const MainFeedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  justify-content: center;
`;

const BorderLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  justify-content: start;
  border-top: 1px solid black;
  width: 850px;
`;

export default function MainFeed() {
  const [newItemList, setNewItemList] = useState([]);
  const [bestItemList, setBestItemList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newItemList = await newFeedApi();
        setNewItemList(newItemList);
      } catch (error) {
        console.error("데이터를 가져오는 중에 오류가 발생했습니다: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bestItemList = await bestFeedApi();
        setBestItemList(bestItemList);
      } catch (error) {
        console.error("데이터를 가져오는 중에 오류가 발생했습니다: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Header></Header>
      <SearchBarContainer>
        <SearchBar></SearchBar>
      </SearchBarContainer>
      <MainFeedContainer>
        <BorderLine>
          <MainFeedItem type={"best"} artWorkList={bestItemList}></MainFeedItem>
        </BorderLine>
        <BorderLine>
          <MainFeedItem type={"new"} artWorkList={newItemList}></MainFeedItem>
        </BorderLine>
      </MainFeedContainer>
    </>
  );
}
