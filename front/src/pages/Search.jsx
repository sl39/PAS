import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  Header,
  SearchBar,
  SearchedArtist,
  SearchedArtwork,
  SearchFilter,
} from "../components";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { useLocation } from "react-router-dom";
import { CiFilter } from "react-icons/ci";

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

const GreyLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  justify-content: start;
  border-top: 0.5px solid lightgrey;
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
  justify-content: flex-end;
`;

const FilterBox = styled.div`
  display: flex;
  width: 50px;
  height: 20px;
  border: 1px solid black;
  align-items: center;
  cursor: pointer;
  padding: 0px 6px;
`;

// user-select: none -> 드래그 표시 안하기
const NormalParagraph = styled.p`
  user-select: none;
  font-weight: 300;
  font-size: 9px;
  margin: 0px;
`;

const BoldParagraph = styled.p`
  user-select: none;
  font-weight: 500;
  font-size: 15px;
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

let currentPath = "";

export default function Search() {
  // 작가, 작품 리스트
  const [artistList, setArtistList] = useState([]);
  const [searchedItemList, setSearchedItemList] = useState([]);

  // 검색어, 카테고리 추출
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const textParams = queryParams.get("keyword") || "";
  const categoryParams = queryParams.get("category") || "";

  // 필터 State 저장
  //const hasFetched = useRef(false);
  const [isFilterView, setIsFilterView] = useState(false);
  const [category, setCategory] = useState(categoryParams);
  const [sortBy, setSortBy] = useState("LIKE");
  const [sort, setSort] = useState("DESC");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000000000); //2조

  // 무한스크롤
  const page = useRef(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [ref, inView] = useInView({
    threshold: 0.5, // 컴포넌트의 100%가 보일 때 inView가 true로 변경
  });

  // Link 클릭 시 같은 페이지여도 새로고침 하기
  useEffect(() => {
    if (currentPath === location.pathname) window.location.reload();

    currentPath = location.pathname;
  }, [location]);

  // 작가 리스트 가져오기
  useEffect(() => {
    const options = {
      keyword: textParams,
    };

    const fetchData = async () => {
      if (options.keyword === "") {
        return;
      }

      try {
        const artistList = await searchArtistApi(options);
        setArtistList(artistList);
      } catch (error) {
        console.error("데이터를 가져오는 중에 오류가 발생했습니다: ", error);
      }
    };

    fetchData();
  }, [textParams]);

  // 작품 리스트 가져오기
  const fetchItemList = useCallback(
    async (code) => {
      const options = {
        keyword: textParams,
        category: category,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sortBy: sortBy,
        sort: sort,
        page: page.current, // 현재 페이지
      };

      try {
        // 작품 리스트 fetch
        const artworkList = await searchArtworkApi(options);
        // 상황에 따라 초기화 or 유지
        if (code === 0) {
          setSearchedItemList(artworkList.content);
        } else if (code === 1) {
          setSearchedItemList((prevList) => [
            ...prevList,
            ...artworkList.content,
          ]);
        }

        // 다음에 불러올 페이지를 +1 증가
        setHasNextPage(artworkList.content.length === 20);
        if (artworkList.content.length) {
          page.current += 1;
        }
      } catch (error) {
        console.error(error);
      }
    },
    [textParams, category, minPrice, maxPrice, sortBy, sort]
  ); //의존성 목록에 있는게 바뀌면 새로운 함수를 반환

  /* 
        필터 조건이 변경된 경우 SearchedItemList 초기화
  */
  useEffect(() => {
    page.current = 0;
    fetchItemList(0);
  }, [fetchItemList]);

  /* 
        스크롤 맨 밑에 다다를 경우 다음 페이지 로딩해서 덧붙이기
  */
  useEffect(() => {
    if (inView && hasNextPage && page.current > 0) {
      fetchItemList(1);
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
          <FilterBox onClick={() => setIsFilterView(!isFilterView)}>
            <CiFilter></CiFilter>
            <NormalParagraph>필터</NormalParagraph>
          </FilterBox>
        </FilterContainer>
        {isFilterView && (
          <SearchFilter
            categoryValue={category}
            sortByValue={sortBy}
            sortValue={sort}
            minPriceValue={minPrice}
            maxPriceValue={maxPrice}
            setCategory={setCategory}
            setSortBy={setSortBy}
            setSort={setSort}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
            setIsFilterView={setIsFilterView}
          ></SearchFilter>
        )}
      </FilterWrapContainer>
      <SearchedItemContainer>
        {textParams && artistList.length > 0 && (
          <BorderLine>
            <SearchedArtist artistList={artistList}></SearchedArtist>
          </BorderLine>
        )}
        {searchedItemList.length > 0 && (
          <BorderLine>
            <SearchedArtwork artWorkList={searchedItemList}></SearchedArtwork>
          </BorderLine>
        )}
        {!searchedItemList.length && (
          <BoldParagraph>검색 결과가 없습니다</BoldParagraph>
        )}
        <GreyLine ref={ref}></GreyLine>
      </SearchedItemContainer>
    </>
  );
}
