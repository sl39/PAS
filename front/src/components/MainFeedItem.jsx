import styled from "styled-components";
import { Link } from "react-router-dom";
import ArtworkItem from "./ArtworkItem";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRef } from "react";

export default function MainFeedItem() {
  // todo: props로 Best인지 New인지 받고(Text, Api 구분용), 안에 넣을 Artwork List 받아오기

  // Styled Components
  const MainFeedContainer = styled.div`
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
    flex-shrink: 0;
  `;

  // todo: 비활성화 시 color: lightgrey 추가 + cursor: pointer 삭제 ;
  const LeftArrow = styled(IoIosArrowBack)`
    position: absolute;
    left: 10px;
    top: 40%;
    cursor: pointer;
  `;

  const RightArrow = styled(IoIosArrowForward)`
    position: absolute;
    right: 10px;
    top: 40%;
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
      <MainFeedContainer>
        <BoldParagraph>Most Popular</BoldParagraph>
        <NormalParagraph>인기 작품</NormalParagraph>
        <LeftArrow onClick={scrollLeft}></LeftArrow>
        <ContentBox ref={contentRef}>
          <ArtworkItem></ArtworkItem>
          <ArtworkItem></ArtworkItem>
          <ArtworkItem></ArtworkItem>
          <ArtworkItem></ArtworkItem>
          <ArtworkItem></ArtworkItem>
          <ArtworkItem></ArtworkItem>
          <ArtworkItem></ArtworkItem>
          <ArtworkItem></ArtworkItem>
          <ArtworkItem></ArtworkItem>
          <ArtworkItem></ArtworkItem>
        </ContentBox>
        <RightArrow onClick={scrollRight}></RightArrow>
      </MainFeedContainer>
    </>
  );
}
