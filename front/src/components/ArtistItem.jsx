import styled from "styled-components";
import { Link } from "react-router-dom";

export default function ArtistItem() {
  // Styled Components
  const ArtistContainer = styled.div`
    margin: 10px 10px;
    width: 70px;
  `;

  const ImageContainer = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 70%;
    border: 1px solid black;
    overflow: hidden;
    margin-bottom: 5px;
  `;

  const CircleImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
  `;

  const StyledLink = styled(Link)`
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  `;

  // white-space: nowrap -> 줄바꿈하지 않고 오버플로우 시키기
  // overflow: hidden -> 오버플로우된 텍스트를 숨기기
  // text-overflow: ellipsis -> 숨겨진 텍스트를 생략 부호로 표시
  const BoldParagraph = styled.p`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
    font-size: 11px;
    margin: 0px;
  `;

  // todo: 1000 넘어가면 k로 바꾸기
  const NormalParagraph = styled.p`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 400;
    font-size: 10px;
    margin: 0px;
  `;

  return (
    <StyledLink to="/">
      <ArtistContainer>
        <ImageContainer>
          <CircleImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTn697KapdshZw4TZFDoybC8SzUhBlqTJO3A&s"></CircleImage>
        </ImageContainer>
        <BoldParagraph>그림그림그림그림그림그림</BoldParagraph>
        <NormalParagraph>팔로잉 121</NormalParagraph>
      </ArtistContainer>
    </StyledLink>
  );
}
