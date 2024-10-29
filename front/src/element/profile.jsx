import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";

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
  align-items: center;
`;

const ProfileInfoBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

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
`
const NameBox = styled.div`
  display: flex;
  align-items: center;
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

const BoldParagraph = styled.p`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 20px;
  margin: 0px 0px;
`;

const BorderLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  justify-content: start;
  border-top: 1px solid lightgrey;
  width: 100%;
`;

export default function Profile() {
const [userImage, setUserImage]= useState('');
const [name, setName] = useState('');

  useEffect(()=> {
    axios.get(`https:/artion.site/api/user/myp`, 
      {
        withCredentials: true,
      })
      .then(response =>{
        const userData = response.data;
        setName(userData.User_name);
        setUserImage(userData.User_image);
      })
      .catch(error => {
        console.error(error);
      })
    }
  , []);

  return(
    <>
    <ArtistContainer>
      <ProfileBox>
        <ImageContainer>
          <CircleImage src={userImage}></CircleImage>
        </ImageContainer>
        <BoxContainer>
          <TopBox>
            <NameBox>
              <ProfileInfoBox>
                <BoldParagraph>{name}</BoldParagraph>
              </ProfileInfoBox>
            </NameBox>
          </TopBox>
          </BoxContainer>
      </ProfileBox>
      <BorderLine></BorderLine>
    </ArtistContainer>
  </>
  )
}