import BaseAppBar from "../element/appBar";
import InfoBar from "../element/infoBar";
import Profile from "../element/profile";

export default function Info() {
  return(
  <>
    <BaseAppBar />
    <Profile />
    <InfoBar text="개인정보수정" />
    <InfoBar text="구매내역" />
    <InfoBar text="판매내역" />
  </>
  )
}