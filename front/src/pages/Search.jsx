import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Header,
  SearchBar,
  SearchedArtist,
  SearchedArtwork,
} from "../components";
import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { useInView } from "react-intersection-observer";
import { useLocation } from "react-router-dom";

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 30px 0px 30px;
`;

const SearchedItemContainer = styled.div`
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

const FilterWrapContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 10px 30px 30px 30px;
`;

const FilterContainer = styled.div`
  position: relative;
  max-width: 830px;
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const FilterBox = styled.div`
  display: flex;

  min-width: 50px;
  height: 20px;
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

export async function searchArtworkApi(options) {
  const response = await axios.get("https://artion.site/api/art/search", {
    params: {
      keyword: options.keyword,
      category: options.category,
      minPrice: options.minPrice,
      maxPrice: options.maxPrice,
      sortBy: options.sortBy,
      sort: options.sort,
      page: options.page, // 현재 페이지
      pageSize: 20, // 페이지당 작품 개수
    },
  });

  return response.data;
}

//prettier-ignore
export async function searchArtistApi(options) {
  const response = await axios.get("https://artion.site/api/art/search/painter", {
    params: {
      keyword: options.keyword
    },
  });
  return response.data;
}

export default function Search() {
  // 작가, 작품 리스트
  const [artistList, setArtistList] = useState([]);
  const [searchedItemList, setSearchedItemList] = useState([]);

  // 검색어, 카테고리 추출
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const textParams = queryParams.get("keyword");
  const categoryParams = queryParams.get("category");

  // 무한스크롤
  const page = useRef(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [ref, inView] = useInView({
    threshold: 0.5, // 컴포넌트의 100%가 보일 때 inView가 true로 변경
  });

  // 작가 리스트 가져오기
  useEffect(() => {
    const options = {
      keyword: textParams,
    };

    const fetchData = async () => {
      console.log("작가 리스트 검색 키워드: ", options.keyword);

      if (options.keyword === "") {
        return;
      }

      try {
        const artistList = await searchArtistApi(options);
        console.log("작가 리스트 요소 개수: ", artistList.length);
        setArtistList(artistList);
      } catch (error) {
        console.error("데이터를 가져오는 중에 오류가 발생했습니다: ", error);
      }
    };

    fetchData();
  }, [textParams]);

  // 작품 리스트 가져오기
  const fetchItemList = useCallback(async () => {
    const options = {
      keyword: textParams,
      category: categoryParams,
      minPrice: 0,
      maxPrice: 2036854000000,
      sortBy: "LIKE",
      sort: "DESC",
      page: page.current, // 현재 페이지
    };

    try {
      // 작품 리스트 fetch
      const artworkList = await searchArtworkApi(options);
      console.log("현재 페이지: ", artworkList.page);
      setSearchedItemList((prevList) => [...prevList, ...artworkList.content]);
      // 다음에 불러올 페이지를 +1 증가
      setHasNextPage(artworkList.content.length === 20);
      if (artworkList.content.length) {
        page.current += 1;
        console.log("페이지 증가: ", page.current);
      }
    } catch (error) {
      console.error(error);
    }
  }, [textParams, categoryParams]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchItemList();
      console.log("fetchItemList() 호출");
    }
  }, [fetchItemList, hasNextPage, inView]);

  return (
    <>
      <Header></Header>
      <SearchBarContainer>
        <SearchBar></SearchBar>
      </SearchBarContainer>
      <FilterWrapContainer>
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
      </FilterWrapContainer>
      <SearchedItemContainer>
        {artistList.length > 0 && (
          <BorderLine>
            <SearchedArtist artistList={artistList}></SearchedArtist>
          </BorderLine>
        )}
        <BorderLine>
          <SearchedArtwork artWorkList={searchedItemList}></SearchedArtwork>
          <BorderLine ref={ref}></BorderLine>
        </BorderLine>
      </SearchedItemContainer>
    </>
  );
}
