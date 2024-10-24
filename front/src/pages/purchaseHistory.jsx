import styled from "styled-components";
import jjang from '../img/jjang.jpg';
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Header } from "../components";

const ImageSize = styled.img`
  width: 35%;
  height: 35%;
`;

const ListStyle = styled.div`
  display:flex;
  flex-direction : row;
  align-items: center;
  padding: 5px;
  border : 3px solid darkgray;
  border-radius: 5px;
`;

const ArrangeBox = styled.div`
width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

const AllBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  & > * {
  width: 80%;
  margin-bottom: 10px;
  }
`;
const P = styled.p`
  font-size: 80%;
`;

const Divbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly; 
  background-color: lightgray;
  border-radius: 20px;

  &>*{
    cursor: pointer;
  }
`;

const Pbar = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Linebar = styled.div`
  border-left: 2px solid darkgray;
  height: auto;
`;

const Pstylebar = styled.p`
  font-size: 20px;
  margin-bottom: 10px;
`;

export default function PurchaseHistory() {
  const [ entire, setEntire ] = useState(false);
  const [ bid, setBid] = useState(false);
  const [ trueBid, setTrueBid ] = useState(false); 
  const [ end, setEnd ] = useState(false);

  const [entireLength, setEntireLength] = useState('');
  const [bidLength, setBidLength] = useState('');
  const [trueBidLength, setTrueBidLength] = useState('');
  const [endLength, setEndLength] = useState('');
  const id = useParams();
  
  const [data, setData] = useState([]);

  //전체 영역 클릭이벤트
  const entireHandler = () => {
    setEntire(true);
  }

  //입찰 영역 클릭이벤트
  const bidHandler = () => {
    setBid(true);
  }

  //낙찰 영역 클릭이벤트
  const trueBidHandler = () => {
    setTrueBid(true);
  }

  //종료 영역 클릭이벤트
  const endHandler = () => {
    setEnd(true);
  }

  // 각 URL 별로 데이터를 가져와 길이를 반환하는 함수
  const fetchDataLength = (url, setLength) => {
    axios.get(url)
      .then(response => {
        setLength(response.data.length); // 데이터 길이를 설정
      })
      .catch(error => {
        console.error(error);
      });
  };

  // 처음 렌더링 시 한 번만 실행되는 코드
    useEffect(() => {
      axios.get(`https://artion.site/api/user/purall?user_pk=${id.user_pk}`)
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error(error); 
        });
    }, []);

  //영역 누를 때마다 리스트 로드
  useEffect(()=>{
    const history = (url, status, lengthStatus) => {
      axios.get(url)
      .then(response => {
        setData(response.data);
        status(false);
        lengthStatus(response.data.length);
      }).catch(error => {
        console.error(error);
      });
    };

    fetchDataLength(`https://artion.site/api/user/purall?user_pk=${id.user_pk}`,setEntireLength);
    fetchDataLength(`https://artion.site/api/user/purbid?user_pk=${id.user_pk}`,setBidLength);
    fetchDataLength(`https://artion.site/api/user/pursuc?user_pk=${id.user_pk}`,setTrueBidLength);
    fetchDataLength(`https://artion.site/api/user/purend?user_pk=${id.user_pk}`,setEndLength);
 
    if(entire){
      history(`https://artion.site/api/user/purall?user_pk=${id.user_pk}`,setEntire, setEntireLength)
    }

    if(bid){
      history(`https://artion.site/api/user/purbid?user_pk=${id.user_pk}`,setBid, setBidLength)
    }

    if(trueBid){
      history(`https://artion.site/api/user/pursuc?user_pk=${id.user_pk}`,setTrueBid, setTrueBidLength)
    }

    if(end){
      history(`https://artion.site/api/user/purend?user_pk=${id.user_pk}`,setEnd, setEndLength)
    }
    },[entire , bid, trueBid, end, id]);


  return(
      <>
       <Header></Header>
        <AllBox>  
        <div>
        <Pstylebar>구매내역</Pstylebar>
        <Divbar>
          <div onClick = {entireHandler}>
            <p>전체</p>
            <Pbar>{entireLength}</Pbar>
          </div>
          <Linebar />
          <div onClick={bidHandler}>
            <p>입찰</p>
            <Pbar>{bidLength}</Pbar>
          </div>
          <Linebar />
          <div onClick={trueBidHandler}>
            <p>낙찰</p>
            <Pbar>{trueBidLength}</Pbar>
          </div>
          <Linebar />
          <div onClick={endHandler}>
            <p>종료</p>
            <Pbar>{endLength}</Pbar>
          </div>
        </Divbar>
      </div>
      {data.map((item, index) => (
      <ListStyle key={index}>
      <ImageSize src={item.image}></ImageSize>
        <ArrangeBox >
          <div>
            <P>{item.artName}</P>
            <P>{item.painter}</P>
            <P>{item.current_price}</P>
          </div>
          <div>
            <P>{item.endTime}</P>
          </div>
            <div>
              <P>{item.currentAuctionStatus}</P>
            </div>
          </ArrangeBox>
      </ListStyle>
      ))} 
    </AllBox>  
</>
  )
}
