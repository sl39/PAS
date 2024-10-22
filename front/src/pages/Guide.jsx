import React from "react";
import styled from 'styled-components';
import Header from "../components/Header";
import { Link, useLocation, useParams } from "react-router-dom";

const GuideContainer = styled.div`
`;

const HeadTitle = styled.h2`
    text-align: center;
    margin: 30px 0 20px 0;
    font-weight: bold;
`;

const BodyContainer = styled.ul`
    background-color: lightgray;
    border-radius: 10px;
    margin: 0 auto;
    padding: 20px;
    width: 80%;
    max-width: 800px;
`;
const BodyContent = styled.li`
    font-size: 16px;
    margin: 20px 30px;
    font-weight: bold;
`;
const UnderLineColor = styled.span`
    color: red;
    text-decoration: underline;
`;
const UnderLine = styled.span`
    text-decoration: underline;
`;
const P = styled.p`
    font-size: 16px;
    font-weight: bold;
    margin-top: 40px;
`;
const UseList = styled.ul`
    list-style-type: disc;
    font-size: 16px;
`;
const UseContent = styled.li`
    font-size: 16px;
    list-style-type: circle;
    margin: 20px 0;
`;
const ARMoveButton = styled(Link)`
    border: 1px solid gray;
    padding: 8px;
    border-radius: 10px;
    text-decoration: none;
    color: black;
`;

export default function Guide() {
    const { art_pk } = useParams();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const image = params.get('image');
    const width = params.get('width');
    const length = params.get('length');

    return(
        <>
        <Header />
        <GuideContainer>
            <HeadTitle>사용 전 반드시 읽어주세요</HeadTitle>
            <BodyContainer>
                <BodyContent>해당 기능은 <UnderLineColor>안드로이드 모바일 Chrome</UnderLineColor>에서만 제공합니다.</BodyContent>
                <BodyContent>실제 사이즈와 <UnderLineColor>차이</UnderLineColor>가 있을 수 있습니다.</BodyContent>
                <BodyContent>바닥을 인식해주세요 (벽면은 인식 불가능합니다.)</BodyContent>
                <BodyContent>원형이 있을때만 작품이 생성됩니다.</BodyContent>
                <P>사용방법</P>
                <UseList>
                    <UseContent>원형이 최대한 벽면에 가도록 해주세요.</UseContent>
                    <UseContent>화면을 <UnderLine>두번 터치</UnderLine>하면 작품이 생성됩니다.</UseContent>
                    <UseContent>작품 생성 후 드래그로 상하좌우 조절 가능합니다.</UseContent>
                </UseList>
            </BodyContainer>
            <div style={{display: "flex", justifyContent: "center", marginTop: 20}}>
            <ARMoveButton to={`/ar/${art_pk}?image=${image}&width=${width}&length=${length}`}>확인했습니다</ARMoveButton>
            </div>
        </GuideContainer>
        </>
    );
}