import styled from "styled-components";
import { Link } from "react-router-dom";

// Styled Components
const ArtistContainer = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  margin: 10px 10px;
  width: 50px;
`;

const ImageContainer = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 70%;
  border: 1px solid black;
  overflow: hidden;
  margin-bottom: 2px;
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
  font-size: 12px;
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

export default function ArtistItem({ artist }) {
  // 작가 개인 페이지 url에 {artist.painter_pk} 쓰면 됨
  return (
    <StyledLink to="/">
      <ArtistContainer>
        <ImageContainer>
          <CircleImage src={artist.painter_img}></CircleImage>
        </ImageContainer>
        <BoldParagraph>{artist.painter_name}</BoldParagraph>
        <NormalParagraph>팔로워 {artist.painter_following_num}</NormalParagraph>
      </ArtistContainer>
    </StyledLink>
  );
}
