import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { HistoryHeader } from '../components';

const ImageSize = styled.img`
    width: 35%;
    height: 35%;
`;

const ListStyle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px;
    border: 3px solid darkgray;
    border-radius: 5px;
`;

const ArrangeBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding: 5px;
    & > * {
        margin: 0;
    }
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
    margin-bottom: 0;
`;

const Divbar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    background-color: lightgray;
    border-radius: 20px;

    & > * {
        cursor: pointer;
        margin-top: 5px;
        margin-bottom: 5px;
    }
`;

const Pbar = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bolder;
    margin-bottom: 0;
`;

const Linebar = styled.div`
    border-left: 2px solid darkgray;
    height: auto;
`;

const Pstylebar = styled.p`
    font-size: 20px;
    margin-bottom: 10px;
`;

const InfoDiv = styled.div`
    & > * {
        margin-bottom: 5px;
    }
`;

const InfoDetail = styled.div`
    display: flex;
    & > * {
        margin: 0 5px 0 5px;
    }
`;

const Tab = styled.div`
    cursor: pointer;
    border-radius: 20px;
    width: 20%;
    background-color: ${(props) => (props.isActive ? 'darkgray' : 'lightgray')};
    color: ${(props) => (props.isActive ? 'white' : 'black')};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export default function PurchaseHistory() {
    const [entire, setEntire] = useState(false);
    const [bid, setBid] = useState(false);
    const [trueBid, setTrueBid] = useState(false);
    const [end, setEnd] = useState(false);
    const [entireLength, setEntireLength] = useState('');
    const [bidLength, setBidLength] = useState('');
    const [trueBidLength, setTrueBidLength] = useState('');
    const [endLength, setEndLength] = useState('');
    const id = useParams();
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('전체');

    //전체
    const entireHandler = () => {
        setActiveTab('전체');
        setEntire(true);
    };

    //입찰
    const bidHandler = () => {
        setActiveTab('입찰');
        setBid(true);
    };

    //낙찰
    const trueBidHandler = () => {
        setTrueBid(true);
        setActiveTab('낙찰');
    };

    //종료
    const endHandler = () => {
        setEnd(true);
        setActiveTab('종료');
    };

    // 각 URL 별로 데이터를 가져와 길이를 반환하는 함수
    const fetchDataLength = (url, setLength) => {
        axios
            .get(url)
            .then((response) => {
                setLength(response.data.length); // 데이터 길이를 설정
            })
            .catch((error) => {
                console.error(error);
            });
    };

    // 처음 렌더링 시 한 번만 실행되는 코드
    useEffect(() => {
        axios
            .get(`https://artion.site/api/user/purall?user_pk=${id.user_pk}`)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    //영역 누를 때마다 리스트 로드
    useEffect(() => {
        const history = (url, status, lengthStatus) => {
            axios
                .get(url)
                .then((response) => {
                    setData(response.data);
                    status(false);
                    lengthStatus(response.data.length);
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        fetchDataLength(`https://artion.site/api/user/purall?user_pk=${id.user_pk}`, setEntireLength);
        fetchDataLength(`https://artion.site/api/user/purbid?user_pk=${id.user_pk}`, setBidLength);
        fetchDataLength(`https://artion.site/api/user/pursuc?user_pk=${id.user_pk}`, setTrueBidLength);
        fetchDataLength(`https://artion.site/api/user/purend?user_pk=${id.user_pk}`, setEndLength);

        if (entire) {
            history(`https://artion.site/api/user/purall?user_pk=${id.user_pk}`, setEntire, setEntireLength);
        }

        if (bid) {
            history(`https://artion.site/api/user/purbid?user_pk=${id.user_pk}`, setBid, setBidLength);
        }

        if (trueBid) {
            history(`https://artion.site/api/user/pursuc?user_pk=${id.user_pk}`, setTrueBid, setTrueBidLength);
        }

        if (end) {
            history(`https://artion.site/api/user/purend?user_pk=${id.user_pk}`, setEnd, setEndLength);
        }
    }, [entire, bid, trueBid, end, id]);

    const handleItemClick = (artPk) => {
        // art_pk를 포함한 경로로 이동
        navigate(`/detail/${artPk}/${id.user_pk}`);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 0:
                return { color: 'darkgray' }; // 경매전
            case 1:
                return { color: 'blue' }; // 경매중
            case 2:
                return { color: 'darkred' }; // 입금대기
            case 3:
                return { color: 'darkgray' }; // 판매완료
            default:
                return { color: 'black' }; // 기본 색상
        }
    };

    return (
        <>
            <HistoryHeader></HistoryHeader>
            <AllBox>
                <div>
                    <Pstylebar>구매내역</Pstylebar>
                    <Divbar>
                        <Tab onClick={entireHandler} isActive={activeTab === '전체'}>
                            <p>전체</p>
                            <Pbar>{entireLength}</Pbar>
                        </Tab>
                        <Linebar />
                        <Tab onClick={bidHandler} isActive={activeTab === '입찰'}>
                            <p>입찰</p>
                            <Pbar>{bidLength}</Pbar>
                        </Tab>
                        <Linebar />
                        <Tab onClick={trueBidHandler} isActive={activeTab === '낙찰'}>
                            <p>낙찰</p>
                            <Pbar>{trueBidLength}</Pbar>
                        </Tab>
                        <Linebar />
                        <Tab onClick={endHandler} isActive={activeTab === '종료'}>
                            <p>종료</p>
                            <Pbar>{endLength}</Pbar>
                        </Tab>
                    </Divbar>
                </div>
                {data.map((item, index) => (
                    <ListStyle
                        key={index}
                        onClick={() =>
                            (item.currentAuctionStatus === 1 || item.currentAuctionStatus === 2) &&
                            handleItemClick(item.art_pk)
                        }
                    >
                        <ImageSize src={item.image}></ImageSize>
                        <ArrangeBox>
                            <InfoDiv>
                                <InfoDetail>
                                    <P style={{ whiteSpace: 'nowrap' }}>작품:</P>
                                    <P>{item.artName}</P>
                                </InfoDetail>
                                <InfoDetail>
                                    <P style={{ whiteSpace: 'nowrap' }}>작가:</P>
                                    <P>{item.painter}</P>
                                </InfoDetail>
                                <InfoDetail>
                                    <P style={{ whiteSpace: 'nowrap' }}>입찰가:</P>
                                    <P>{item.current_price}</P>
                                    <P
                                        style={{
                                            margin: 0,
                                            ...getStatusStyle(item.currentAuctionStatus),
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {item.currentAuctionStatus === 0 && '<경매전>'}
                                        {item.currentAuctionStatus === 1 && '<경매중>'}
                                        {item.currentAuctionStatus === 2 && '<입금대기>'}
                                        {item.currentAuctionStatus === 3 && '<판매완료>'}
                                    </P>
                                </InfoDetail>
                                <InfoDetail>
                                    <P>{item.endTime}</P>
                                </InfoDetail>
                            </InfoDiv>
                        </ArrangeBox>
                    </ListStyle>
                ))}
            </AllBox>
        </>
    );
}
