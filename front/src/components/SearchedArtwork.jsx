import styled from "styled-components";
import ArtworkItem from "./ArtworkItem";
import { forwardRef } from "react";

// Styled Components
const SearchContainer = styled.div`
  overflow: hidden;
  position: relative;
  padding: 5px;
  max-width: 830px;
`;

const ContentBox = styled.div`
  margin: 35px 25px 20px 25px;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
`;

const BoldParagraph = styled.p`
  font-weight: 600;
  font-size: 17px;
  margin: 0px;
  margin-left: 30px;
`;

const NormalParagraph = styled.p`
  font-weight: 500;
  font-size: 11px;
  margin: 0px;
  margin-left: 30px;
`;

const SearchedArtwork = forwardRef(({ artWorkList }, ref) => {
  return (
    <SearchContainer>
      <BoldParagraph>Art</BoldParagraph>
      <NormalParagraph>작품</NormalParagraph>
      <ContentBox ref={ref}>
        {artWorkList.map((item) => (
          <ArtworkItem key={item.art_pk} artWork={item} />
        ))}
      </ContentBox>
    </SearchContainer>
  );
});

export default SearchedArtwork;
