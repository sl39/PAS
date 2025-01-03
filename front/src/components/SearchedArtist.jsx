import styled from "styled-components";
import ArtistItem from "./ArtistItem";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRef } from "react";

// Styled Components
const SearchContainer = styled.div`
  overflow: hidden;
  position: relative;
  padding: 5px;
  max-width: 830px;
`;

const ContentBox = styled.div`
  margin: 0px 20px 0px 20px;
  overflow: hidden;
  display: flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  scroll-behavior: smooth;
`;

const LeftArrow = styled(IoIosArrowBack)`
  position: absolute;
  left: 10px;
  top: 50%;
  cursor: pointer;
  &:hover {
    background-color: lightgray;
    border-radius: 50%;
  }
`;

const RightArrow = styled(IoIosArrowForward)`
  position: absolute;
  right: 10px;
  top: 50%;
  cursor: pointer;
  &:hover {
    background-color: lightgray;
    border-radius: 50%;
  }
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

export default function SearchedArtist({ artistList }) {
  const contentRef = useRef(null);

  const scrollLeft = () => {
    if (contentRef.current) {
      contentRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (contentRef.current) {
      contentRef.current.scrollLeft += 200;
    }
  };

  return (
    <>
      <SearchContainer>
        <BoldParagraph>Artist</BoldParagraph>
        <NormalParagraph>작가</NormalParagraph>
        <LeftArrow onClick={scrollLeft}></LeftArrow>
        <ContentBox ref={contentRef}>
          {artistList.map((item) => (
            <ArtistItem key={item.painter_pk} artist={item}></ArtistItem>
          ))}
        </ContentBox>
        <RightArrow onClick={scrollRight}></RightArrow>
      </SearchContainer>
    </>
  );
}
