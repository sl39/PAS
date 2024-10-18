import styled from "styled-components";
import ArtistItem from "./ArtistItem";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRef } from "react";

export default function SearchedArtist() {
  // Styled Components
  const SearchContainer = styled.div`
    overflow: hidden;
    position: relative;
    padding: 10px;
    max-width: 830px;
  `;

  const ContentBox = styled.div`
    margin: 10px 25px 0px 25px;
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
  `;

  const RightArrow = styled(IoIosArrowForward)`
    position: absolute;
    right: 10px;
    top: 50%;
    cursor: pointer;
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

  const contentRef = useRef(null);

  const scrollLeft = () => {
    if (contentRef.current) {
      console.log("scrollLeft");
      contentRef.current.scrollLeft -= 200;
    }
  };

  const scrollRight = () => {
    if (contentRef.current) {
      console.log("scrollRight");
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
          <ArtistItem></ArtistItem>
          <ArtistItem></ArtistItem>
          <ArtistItem></ArtistItem>
          <ArtistItem></ArtistItem>
          <ArtistItem></ArtistItem>
          <ArtistItem></ArtistItem>
        </ContentBox>
        <RightArrow onClick={scrollRight}></RightArrow>
      </SearchContainer>
    </>
  );
}
