import InfoBar from "../element/infoBar";
import Profile from "../element/profile";
import { HistoryHeader } from "../components";
import { useNavigate } from "react-router-dom";

export default function Info() {
  const navigate = useNavigate();

  const linkHamdler1 = () => {
    navigate(`/putCreate`);
  } 
  const linkHamdler2 = () => {
    navigate(`/purchaseHistory`);
  }
  const linkHamdler3 = () => {
    navigate(`/salesHistory`);
  }

  const linkHamdler4 = () => {
    navigate(`/postArt`);
  }
  return(
  <>
   <HistoryHeader></HistoryHeader>
    <Profile />
    <InfoBar  text="개인정보수정" onClick={linkHamdler1}/>
    <InfoBar   text="구매내역" onClick={linkHamdler2} />
    <InfoBar   text="판매내역" onClick={linkHamdler3}/>
    <InfoBar   text="작품등록하기" onClick={linkHamdler4} />
  </>
  )
}