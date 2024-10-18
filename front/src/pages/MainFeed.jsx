import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Header, MainFeedItem, SearchBar } from "../components";
import axios from "axios";

export async function NewFeedApi() {
  const response = await axios.get(
    "https://artion.site/api/art/main/recent"
  );
  return response.data;
}

export async function BestFeedApi() {
  const response = await axios.get(
    "https://artion.site/api/art/main/popular"
  );
  return response.data;
}

export default function MainFeed() {
  const [newItemList, setNewItemList] = useState([]);
  const [bestItemList, setBestItemList] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newItemList = await NewFeedApi();
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
        const bestItemList = await BestFeedApi();
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
        <MainFeedItem type={"best"} artWorkList={bestItemList}></MainFeedItem>
        <MainFeedItem type={"new"} artWorkList={newItemList}></MainFeedItem>
      </MainFeedContainer>
    </>
  );
}
