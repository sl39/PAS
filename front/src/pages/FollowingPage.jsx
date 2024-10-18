import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header, LikedArtItem } from "../components";
import styled from "styled-components";
import { IoIosArrowBack } from 'react-icons/io';
import axios from "axios";

const FollowingContainer = styled.div`
    width:100%;
    max-width: 850px;
    margin: 0 auto;
    `;

const HeadContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between; 
`;
const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
`;
const BackButton = styled(IoIosArrowBack)`
    cursor: pointer;
    font-size: 30px;
`;
const Title = styled.h1`
    margin: 0;
    text-align: center;
    padding-right: 30px;
    flex: 1; 
`;
const SelectContainer = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 80px;
    border-bottom: 1px solid lightgray;
`;
const SelectButton = styled.button`
    font-size: 20px;
    font-weight: bold;
    background-color: white;
    border: 0px;
    border-bottom: ${(props) => (props.selected ? '1px solid black' : 'none')};
    cursor: pointer;
    &:focus {
        outline: none;
    }
`;
const SelectLink = styled(Link)`
    text-decoration: none;
`;
const ArtworkList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    padding: 0
    margin: 0;
    list-style-type: none;
`;
// 좋아요
const LikedArtworks = ({user_pk}) => {
    const [ likedArtworks, setLikedArtworks ] = useState([]);

    useEffect(() => {
        const fetchLikedArtworks = async() =>{
            try{
                const response = await axios.get(`https://artion.site/api/user/artfol/1`);
                setLikedArtworks(response.data);
            } catch(error){
                console.error("작품 좋아요 오류 :", error);
            }
        };
        fetchLikedArtworks();
    }, [user_pk])

    return (
        <div style={{marginTop: 50}}>
            {likedArtworks.length > 0? (
                <ArtworkList>
                {likedArtworks.map((artWork) => (
                  <LikedArtItem key={artWork.art_pk} artWork={artWork}/>  
                ))}
            </ArtworkList>
            ): (
                null
            )}
        </div>
    );
};
// 팔로잉
const Following = () => {
    return (
        <div>
            <h1>팔로잉</h1>
        </div>
    );
};
// 팔로워
const Followers = () => {
    return (
        <div>
            <h1>팔로워</h1>
        </div>
    );
};

// 페이지
const FollowingPage = () => {
    const { page } = useParams();
    const [selectedPage, setSelectedPage] = useState(page);

    const renderPage = () => {
        switch (selectedPage) {
            case 'liked':
                return <LikedArtworks />;
            case 'following':
                return <Following />;
            case 'followers':
                return <Followers />;
            default:
                return <LikedArtworks />;
        }
    };
    const handleSelect = (newPage) => {
        setSelectedPage(newPage);
    };

    return (
        <FollowingContainer>
            <Header />
            <HeadContainer>
                <ButtonContainer>
                    <Link to={`/test`}>
                    <BackButton />
                    </Link>
                </ButtonContainer>
                <Title>user</Title>
            </HeadContainer>
            <SelectContainer>
                <SelectLink to="/following/liked" onClick={() => handleSelect('liked')}>
                    <SelectButton selected={selectedPage === 'liked'}>좋아요</SelectButton>
                </SelectLink>
                <SelectLink to="/following/following" onClick={() => handleSelect('following')}>
                    <SelectButton selected={selectedPage === 'following'}>팔로잉</SelectButton>
                </SelectLink>
                <SelectLink to="/following/followers" onClick={() => handleSelect('followers')}>
                    <SelectButton selected={selectedPage === 'followers'}>팔로워</SelectButton>
                </SelectLink>
            </SelectContainer>
            <div>
                {renderPage()}
            </div>
        </FollowingContainer>
    );
};

export default FollowingPage;
