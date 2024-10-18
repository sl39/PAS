import styled from "styled-components";

//검색 필터 박스
export default function SearchFilter() {
  const SearchFilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    max-width: 500px;
    min-height: 300px;
    border: 1px solid black;
  `;

  const SubjectBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px;
  `;

  const FilterSubjectBox = styled.div`
    display: flex;
    justify-content: start;
    border-bottom: 1px solid black;
    padding: 5px 20px;
  `;

  const CategoryBox = styled.div``;

  const PriceBox = styled.div``;

  const OrderBox = styled.div``;

  const BoldParagraph = styled.p`
    font-weight: 600;
    font-size: 16px;
    margin: 0px 0px;
  `;

  const NormalParagraph = styled.p`
    font-weight: 600;
    font-size: 14px;
    margin: 0px 15px 5px 0px;
  `;

  return (
    <>
      <SearchFilterContainer>
        <SubjectBox>
          <BoldParagraph>필터</BoldParagraph>
        </SubjectBox>
        <FilterSubjectBox>
          <NormalParagraph>카테고리</NormalParagraph>
          <NormalParagraph>가격</NormalParagraph>
        </FilterSubjectBox>
      </SearchFilterContainer>
    </>
  );
}
