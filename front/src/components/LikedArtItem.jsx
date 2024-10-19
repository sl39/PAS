import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ItemContainer = styled.li`
    margin: 20px;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const ArtworkImage = styled.img`
    width: 150px;
    height: auto;
    margin-right: 10px;
    cursor: pointer;
`;

const PlaceholderImage = styled.div`
    width: 100px;
    height: 100px;
    background-color: lightgray;
    margin-right: 10px;
    cursor: pointer;
`;

const ArtworkTitle = styled.span`
    font-size: 14px;
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
    padding: 5px 10px;
    cursor: pointer;

    &:hover{
        background-color: lightgray;
    }
`;

const LikedArtworkItem = ({ artWork, isSelected, onClick }) => {
    const art_pk = artWork.art_pk;
    const user_pk = artWork.user_pk;

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
                    <Link to={`/detail/${art_pk}/${user_pk}`} style={{ textDecoration: 'none', color: 'inherit'}}>
                    작품 보기
                    </Link>
                </Option>
                <Option>
                    <Link to={`/test`} style={{ textDecoration: 'none', color: 'inherit'}}>
                    프로필 보기
                    </Link>
                </Option>
            </SelectMessage>
        </ItemContainer>
    );
};

export default LikedArtworkItem;
