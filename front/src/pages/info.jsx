import BaseAppBar from "../element/appBar";
import InfoBar from "../element/infoBar";
import Profile from "../element/profile";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const DefaultLink = styled(Link)`
  text-decoration: none; 
  color: inherit;
  cursor: pointer;
}
`;

export default function Info() {
  const [userPk, setUserPk] = useState('');
  const {user_pk} = useParams();
  useEffect(()=>{
    setUserPk(user_pk);
  },[user_pk])
  return(
  <>
    <BaseAppBar />
    <Profile user={userPk} />
    <DefaultLink to="/putCreate">
    <InfoBar text="개인정보수정" />
    </DefaultLink>
    <DefaultLink to="/purchaseHistory">
    <InfoBar text="구매내역" />
    </DefaultLink>
    <DefaultLink to="/salesHistory">
    <InfoBar text="판매내역" />
    </DefaultLink>
  </>
  )
}