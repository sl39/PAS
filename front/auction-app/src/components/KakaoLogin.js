import React, { useEffect } from 'react';
import axios from 'axios';

const KakaoLogin = ({ setAccessToken }) => {
  const REST_API_KEY = 'ef8def78c431df0084fcd11140308ae9'; // 카카오 REST API 키
  const REDIRECT_URI = 'http://localhost:3000/oauth'; // Redirect URI

  const handleLogin = () => {
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = url; // 카카오 로그인 페이지로 리다이렉트
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code'); // URL에서 code 파라미터 가져오기

    if (code) {
      axios.post(`https://kauth.kakao.com/oauth/token`, null, {
        params: {
          grant_type: 'authorization_code',
          client_id: REST_API_KEY,
          redirect_uri: REDIRECT_URI,
          code: code,
        },
      })
      .then(response => {
        const accessToken = response.data.access_token; // 액세스 토큰 가져오기
        setAccessToken(accessToken); // 상태 업데이트
        localStorage.setItem('accessToken', accessToken); // localStorage에 저장

        // 사용자 정보 요청
        return axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      })
      .then(userResponse => {
        const userId = userResponse.data.id; // 사용자 ID
        localStorage.setItem('userId', userId); // 사용자 ID 저장

        // 로그인 후 리다이렉트
        window.location.href = '/'; // 로그인이 완료되면 메인 페이지로 리다이렉트
      })
      .catch(error => {
        console.error('Error fetching access token or user info:', error);
      });
    }
  }, [setAccessToken]);

  return (
    <div>
      <h2>카카오톡 로그인</h2>
      <button onClick={handleLogin}>카카오톡으로 로그인</button>
    </div>
  );
};

export default KakaoLogin;
