import styled from "styled-components";
import React, { useState } from "react";

const FilterContainer = styled.div`
  position: fixed;
  width: 100%;
  max-width: 850px;
  height: 450px;
  bottom: 0;
  z-index: 1;
  border: 1px solid grey;
  background-color: white;

  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px 20px 20px 20px;
`;

const CategoryBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  margin-bottom: 10px;
  padding: 10px 10px 20px 10px;
`;

const OrderBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  margin-bottom: 10px;
  padding: 10px 10px 20px 10px;
`;

const PriceBox = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  margin-bottom: 10px;
  padding: 10px 10px;
`;

const CloseBoxWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const CloseBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 25px;
  background-color: white;
  border: 1px solid grey;
  margin: 10px 0px;
  cursor: pointer;
`;

// 조건부 스타일링
const OptionItem = styled.div`
  display: inline-flex;
  height: 20px;
  align-items: center;
  justify-content: center;
  border: 1px solid lightgrey;
  border-radius: 10px;
  padding: 10px 9px;
  background-color: ${(props) => (props.isSelected ? "lightgray" : "white")};
  margin: 0px 7px 7px 0px;
  cursor: pointer;
`;

//const SliderBox = styled.div`
//  width: 100%;
//`;

// -webkit-appearance: none -> 브라우저 기본 스타일 제거
// -webkit-slider-runnable-track -> 슬라이더의 배경
// -webkit-slider-thumb -> 슬라이더 손잡이

/* 
const SliderItem = styled.input`
  width: 100%;
  -webkit-appearance: none;

  &::-webkit-slider-runnable-track {
    background: #ddd;
    height: 8px;
    border-radius: 4px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: #fff;
    border: 2px solid #ddd;
    border-radius: 50%;
    height: 15px;
    width: 15px;
    margin-top: -3px;
  }
`;*/

const NormalParagraph = styled.p`
  user-select: none;
  font-weight: 400;
  font-size: 12px;
  margin: 0px;
`;

const SmallParagraph = styled.p`
  user-select: none;
  font-weight: 400;
  font-size: 10px;
  margin: 0px;
`;

export default function SearchFilter({
  categoryValue,
  sortByValue,
  sortValue,
  minPriceValue,
  maxPriceValue,
  setCategory,
  setSortBy,
  setSort,
  setMinPrice,
  setMaxPrice,
  setIsFilterView,
}) {
  const categories = [
    { key: 1, name: "전체", value: "" },
    { key: 2, name: "유화", value: "유화" },
    { key: 3, name: "수채화", value: "수채화" },
    { key: 4, name: "아크릴화", value: "아크릴화" },
    { key: 5, name: "수묵화", value: "수묵화" },
    { key: 6, name: "채색화", value: "채색화" },
    { key: 7, name: "벽화", value: "벽화" },
    { key: 8, name: "판화", value: "판화" },
    { key: 9, name: "콜라쥬", value: "콜라쥬" },
    { key: 10, name: "풍경화", value: "풍경화" },
    { key: 11, name: "인물화", value: "인물화" },
    { key: 12, name: "정물화", value: "정물화" },
    { key: 13, name: "크로키", value: "크로키" },
    { key: 14, name: "추상화", value: "추상화" },
    { key: 15, name: "누드화", value: "누드화" },
    { key: 16, name: "초상화", value: "초상화" },
  ];

  const orderOptions = [
    { name: "좋아요 많은순", value: 1, sortBy: "LIKE", sort: "DESC" },
    { name: "높은 가격순", value: 2, sortBy: "PRICE", sort: "DESC" },
    { name: "낮은 가격순", value: 3, sortBy: "PRICE", sort: "ASC" },
    { name: "최신순", value: 4, sortBy: "DATE", sort: "DESC" },
  ];

  const priceOptions = [
    { name: "전체", value: 1, min: 0, max: 2000000000000 },
    { name: "50,000원 이하", value: 2, min: 0, max: 50000 },
    { name: "50,000원~100,000원", value: 3, min: 50000, max: 100000 },
    { name: "100,000원~300,000원", value: 4, min: 100000, max: 300000 },
    { name: "300,000원~500,000원", value: 5, min: 300000, max: 500000 },
    { name: "500,000원 이상", value: 6, min: 500000, max: 2000000000000 },
  ];

  const [selectedCategory, setSelectedCategory] = useState(
    categories.find((category) => category.value === categoryValue).key
  );
  const [selectedOrder, setSelectedOrder] = useState(
    orderOptions.find(
      (order) => order.sortBy === sortByValue && order.sort === sortValue
    ).value
  );
  const [selectedPrice, setSelectedPrice] = useState(
    priceOptions.find(
      (price) => price.min === minPriceValue && price.max === maxPriceValue
    ).value
  );

  const clickCategory = (key, value) => {
    console.log("카테고리 선택: ", value);
    setCategory(value);
    setSelectedCategory(key);
  };

  const clickOrder = (value, sortBy, sort) => {
    console.log("정렬 선택 -> 정렬기준 ", sortBy, " 정렬방법 ", sort);
    setSortBy(sortBy);
    setSort(sort);
    setSelectedOrder(value);
  };

  const clickPrice = (value, min, max) => {
    console.log("가격대 선택 -> 최소 ", min, " 최대 ", max);
    setMinPrice(min);
    setMaxPrice(max);
    setSelectedPrice(value);
  };

  return (
    <FilterContainer>
      <NormalParagraph>카테고리</NormalParagraph>
      <CategoryBox>
        {categories.map((category) => (
          <OptionItem
            key={category.key}
            isSelected={selectedCategory === category.key}
            onClick={() => clickCategory(category.key, category.value)}
          >
            <SmallParagraph>{category.name}</SmallParagraph>
          </OptionItem>
        ))}
      </CategoryBox>
      <NormalParagraph>정렬</NormalParagraph>
      <OrderBox>
        {orderOptions.map((order) => (
          <OptionItem
            key={order.value}
            isSelected={selectedOrder === order.value}
            onClick={() => clickOrder(order.value, order.sortBy, order.sort)}
          >
            <SmallParagraph>{order.name}</SmallParagraph>
          </OptionItem>
        ))}
      </OrderBox>
      <NormalParagraph>가격대</NormalParagraph>
      <PriceBox>
        {priceOptions.map((price) => (
          <OptionItem
            key={price.value}
            isSelected={selectedPrice === price.value}
            onClick={() => clickPrice(price.value, price.min, price.max)}
          >
            <SmallParagraph>{price.name}</SmallParagraph>
          </OptionItem>
        ))}
        {/* <SliderBox>
          <SliderItem
            type="range"
            min="0"
            max="1000000"
            value={minValue}
            onChange={(e) => { 
              const value = Math.min(Number(e.target.value), maxValue);
              setMinValue(value);
            }}
          />
          <SliderItem
            type="range"
            min="0"
            max="1000000"
            value={maxValue}
            onChange={(e) => {
              const value = Math.max(Number(e.target.value), minValue);
              setMaxValue(value);
            }}
          />
        </SliderBox> */}
      </PriceBox>
      <CloseBoxWrapper>
        <CloseBox onClick={() => setIsFilterView(false)}>
          <NormalParagraph>닫기</NormalParagraph>
        </CloseBox>
      </CloseBoxWrapper>
    </FilterContainer>
  );
}
