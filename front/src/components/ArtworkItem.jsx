import styled from "styled-components";
import { Link } from "react-router-dom";
import { GoHeartFill } from "react-icons/go";

// Styled Components
const ArtworkContainer = styled.div`
  margin: 5px;
  width: 90px;
  margin-bottom: 20px;
`;

const ImageContainer = styled.div`
  width: 90px;
  height: 90px;
  overflow: hidden;
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

export default function ArtworkItem({ artWork }) {
  return (
    <StyledLink to={`/detail/${artWork.art_pk}`}>
      <ArtworkContainer>
        <ImageContainer>
          <SquareImage src={artWork.artImage}></SquareImage>
        </ImageContainer>
        <BoldParagraph>{artWork.artName}</BoldParagraph>
        <NormalParagraph>{artWork.artistName}</NormalParagraph>
        <BoldParagraph>{artWork.price} 원</BoldParagraph>
        <LikeBox>
          <HeartIcon></HeartIcon>
          <NormalParagraph>{artWork.artFollowingNum}</NormalParagraph>
        </LikeBox>
      </ArtworkContainer>
    </StyledLink>
  );
}
