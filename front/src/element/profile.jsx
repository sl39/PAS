import { CgProfile } from "react-icons/cg";
import styled from "styled-components";

const ProfileLogo = styled(CgProfile)`
  width: 80px;
  height: 80px;
     margin-left: 5%;
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

`;

export default function Profile() {
  return(
    <div>
    <Div>
      <ProfileLogo />
      <P>반갑습니다.</P>
    </Div>
    <hr></hr>
    </div>
  )
}