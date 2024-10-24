import { PiUserCircleThin } from "react-icons/pi";
import { MdArrowBack } from "react-icons/md";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

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

export default function HistoryHeader() {
  const navigate = useNavigate();

  const handleback = () => {
    navigate(-1);
  };

  return (
    <>
      <HeaderContainer>
        <MenuIcon>
          <MdArrowBack size={30} onClick={handleback} />
        </MenuIcon>
        <StyledLink to="/">
          <Logo>Artion</Logo>
        </StyledLink>
        <StyledLink to={`/artist/1`}>
          <PiUserCircleThin size={40} />
        </StyledLink>
      </HeaderContainer>
    </>
  );
}
