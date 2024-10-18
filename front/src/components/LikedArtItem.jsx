import React from 'react';
import styled from 'styled-components';

const ItemContainer = styled.li`
    margin: 20px;
    list-style-type: none;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ArtworkImage = styled.img`
    width: 150px;
    height: auto;
    margin-right: 10px;
`;

const PlaceholderImage = styled.div`
    width: 100px;
    height: 100px;
    background-color: lightgray;
    margin-right: 10px;
`;

const ArtworkTitle = styled.span`
    font-size: 14px;
`;

const LikedArtworkItem = ({ artWork }) => {
    if (!artWork) {
        return null;
    }

    return (
        <ItemContainer>
            {artWork.image ? (
                <ArtworkImage src={artWork.image} alt={artWork.art_name} />
            ) : (
                <PlaceholderImage />
            )}
            <ArtworkTitle>{artWork.art_name}</ArtworkTitle>
        </ItemContainer>
    );
};

export default LikedArtworkItem;