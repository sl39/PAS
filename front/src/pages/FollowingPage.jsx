import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { FollowingItem, Header, LikedArtItem, FollowersItem } from "../components";
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
    margin: 20px 0;

`;
const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
`;
const BackButton = styled(IoIosArrowBack)`
    cursor: pointer;
    color: black;
    font-size: 25px;
    
`;
const Title = styled.h2`
    margin: 0;
    text-align: center;
    padding-right: 30px;
    flex: 1; 
`;
const SelectContainer = styled.div`
    color: black;
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
    border-bottom: 1px solid lightgray;
`;

const SelectButton = styled.button`
    font-size: 16px;
    font-weight: bold;
    background-color: white;
    border: 0;
    border-bottom: ${(props) => (props.selected ? '2px solid black' : 'none')};
    cursor: pointer;
    flex: 1;
    padding: 10px; 
    margin: 0 5px;
    text-align: center;
    
    &:focus {
        outline: none;
    }
`;
const SelectLink = styled(Link)`
    text-decoration: none;
`;
const ArtworkList = styled.ul`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 0;
    margin: 0;
    list-style-type: none;
`;

const FollowingList = styled.ul`
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
    list-style-type: none;
    gap: 10px;
`;
// 좋아요
const LikedArtworks = ({user_pk}) => {
    const [ likedArtworks, setLikedArtworks ] = useState([]);
    const [selectedArtPk, setSelectedArtPk] = useState(null);

    useEffect(() => {
        const fetchLikedArtworks = async() =>{
            try{
                const response = await axios.get(`https://artion.site/api/user/artfol?user_pk=${user_pk}`,                    {
                    withCredentials: true,
                  });
                const sortedArt = response.data.sort((a,b) => new Date(b.upload) - new Date(a.upload))
                setLikedArtworks(sortedArt);
            } catch(error){
                console.error("작품 좋아요 오류 :", error);
            }
        };
        fetchLikedArtworks();
    }, [user_pk])

    const handleSelectArtwork = (art_pk) => {
        setSelectedArtPk(art_pk === selectedArtPk ? null : art_pk); 
    };

    return (
        <div style={{ marginTop: 50, display: "flex" }}>
            {likedArtworks.length > 0 ? (
                <ArtworkList>
                    {likedArtworks.map((artWork) => (
                        <LikedArtItem
                            key={artWork.art_pk}
                            artWork={artWork}
                            isSelected={artWork.art_pk === selectedArtPk} 
                            onClick={handleSelectArtwork} 
                        />
                    ))}
                </ArtworkList>
            ) : (
                null
            )}
        </div>
    );
};
// 팔로잉
const Following = ({ user_pk }) => {
    const [following, setFollowing] = useState([]);
    useEffect(() => {
        const fetchFollowing = async() => {
            try{
                const response = await axios.get(`https://artion.site/api/user/fol?user_pk=${user_pk}`,                     {
                    withCredentials: true,
                  });
                const sortedFollowing = response.data.sort((a,b) => a.user_name.localeCompare(b.user_name));
                setFollowing(sortedFollowing);

            } catch(error){
                console.error("팔로잉 에러:", error);
            }
        };
        fetchFollowing();
    }, [user_pk]);
    
    const handleUnSubscribe = (seller_pk) => {
        setFollowing(following.filter(user => user.user_pk !== seller_pk));
    };
    
    return (
        <div style={{marginTop: 50}}>
            {following.length > 0 ? (
                <FollowingList>
                    {following.map((user) => (
                        <FollowingItem key={user.user_pk} user={user} onUnSubscribe={handleUnSubscribe} />
                    ))}
                </FollowingList>
            ): (null)}
        </div>
    );
};
// 팔로워
const Followers = ({ user_pk }) => {
    const [followers, setFollowers] = useState([]);
    useEffect (() => {
        const fetchFollowers = async() => {
            try{
                const response = await axios.get(`https://artion.site/api/user/myfol?user_pk=${user_pk}`,                    {
                    withCredentials: true,
                  });
                const sortedFollower = response.data.sort((a, b) => 
                    a.user_name.localeCompare(b.user_name));
                setFollowers(sortedFollower);

            } catch(error){
                console.error("팔로워 에러", error);
            }
        };
        fetchFollowers();
    }, [user_pk]);
    return (
        <div style={{marginTop: 50}}>
            {followers.length > 0 ? (
                <FollowingList>
                    {followers.map((user) => (
                        <FollowersItem key={user.user_pk} user={user} />
                    ))}
                </FollowingList>
            ): (null)}
        </div>
    );
};

// 페이지
const FollowingPage = () => {
    const { page, user_pk } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const artistName = searchParams.get('artistName') || "MyPage";
    const [selectedPage, setSelectedPage] = useState(page);

    const renderPage = () => {
        switch (selectedPage) {
            case 'liked':
                return <LikedArtworks user_pk={user_pk}/>;
            case 'following':
                return <Following user_pk={user_pk} />;
            case 'followers':
                return <Followers user_pk={user_pk}/>;
            default:
                return <LikedArtworks />;
        }
    };
    const handleSelect = (newPage) => {
        setSelectedPage(newPage);
    };

    return (
        <div>
        <Header />
        <FollowingContainer>
            <HeadContainer>
                <ButtonContainer>
                    <Link to={`/artist/${user_pk}`}>
                    <BackButton />
                    </Link>
                </ButtonContainer>
                <Title>
                    {artistName !== null ? artistName : "MyPage"}
                </Title>
            </HeadContainer>
            <SelectContainer>
                <SelectLink to={`/following/liked/${user_pk}?artistName=${encodeURIComponent(artistName)}`} onClick={() => handleSelect('liked')}>
                    <SelectButton selected={selectedPage === 'liked'}>좋아요</SelectButton>
                </SelectLink>
                <SelectLink to={`/following/following/${user_pk}?artistName=${encodeURIComponent(artistName)}`} onClick={() => handleSelect('following')}>
                    <SelectButton selected={selectedPage === 'following'}>팔로잉</SelectButton>
                </SelectLink>
                <SelectLink to={`/following/followers/${user_pk}?artistName=${encodeURIComponent(artistName)}`} onClick={() => handleSelect('followers')}>
                    <SelectButton selected={selectedPage === 'followers'}>팔로워</SelectButton>
                </SelectLink>
            </SelectContainer>
            <div>
                {renderPage()}
            </div>
        </FollowingContainer>
        </div>
    );
};

export default FollowingPage;
