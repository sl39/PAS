import styled from "styled-components";
import ArtworkItem from "./ArtworkItem";

export default function SearchedArtwork({ artWorkList }) {
  // Styled Components
  const SearchContainer = styled.div`
    overflow: hidden;
    position: relative;
    border-top: 1px solid black;
    padding: 10px;
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

  return (
    <>
      <SearchContainer>
        <BoldParagraph>Art</BoldParagraph>
        <NormalParagraph>작품</NormalParagraph>
        <ContentBox>
          {artWorkList.map((item) => (
            <ArtworkItem key={item.art_pk} artWork={item}></ArtworkItem>
          ))}
        </ContentBox>
      </SearchContainer>
    </>
  );
}
