import styled from "styled-components";
import { Link } from "react-router-dom";
import { GoHeartFill } from "react-icons/go";

// Styled Components
const ArtworkContainer = styled.div`
  margin: 10px;
  width: 140px;
`;

const ImageContainer = styled.div`
  width: 140px;
  height: 140px;
  overflow: hidden;
  margin-bottom: 3px;
`;

const SquareImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;

const BoldParagraph = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-weight: bold;
  font-size: 13px;
  margin: 0px;
`;

const NormalParagraph = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;

  font-weight: 200;
  font-size: 11px;
  margin: 0px;
`;

const LikeBox = styled.div`
  display: flex;
  margin-top: 2px;
`;

const HeartIcon = styled(GoHeartFill)`
  margin-right: 3px;
  color: red;
`;

export default function ArtworkInProfile() {
  return (
    <StyledLink to="/">
      <ArtworkContainer>
        <ImageContainer>
          <SquareImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTn697KapdshZw4TZFDoybC8SzUhBlqTJO3A&s"></SquareImage>
        </ImageContainer>
        <NormalParagraph>
          빈센트 반 고흐의 자화상으로, 빈센트 반 고흐의 자화상
        </NormalParagraph>
        <BoldParagraph>art_price원</BoldParagraph>
        <LikeBox>
          <HeartIcon></HeartIcon>
          <NormalParagraph>132</NormalParagraph>
        </LikeBox>
      </ArtworkContainer>
    </StyledLink>
  );
}
