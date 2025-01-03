import styled from "styled-components";
import { ArtworkInProfile, Header } from "../components";
import { CiMenuKebab } from "react-icons/ci";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const ArtistContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileBox = styled.div`
  width: 100%;
  max-width: 850px;
  margin: 20px 0px 20px 0px;
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
  background-color: ${(props) => (props.followState ? "red" : "transparent")};
  color: ${(props) => (props.followState ? "white" : "black")};
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
  padding: 0px 30px 0px 20px;
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
  width: 80px;
  min-width: 80px;
  height: 80px;
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

export async function getArtistProfileApi(userPk) {
  const response = await axios.get(
    `https://artion.site/api/user/myart?user_pk=${userPk}`,
    {
      withCredentials: true,
    }  );
    console.log(response.data)
  return response.data;
}

let currentPath = "";

export default function ArtistProfile() {
  // URL에서 path variable 추출
  const userPkObj = useParams();
  const [artistName, setArtistName] = useState("");
  const [artistProfileImage, setArtistProfileImage] = useState("");
  const [artworkList, setArtworkList] = useState([]);
  const [followState, setFollowState] = useState(false);
  const [isSelf, setIsSelf] = useState(false);
  const [myPk, setMyPk] = useState(0);



  // Link 클릭 시 같은 페이지여도 새로고침 하기
  let location = useLocation();
  useEffect(() => {
    if (currentPath === location.pathname) window.location.reload();

    currentPath = location.pathname;
  }, [location]);

  //구독/구독취소 변경
  const handleSubscription = async () => {
    setFollowState((prevState) => !prevState);
    const url = followState
      ? `https://artion.site/api/following/unfollow/${userPkObj.user_pk}`
      : `https://artion.site/api/following/follow/${userPkObj.user_pk}`;

    try {
      await axios({
        method: followState ? "delete" : "post",
        url: url,
        withCredentials: true
      });
      alert(followState ? "구독이 취소되었습니다." : "구독에 성공했습니다.");
    } catch (error) {
      console.error(error);
      alert("요청에 실패했습니다.");
      setFollowState((prevState) => !prevState);
    }
  };

  // 작가 페이지 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistProfileInfo = await getArtistProfileApi(userPkObj.user_pk);
        setArtistName(artistProfileInfo.User_name);
        setArtistProfileImage(artistProfileInfo.user_Image);
        setArtworkList(artistProfileInfo.artList);
        setIsSelf(artistProfileInfo.isSelf);
        setFollowState(artistProfileInfo.followState);
        setMyPk(artistProfileInfo.my_pk)

        console.log(artworkList)
        console.log(artistProfileInfo.artList)
      } catch (error) {
        console.error("데이터를 가져오는 중에 오류가 발생했습니다: ", error);
      }
    };

    fetchData();
  }, [userPkObj]);

  return (
    <>
      <Header key={myPk} user={myPk}></Header>
      <ArtistContainer>
        <ProfileBox>
          <ImageContainer>
            <CircleImage src={artistProfileImage}></CircleImage>
          </ImageContainer>
          <BoxContainer>
            <TopBox>
              <NameBox>
                <ProfileInfoBox>
                  <BoldParagraph>{artistName}</BoldParagraph>
                </ProfileInfoBox>
                {!isSelf && (
                  <FollowBox
                    onClick={handleSubscription}
                    followState={followState}
                  >
                    <NormalParagraph>구독</NormalParagraph>
                  </FollowBox>
                )}
              </NameBox>
              <SettingBox>
                {isSelf && (
                  <StyledLink to={`/info`}>
                    <CiMenuKebab size={25}></CiMenuKebab>
                  </StyledLink>
                )}
              </SettingBox>
            </TopBox>
            <BottomBox>
              <SocialBox>
                <StyledLink to={`/following/liked/${userPkObj.user_pk}?artistName=${encodeURIComponent(artistName)}`}>
                  <SmallDiv>좋아요</SmallDiv>
                </StyledLink>
                <Divider></Divider>
                <StyledLink to={`/following/following/${userPkObj.user_pk}?artistName=${encodeURIComponent(artistName)}`}>
                  <SmallDiv>팔로잉</SmallDiv>
                </StyledLink>
                <Divider></Divider>
                <StyledLink to={`/following/followers/${userPkObj.user_pk}?artistName=${encodeURIComponent(artistName)}`}>
                  <SmallDiv style={{ borderRight: 0 }}>팔로워</SmallDiv>
                </StyledLink>
              </SocialBox>
            </BottomBox>
          </BoxContainer>
        </ProfileBox>
        <ArtworkBox>
          <BorderLine>
            <ContentBox>
              {(artworkList && artworkList.length > 0) ? artworkList.map((item) => (
                <ArtworkInProfile key={item.art_pk} artWork={item} />
              )) : []}
            </ContentBox>
          </BorderLine>
        </ArtworkBox>
      </ArtistContainer>
    </>
  );
}
