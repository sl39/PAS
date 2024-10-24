import InfoBar from "../element/infoBar";
import Profile from "../element/profile";
import { useParams } from "react-router-dom";
import { Header } from "../components";
import { useNavigate } from "react-router-dom";

export default function Info() {
  const id = useParams();
  const navigate = useNavigate();

  const linkHamdler1 = () => {
    navigate(`/putCreate/${id.user_pk}`);
  }
  const linkHamdler2 = () => {
    navigate(`/purchaseHistory/${id.user_pk}`);
  }
  const linkHamdler3 = () => {
    navigate(`/salesHistory/${id.user_pk}`);
  }

  const linkHamdler4 = () => {
    navigate(`/postArt/${id.user_pk}`);
  }
  return(
  <>
   <Header></Header>
    <Profile user={id.user_pk} />
    <InfoBar id={id.user_pk} text="개인정보수정" onClick={linkHamdler1}/>
    <InfoBar  id={id.user_pk} text="구매내역" onClick={linkHamdler2} />
    <InfoBar  id={id.user_pk} text="판매내역" onClick={linkHamdler3}/>
    <InfoBar  id={id.user_pk} text="작품등록하기" onClick={linkHamdler4} />
  </>
  )
}