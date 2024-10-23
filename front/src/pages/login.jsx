import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    const link = 'http://localhost:8080/oauth2/authorization/kakao';
    window.location.href = link;
  }, []);
}