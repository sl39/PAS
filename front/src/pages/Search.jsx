import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Header,
  SearchBar,
  SearchedArtist,
  SearchedArtwork,
} from "../components";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";

//prettier-ignore
export async function searchApi(options) {
  const response = await axios.get("http://artion.site:8080/api/art/search", {
    params: {
      keyword: options.keyword,
      category: options.category,
      minPrice: options.minPrice,
      maxPrice: options.maxPrice,
      sortBy: options.sortBy,
      sort: options.sort,
      page: options.page,   // 현재 페이지
      pageSize: 20,         // 페이지당 작품 개수
    },
  });
  return response.data;
}

export default function Search() {
  const [artistList, setArtistList] = useState([]);
  const [searchedItemList, setSearchedItemList] = useState([]);

  // 무한스크롤
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const SearchBarContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 40px 30px 0px 30px;
  `;

  const SearchedItemContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    justify-content: center;
  `;

  const FilterContainer = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 10px 30px 50px 30px;
  `;

  const FilterBox = styled.div`
    display: flex;
    width: 50px;
    height: 10px;
    border: 1px solid black;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 1px;
    margin-right: 10px;
    padding: 5px;
  `;

  const NormalParagraph = styled.p`
    font-weight: 300;
    font-size: 9px;
    margin: 0px;
  `;

  useEffect(() => {
    const options = {
      keyword: "",
      category: "",
      minPrice: 0,
      maxPrice: 2036854000000,
      sortBy: "LIKE",
      sort: "DESC",
      page: 0, // 현재 페이지
    };

    const fetchData = async () => {
      if (loading || !hasMore) return;
      setLoading(true);
      try {
        const response = await searchApi(options);
        setSearchedItemList((prev) => [...prev, ...response.content]);
        setHasMore(response.content.length > 0);
      } catch (error) {
        console.error("데이터를 가져오는 중에 오류가 발생했습니다: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading
      ) {
        return;
      }

      setPage((prev) => prev + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <>
      <Header></Header>
      <SearchBarContainer>
        <SearchBar></SearchBar>
      </SearchBarContainer>
      <FilterContainer>
        <FilterBox>
          <NormalParagraph>카테고리</NormalParagraph>
          <IoIosArrowDown size={10}></IoIosArrowDown>
        </FilterBox>
        <FilterBox>
          <NormalParagraph>가격</NormalParagraph>
          <IoIosArrowDown size={10}></IoIosArrowDown>
        </FilterBox>
        <FilterBox>
          <NormalParagraph>정렬</NormalParagraph>
          <IoIosArrowDown size={10}></IoIosArrowDown>
        </FilterBox>
      </FilterContainer>
      <SearchedItemContainer>
        <SearchedArtwork artWorkList={searchedItemList}></SearchedArtwork>
      </SearchedItemContainer>
    </>
  );
}
