import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import styled from "styled-components";
import { Link, useParams } from 'react-router-dom';
import { IoCamera, IoShieldCheckmark } from "react-icons/io5";
import { GoHeart, GoHeartFill } from "react-icons/go";
import axios from "axios";

const VerticalContainer = styled.div`
    `;
const DetailItemContainer = styled.div`
    display: flex;
    margin-top: 100px;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid lightgray;

    @media (max-width: 840px) {
        flex-direction: column;
        align-items: center; 
    }
`;
const ButtonContainer = styled.div`
    `;
const Title = styled.h2`
    `;
const Artist = styled.p`
    font-size: 18px;
    margin-top: 8px;
    `;
const SpanBold = styled.span`
    font-size: 18px;
    font-weight: bold;
`;
const Registrant = styled.p`
    `;
const DescriptionTitle = styled.p`
    padding: 10px;
    font-size: 20px;
    font-weight: bold
    `;
const Description = styled.p`
    font-size: 16px;
    line-height: 1.8;
    margin: 10px 15px 20px 15px;
    background-color: #f1f3f5;
    border-radius: 15px;
    padding: 15px
    
    `;
const TimeInfo = styled.p`
    font-size: 16px;
    text-align: center;
    margin: 8px 4px 0 4px;
    padding-left: 2px;
    `;
const GoButton = styled(Link)`
    font-size: 15px;
    font-weight: bold;
    text-decoration: none;
    text-align: center;
    background-color: aliceblue;
    border: 1.5px solid gray;
    border-radius: 7px;
    margin-top: 8px;
    padding: 5px;
    &:hover {
        background-color: lightgray;
        border-color: darkgray;
    }
    `;
const MaxPrice = styled.div`
    display: flex;
    font-size: 15px;
    background-color: aliceblue;
    justify-content: space-between;
    flex-direction: column;
    border: 1.5px solid gray;
    padding:8px;
    border-radius: 10px
    `;
const MinPrice = styled.div`
    margin-top: 14px;
    display: flex;
    background-color: aliceblue;
    font-size: 15px;
    flex-direction: column;
    justify-content: space-between;
    border: 1.5px solid gray;
    padding: 8px;
    border-radius: 10px
    `;
const YearInfo = styled.h6`
    font-size: 13px;
    text-align: left;
    color: gray;
    font-weight: normal;
    margin: 0;
    margin-left: 20px;
    `;
const SizeInfo = styled.h6`
    font-size: 13px;
    text-align: right;
    color: gray;
    font-weight: normal;
    margin: 0;
    margin-right: 20px;
    `;
    const ImageContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    
    @media (max-width: 840px) {
        flex-direction: row;
    }
`;
const ArtworkImage = styled.img`
    width: 300px;
    height: auto;
    margin: 5px;
    `;
    const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 150px;
    padding-right: 70px;
    margin-left: 30px;

    @media (max-width: 840px) {
        padding-left: 0;
        padding-right: 0;
        margin-left: 0;
        width: 100%;
    }
`;
    const YearInfoContainer = styled.div`
    display: flex;
    justify-content: space-between; 
    width: 100%;

    @media (max-width: 840px) {
        flex-direction: column;
        align-items: left;
        gap: 10px;
    }
`;
const LeftArrow = styled(IoIosArrowBack)`
    left: 10px;

    &:hover {
        background-color: lightgray;
        border-radius: 50%;
    }
    `;
const RightArrow = styled(IoIosArrowForward)`
    right: 10px;

    &:hover {
        background-color: lightgray;
        border-radius: 50%;
    }
    `;
const CameraLink = styled(Link)`
    cursor: pointer;
    margin-right: 15px;
    `;
const CameraIcon = styled(IoCamera)`
    margin-top: 5px;
    font-size: 30px;
    color: black;
    `;
const HeartIcon = styled(GoHeart)`
    margin-top: 5px;
    font-size: 29px;
    color: red;
    `;
const HeartIconFill = styled(GoHeartFill)`
    margin-top: 5px;
    font-size: 29px;
    color: red;
    `;
const FollowingNum = styled.span`
    color: gray;
    font-size: 12px;
    margin-left: 2px;
    `;
const RetryButton = styled(Link)`
    color: black;
    cursor: pointer;
    background-color: #f1f3f5;
    border: 1px solid gray;
    border-radius: 5px;
    font-size: 13px;
    text-decoration: none;
    &:hover {
        background-color: lightgray;
        border-color: darkgray;
    }
    margin-left: 15px;
    padding: 3px 20px
    `;
const FixButton = styled(Link)`
    color: black
    cursor: pointer;
    background-color: #f1f3f5;
    border: 1px solid gray;
    border-radius: 5px;
    font-size: 13px;
    text-decoration: none;
    &:hover {
        background-color: lightgray;
        border-color: darkgray;
    }
    padding: 3px 12px;
    `;
const QuraterIcon = styled(IoShieldCheckmark)`
    cursor: pointer;
    color: #0099FF;
    `;

const MessageModal = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border: 1px solid gray;
    border-radius: 8px;
    padding: 20px;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;
const IndexIndicator = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 7px;
    padding: 2px 5px;
    font-size: 11px;
    font-weight: bold;
`;

//시작
export default function DetailItem ({ artWork }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isArtFollowing, setIsArtFollowing] = useState(artWork.isArtFollowing);
    const [artFollowingNum, setArtFollowingNum] = useState(artWork.artFollowingNum);
    const [showMessage, setShowMessage] = useState(false);
    const currentTime = new Date();
    const chstartTime = new Date(artWork.startTime.replace(" ","T"));
    const chendTime = new Date(artWork.endTime.replace(" ","T"));
    const {art_pk, user_pk} = useParams();
    //세자리마다 , 넣어주기
    const maxPrice = artWork.maxPrice;
    const currentPrice = artWork.currentPrice;
    const maxPriceRE = maxPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    const currentPriceRE = currentPrice.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    

    console.log(user_pk)
    
    if(!artWork) return null;

    const handleNext = () => {
        if(currentIndex < artWork.artImages.length - 1){
            setCurrentIndex(currentIndex + 1);
        }else {
            setCurrentIndex(0);
        }
    };

    const handlePrev = () => {
        if(currentIndex > 0){
            setCurrentIndex(currentIndex - 1);
        }else {
            setCurrentIndex(artWork.artImages.length - 1);
        }
    }
    
    const toggleFollowing = async ( art_pk, user_pk ) => {
        console.log(art_pk)
        try {
            const url = isArtFollowing 
                ? `https://artion.site/api/artfollowing/${art_pk}/8/unlike`
                : `https://artion.site/api/artfollowing/${art_pk}/8`;

            const response = await axios({
                method: isArtFollowing ? 'delete' : 'post',
                url: url,
            });
        

            return response.data;

        } catch(error){
            console.error("팔로잉 상태 변경 오류: ", error);
        }
    };
    const handleLikeToggle = async () => {
        //수정 user_pk로 변경시켜 줘야함 - 지금 8 하드 코딩
        const result = await toggleFollowing(art_pk, 8);

        if(result){
            setIsArtFollowing(!isArtFollowing);
            setArtFollowingNum(isArtFollowing ? artFollowingNum -1: artFollowingNum +1);
        }
    }
    const handleQuraterIconClick = () => {
        setShowMessage(true);
    }
    const closeMessage = () => {
        setShowMessage(false);
    }
 
    return(
        <VerticalContainer>
        <DetailItemContainer>
            <div>
            <ImageContainer>
                <LeftArrow onClick={handlePrev} />
                <div style={{position:"relative"}}>
                    <ArtworkImage src={artWork.artImages[currentIndex]} alt={`Artwork ${currentIndex} + 1`} />
                    <IndexIndicator>
                        {currentIndex + 1} / {artWork.artImages.length}
                    </IndexIndicator>
                </div>
                <RightArrow onClick={handleNext} />
            </ImageContainer>
            <YearInfoContainer>
                <YearInfo>제작년도<br/>{artWork.created}</YearInfo>
                <SizeInfo>{artWork.width} x {artWork.length} x {artWork.depth} cm
                    <br/>
                    <div style={{ display: 'flex', alignItems: 'center',justifyContent: 'flex-end' }}>
                    <CameraLink to={`/guide/${art_pk}?image=${artWork.artImages[0]}&width=${(artWork.width / 100).toFixed(2)}&length=${(artWork.length / 100).toFixed(2)}`}>
                        <CameraIcon />
                    </CameraLink>
                    <div onClick={handleLikeToggle} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                        {isArtFollowing ? <HeartIconFill/> : <HeartIcon/>}
                        <FollowingNum>{artFollowingNum}</FollowingNum>
                    </div>
                    </div>
                </SizeInfo>
            </YearInfoContainer>
            </div>
            <InfoContainer>
                <ButtonContainer>
                    {/* 수정 - 2 => user_pk */}
                    {2 === artWork.sellerPk && (
                        <>
                         {artWork.auctionState === 0 && currentTime < chstartTime && <FixButton to={`/putRegister/${art_pk}`}>수정하기</FixButton>}
                         {artWork.auctionState === 0 && currentTime > chendTime && <RetryButton to={`/putRegister/${art_pk}`}>재경매</RetryButton>}
                        </>
                    )}
                </ButtonContainer>
                <Title>{artWork.artName}{artWork.qurater ? <QuraterIcon onClick={handleQuraterIconClick} /> : null }</Title>
                <Artist><SpanBold>작가 :</SpanBold> {artWork.artistName}</Artist>
                <Registrant><SpanBold>등록자 :</SpanBold> {artWork.sellerName}</Registrant>
                <MaxPrice>
                    <SpanBold>즉시판매가</SpanBold>
                    <SpanBold style={{textAlign: "right"}}>{maxPriceRE} 원</SpanBold>
                </MaxPrice>
                <MinPrice>
                    <SpanBold>현재가</SpanBold>
                    <SpanBold style={{textAlign: "right"}}>{currentPriceRE} 원</SpanBold>
                </MinPrice>
                <TimeInfo>
                    <span style={{fontWeight: 'bold'}}>시작 시간 :</span> {artWork.startTime}<br/>
                    <span style={{fontWeight: 'bold'}}>종료 시간 :</span> {artWork.endTime}
                </TimeInfo>
                {artWork.isPossible ? (
                    <>
                    {artWork.auctionState === 0 && currentTime < chstartTime &&(<GoButton>경매 시작 전입니다.</GoButton>)}
                    {artWork.auctionState === 0 && currentTime >= chstartTime && currentTime <= chendTime
                    && (<GoButton>경매 진행 중입니다.</GoButton>)}
                    {artWork.auctionState === 0 && currentTime > chendTime &&(<GoButton>경매가 종료되었습니다.</GoButton>)}
                    {artWork.auctionState === 1 && <GoButton to={`/auction/${art_pk}/7`}>입찰하러 가기</GoButton>}
                    {artWork.auctionState === 2 && <GoButton to={`/auction/${art_pk}/7`}>경매 완료</GoButton>}
                    {artWork.auctionState === 3 && (artWork.currentPrice === artWork.myCurrentPrice
                    ? (<GoButton to={`/auction/${art_pk}/7`}>주문내역 확인하기</GoButton>) : (<GoButton to={`/auction/${art_pk}/8`}>판매되었습니다.</GoButton>))}
                    </>
                    ): (<GoButton>경매에 참여할 수 없습니다.</GoButton>)
                }
                
                
            </InfoContainer>
        </DetailItemContainer>
        <DescriptionTitle>작품 설명</DescriptionTitle>
        <Description>{artWork.artInfo}</Description>
        {showMessage && (
                <>
                    <Overlay onClick={closeMessage} />
                    <MessageModal>
                        <p>이 작품은 큐레이터의 검증을 받은 작품입니다.</p>
                    </MessageModal>
                </>
            )}
        </VerticalContainer>
    );
}