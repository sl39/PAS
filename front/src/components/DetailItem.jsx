import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import styled from "styled-components";
import { Link } from 'react-router-dom';
import { IoCamera } from "react-icons/io5";
import { GoHeart, GoHeartFill } from "react-icons/go";

const DetailItemContainer = styled.div`
    display: flex;
    margin-top: 100px;
    justify-content: center;
    `;

const Title = styled.h3`
    `;
const Artist = styled.p`
    `;
const Registrant = styled.p`
    `;
const Description = styled.p`
    `;
const TimeInfo = styled.h5`
    `;
const YearInfo = styled.h6`
    text-align: left;
    color: gray;
    font-weight: normal;
    margin: 0;
    margin-left: 20px;
    `;
const SizeInfo = styled.h6`
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
    margin-left: 50px;
    `;
const YearInfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    `;


const LeftArrow = styled(IoIosArrowBack)`
    left: 10px;
    `;
const RightArrow = styled(IoIosArrowForward)`
    right: 10px;
    `;
const CameraLink = styled(Link)`
    cursor: pointer;
    margin-right: 15px;

    `;
const CameraIcon = styled(IoCamera)`
    margin-top: 5px;
    font-size: 30px;
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
    `;

export default function DetailItem ({ artWork }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isArtFollowing, setIsArtFollowing] = useState(false);

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
    //잘못짰다 다시 구현하기 - 하트 아이콘이랑 숫자랑 마진도 줘야함
    const handleLikeToggle = () => {
        setIsArtFollowing(!isArtFollowing);
    }
    


    return(
        <DetailItemContainer>
            <div>
            <ImageContainer>
                <LeftArrow onClick={handlePrev} />
                <ArtworkImage src={artWork.artImages[currentIndex]} alt={`Artwork ${currentIndex} + 1`} />
                <RightArrow onClick={handleNext} />
            </ImageContainer>
            <YearInfoContainer>
                    <YearInfo>제작년도<br/>{artWork.created}</YearInfo>
                    <SizeInfo>{artWork.length} x {artWork.width} x {artWork.depth} cm
                        <br/>
                        <CameraLink to="/AR">
                            <CameraIcon />
                        </CameraLink>
                        <div onClick={handleLikeToggle} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                            {isArtFollowing ? <HeartIconFill/> : <HeartIcon/>}
                            <FollowingNum>{artWork.artFollowingNum}</FollowingNum>
                        </div>
                    </SizeInfo>
            </YearInfoContainer>
            </div>
            <InfoContainer>
                <Title>{artWork.artName}</Title>
                <Artist>작가: {artWork.artistName}</Artist>
                <Registrant>등록자: {artWork.userName}</Registrant>
                <TimeInfo>
                    입찰 시작 시간: {artWork.startTime}<br/>
                    입찰 종료 시간: {artWork.endTime}
                </TimeInfo>
                <Description>작품 설명:<br/>{artWork.artInfo}</Description>
            </InfoContainer>
        </DetailItemContainer>
    );
}