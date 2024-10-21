import { CgProfile } from "react-icons/cg";
import styled from "styled-components";

const ProfileLogo = styled(CgProfile)`
  width: 100px;
  height: 100px;
`;

const P = styled.p`
  font-size: 50px;
  margin-left: 20px;
`;

const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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