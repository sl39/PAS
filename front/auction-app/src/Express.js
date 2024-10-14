const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const IMP_SECRET = 'cyY7B3USIY6yfzbpNVD4Ey5favB4xgGH1K50vMvswB5RK3ubcwhFZOMXbGWlRr8OXBaNnDc2nt7vyCix'; // 아임포트에서 발급받은 REST API Secret

app.post('/payment', async (req, res) => {
  const { amount, buyerName, buyerTel, buyerEmail } = req.body;

  try {
    // 1. Access Token 발급 요청
    const tokenResponse = await axios.post('https://api.iamport.kr/users/getToken', {
      imp_key: '8116775014812856', // 아임포트에서 발급받은 REST API 키
      imp_secret: IMP_SECRET
    });

    const accessToken = tokenResponse.data.response.access_token;

    // 2. 결제 요청
    const paymentResponse = await axios.post('https://api.iamport.kr/transactions', {
      imp_uid: `imp_${new Date().getTime()}`, // 고유한 결제 ID
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: amount,
      buyer_name: buyerName,
      buyer_tel: buyerTel,
      buyer_email: buyerEmail,
      pg: 'html5_inicis.INIpayTest', // PG사 코드
    }, {
      headers: {
        Authorization: accessToken // 발급받은 Access Token
      }
    });

    return res.json(paymentResponse.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    return res.status(500).json({ message: '결제 요청에 실패했습니다.' });
  }
});

app.listen(3000, () => {
  console.log('서버가 3000 포트에서 실행 중입니다.');
});
