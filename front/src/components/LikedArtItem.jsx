import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

const ItemContainer = styled.li`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    margin: 0 5px 20px 5px;
    flex: 1;
    min-width: 0;
`;

const ArtworkImage = styled.img`
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    object-fit: cover;
`;

const PlaceholderImage = styled.div`
    width: 100%;
    height: auto;
    background-color: lightgray;
    margin-right: 10px;
    cursor: pointer;
`;

const ArtworkTitle = styled.span`
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%; 
    max-width: 150px; 
    text-align: center;
`;

const SelectMessage = styled.div`
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    border: 1px solid gray;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index:10;
    display: ${({ visible }) => (visible ? 'block' : 'none')};
    width: auto;
    white-space: nowrap;
`;

const Option = styled.div`
    cursor: pointer;

    &:hover{
        background-color: lightgray;
        border-radius: 3px;
    }
`;

const LikedArtworkItem = ({ artWork, isSelected, onClick }) => {
    const user = useParams();
    const art_pk = artWork.art_pk;
    const seller_pk = artWork.seller_pk;
    const user_pk = user.user_pk
    console.log(artWork)

    if (!artWork) {
        return null;
    }

    return (
        <ItemContainer>
            {artWork.image ? (
                <ArtworkImage src={artWork.image} alt={artWork.art_name} onClick={() => onClick(art_pk)} />
            ) : (
                <PlaceholderImage onClick={() => onClick(art_pk)} />
            )}
            <ArtworkTitle>{artWork.art_name}</ArtworkTitle>
            <SelectMessage visible={isSelected}>
                <Option>
                    <Link to={`/detail/${art_pk}/${user_pk}`} style={{ textDecoration: 'none', color: 'inherit', fontSize: 14}}>
                    작품 보기
                    </Link>
                </Option>
                <Option>
                    <Link to={`/artist/${seller_pk}`} style={{ textDecoration: 'none', color: 'inherit', fontSize: 14}}>
                    프로필 보기
                    </Link>
                </Option>
            </SelectMessage>
        </ItemContainer>
    );
};

export default LikedArtworkItem;
