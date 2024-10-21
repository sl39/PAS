import styled from "styled-components";
import { ArtworkInProfile, Header } from "../components";
import { CiMenuKebab } from "react-icons/ci";
import { Link } from "react-router-dom";

const ArtistContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileBox = styled.div`
  width: 100%;
  max-width: 850px;
  margin: 30px 0px 50px 0px;
  display: flex;
  justify-content: start;
  align-items: start;
`;

const ProfileInfoBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FollowBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  width: 50px;
  height: 20px;
  border: 1px solid black;
  cursor: pointer;
`;

const ArtworkBox = styled.div`
  width: 100%;
  max-width: 850px;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
`;

const ContentBox = styled.div`
  max-width: 850px;
  margin: 20px 10px;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
`;

const BoxContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const TopBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 30px 0px 20px;
`;

const BottomBox = styled.div`
  display: flex;
  padding: 10px 0px 0px 22px;
`;

const SocialBox = styled.div`
  height: 40px;
  width: 135px;
  display: flex;
  border-radius: 10px;
  background-color: lightgrey;
  align-items: center;
  justify-content: space-between;
`;

const SmallDiv = styled.div`
  height: 40px;
  width: 45px;
  font-size: 12px;
  border-right: 1px solid gray;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Divider = styled.div`
  width: 1px;
  height: 40px;
  background-color: grey;
`;

const NameBox = styled.div`
  display: flex;
  align-items: center;
`;

const SettingBox = styled.div`
  display: flex;
  justify-content: end;
  align-items: end;
  margin: 0px 20px 0px 0px;
`;

const ImageContainer = styled.div`
  width: 110px;
  height: 110px;
  margin-left: 30px;
  border-radius: 70%;
  border: 2px solid black;
  overflow: hidden;
`;

const CircleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BorderLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  justify-content: start;
  border-top: 1px solid lightgrey;
  width: 850px;
`;

const StyledLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;

const BoldParagraph = styled.p`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 20px;
  margin: 0px 0px;
`;

const NormalParagraph = styled.p`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 300;
  font-size: 13px;
  margin: 0px;
`;

export default function ArtistProfile() {
  return (
    <>
      <Header></Header>
      <ArtistContainer>
        <ProfileBox>
          <ImageContainer>
            <CircleImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFfltVt8k_O8R9Hh3eBO1cEsLXP6RkJfh-Jw&s"></CircleImage>
          </ImageContainer>
          <BoxContainer>
            <TopBox>
              <NameBox>
                <ProfileInfoBox>
                  <BoldParagraph>그림파는</BoldParagraph>
                </ProfileInfoBox>
                <FollowBox>
                  <NormalParagraph>구독</NormalParagraph>
                </FollowBox>
              </NameBox>
              <SettingBox>
                <StyledLink to={"/"}>
                  <CiMenuKebab size={25}></CiMenuKebab>
                </StyledLink>
              </SettingBox>
            </TopBox>
            <BottomBox>
              <SocialBox>
                <StyledLink to={`/following/liked`}>
                  <SmallDiv>좋아요</SmallDiv>
                </StyledLink>
                <Divider></Divider>
                <StyledLink to={`/following/following`}>
                  <SmallDiv>팔로잉</SmallDiv>
                </StyledLink>
                <Divider></Divider>
                <StyledLink to={`/following/followers`}>
                  <SmallDiv style={{ borderRight: 0 }}>팔로워</SmallDiv>
                </StyledLink>
              </SocialBox>
            </BottomBox>
          </BoxContainer>
        </ProfileBox>
        <ArtworkBox>
          <BorderLine>
            <ContentBox>
              <ArtworkInProfile></ArtworkInProfile>
              <ArtworkInProfile></ArtworkInProfile>
              <ArtworkInProfile></ArtworkInProfile>
              <ArtworkInProfile></ArtworkInProfile>
              <ArtworkInProfile></ArtworkInProfile>
              <ArtworkInProfile></ArtworkInProfile>
              <ArtworkInProfile></ArtworkInProfile>
              <ArtworkInProfile></ArtworkInProfile>
              <ArtworkInProfile></ArtworkInProfile>
              <ArtworkInProfile></ArtworkInProfile>
              <ArtworkInProfile></ArtworkInProfile>
            </ContentBox>
          </BorderLine>
        </ArtworkBox>
      </ArtistContainer>
    </>
  );
}
