import { PiUserCircleThin } from "react-icons/pi";
import { MdArrowBack } from "react-icons/md";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

// Styled Components
const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
`;

const MenuIcon = styled.div`
  cursor: pointer;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 35px;
  font-weight: 300;
  user-select: none;
`;

const StyledLink = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;
export async function userFeedApi() {
  const response = await axios.get("https://artion.site/api/user/mine",  {
    withCredentials: true,
  });
  return response.data;
}

export default function HistoryHeader() {
  const navigate = useNavigate();
  const [userPk, setUserPk] = useState();

  const handleback = () => {
    navigate(-1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
      const User = await userFeedApi();
      setUserPk(User)
       
      } catch (error) {
        console.error("데이터를 가져오는 중에 오류가 발생했습니다: ", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <HeaderContainer>
        <MenuIcon>
          <MdArrowBack size={30} onClick={handleback} />
        </MenuIcon>
        <StyledLink to="/">
          <Logo>Artion</Logo>
        </StyledLink>
        <StyledLink to={`/artist/${userPk}`}>
          <PiUserCircleThin size={40} />
        </StyledLink>
      </HeaderContainer>
    </>
  );
}
