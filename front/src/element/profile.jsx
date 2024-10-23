import styled from "styled-components";
import { useEffect, useState } from "react";
import axios from "axios";

const ProfileImage = styled.img`
    width: 80px;
    height: 80px;
     margin-left: 5%;
     border-radius : 100%;
`;

const P = styled.p`
  font-size: 100%;
  margin-right: 40%;
`;

const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10%;
  margin-top:10%;
`;

export default function Profile({ user }) {
const [userImage, setUserImage]= useState('');
const [name, setName] = useState('');

  useEffect(()=> {
    axios.get(`https://artion.site/api/user/myp?user_pk=${user}`)
      .then(response =>{
        const userData = response.data;
        setName(userData.User_name);
        setUserImage(userData.User_image);
      })
      .catch(error => {
        console.error(error);
      })
    }
  , [user]);

  return(
    <div>
    <Div>
      <ProfileImage src={userImage}/>
      <P>{name}</P>
    </Div>
    <hr></hr>
    </div>
  )
}