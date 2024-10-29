import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    const link = "https://artion.site/oauth2/authorization/kakao";
    window.location.href = link;
  }, []);
}
