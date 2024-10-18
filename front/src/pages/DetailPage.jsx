import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DetailItem, Header } from "../components";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailContainer = styled.div`
display: flex;
flex-wrap: wrap;
overflow: hidden;
justify-content: center;
`;

export default function DetailPage() {
    const [ artwork, setArtwork ] = useState(null);
    const { art_pk, user_pk } = useParams();
    console.log(art_pk)
    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                // 수정 - user_pk 바꾸기
                const response = await axios.get(`http://artion.site:8080/api/art/detail?artPk=${art_pk}&userPk=8`);
                setArtwork(response.data);
            } catch (error) {
                console.error("Error:", error);
            }
        };
        fetchArtwork();
    },[art_pk, user_pk]);

    //조건부 렌더링
    if(!artwork){
        return <div>Loading...</div>;
    }

    return(
        <>
        <Header />
        <DetailContainer>
            <DetailItem artWork={artwork} />
        </DetailContainer>
       </>
    );
};