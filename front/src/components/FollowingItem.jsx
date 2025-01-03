import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ItemContainer = styled.li`
    list-style-type: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 2px solid gray;
    border-radius: 15px;
    padding: 10px;
    margin: 0 10px 10px 10px;
`;

const UserImage = styled.img`
    width: 80px;  
    height: 80px; 
    border-radius: 50%; 
`;

const PlaceholderImage = styled.div`
    width: 80px;
    height: 80px;
    background-color: lightgray;
    border-radius: 50%;
    margin-bottom: 10px;
`;

const UserName = styled.span`
    font-size: 20px;
    text-align: left;
    margin-left: 30px;
    flex-grow: 1;
`;

const CancelButton = styled.button`
    color: black;
    cursor: pointer;
    font-size: 12px;
    float: right;
    border-radius: 10px;
    border: 1px solid gray;
    margin: 0 10px 0 10px;
    padding: 3px 5px 3px 5px;
    `;

const UserPage = styled(Link)`
    cursor: pointer;
    display: flex;
    align-items: center;
    text-decoration: none;
    color: black;
`;

const FollowingItem = ({ user, onUnSubscribe}) => {
    const seller_pk = user.user_pk;

    if (!user) {
        return null;
    }
    // 구독취소 부분
    const handleCancelSubscription = async() => {
        try {
            await axios.delete(`https://artion.site/api/following/unfollow/${seller_pk}`,                     {
                withCredentials: true,
              });
            onUnSubscribe(seller_pk);
            alert("더 이상 구독하지 않습니다.")
        } catch(error){
            console.error("구독취소 실패:", error);
        }
    };

    return (
        <ItemContainer>
            <UserPage to={`/artist/${seller_pk}`}>
            {user.user_image ? (
                <UserImage src={user.user_image} alt={user.user_name} />
            ) : (
                <PlaceholderImage />
            )}
            <UserName>{user.user_name}</UserName>
            </UserPage>
            <CancelButton onClick={handleCancelSubscription}>구독 취소</CancelButton>
        </ItemContainer>
    );
};

export default FollowingItem;
