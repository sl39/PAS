import styled from "styled-components";
import { ArtworkInProfile, Header } from "../components";
import { CiMenuKebab } from "react-icons/ci";
import { Link } from "react-router-dom";

export default function ArtistProfile() {
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
    padding: 20px 0px 0px 20px;
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

  return (
    <>
      <Header></Header>
      <ArtistContainer>
        <ProfileBox>
          <ImageContainer>
            <CircleImage src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAMAAzAMBIgACEQEDEQH/xAAaAAEAAgMBAAAAAAAAAAAAAAAABAUBAgMG/8QAMBABAAIBAgMHAwIHAQAAAAAAAAECAwQRMUFRBRIhIjJhcRNCkVKxFDNigaHB8BX/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAgMBBP/EABsRAQEBAQEBAQEAAAAAAAAAAAABAhESMSFB/9oADAMBAAIRAxEAPwD1wD3vIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz3Z/Tb8AwEgAAAAAAAAAAAAAAAAAAAOunwX1GTuV5cZ6FI1xYr5rd3HWZnn0WOHs6ldvrT356R4QlYcVMNO7SIiOc9W7K7aTLWuPHT00rX4hsCP13jS2LHk9VK2+YQ9R2dWd5wztP6bcE8dlscs6oL0vjt3ckTWY5TxarvU6emoptaPNHpnopslLYrzS/qa511FnGoCnAAAAAAAAAAAAAAD/ALZc6HBGHBEz67cVXpqfU1FKzw3Xk+zPd/iswAZrAAAAEHtPBFscZYjzV4/CcxesXpNZ+6NnZeUsef57DNq92016TtLDdkAAAAAAAAAAAAAAldmxvq678IiVvzU2gt3dVTfnvC5llv60z8AEOgAAAAAKPVRtqckf1OTfNbvZbz1tLRvPjKgDoAAAAAAAAAAAAzW00yVmOXjC+x3jJjrevpmFB/pM0Gp+nb6d/RM+HtKNzqs1ahz6+4yWAAADo46zJ9LBMz4Wnwh23iKzaZ2iOcqbW6j+IyxtM9yvpXnPU2o/TboA1ZgAAAAAAAAAAAAAAAJmk11sXky72p16LLFkpljfHaLV6woitrVneszE+yblUr0Hjyj/ACKemvz14zF/l0/9LL+iv4lHiu+otGmTLTDG+S0RCqvr89+fc+IR7Wm0zNpmZnnLswXSRq9XfPPdrHdx78OcowLk4jvQB0AAAAAAAAAAAAAZ9wYHTFgy5p2x1395T8XZtI8ct5t7R4Q5dSOydVnjvwdK4Mt/Tjt+F1TDjp6KVj4hum7V5U8aLUz9m3zJ/AZ+lfyuBPunlTTo9TXjXf4lyviyU9VLR/ZfR4cDjxPZ5ee/IvMmmxZPC1K+PPhKHm7Omv8AJtv/AE3VNuXKvG18d8czXJWa26S1WkAAAAAAAAAAA/cBO0vZ/emuTP6eVXXQ6OKRGXNXe/2x0TvdnrX8XMsVrFY2iNojkyCFADgAAAAADrTLipmr3b13VWr0lsETMeanXnC4J8Y2mN4VLYmzrzwma7SfSn6mOO9TnHREni1l6izjADrgAAAAAAndnaaMlpy3jyxPljqh46TlvWleNuC9x0ilK1rG0RCN3isxsAyWAAAAAAAAAAAATETG0xvHTqptZp50+SYjxpPCVy46vDGfDNPu+35Vm8rlikD9+Y2ZgAAAAEgn9lY98k5Zj0xssvZG7Pp3dLWes7pLHV/Ws+ACQAAAAAAAAAAAAOe4Ap9fi+nqbTEeFvMjLLtavkpeOMTsreHBtm/jPX0AU4//2Q=="></CircleImage>
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
                <SmallDiv style={{borderRight : 0}}>팔로워</SmallDiv>
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
              <ArtworkInProfile></ArtworkInProfile>
            </ContentBox>
          </BorderLine>
        </ArtworkBox>
      </ArtistContainer>
    </>
  );
}
