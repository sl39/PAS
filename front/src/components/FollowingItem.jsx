import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

const ItemContainer = styled.li`
    list-style-type: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 2px solid gray;
    border-radius: 15px;
    padding: 10px;
    margin-bottom: 10px;
`;

const UserImage = styled.img`
    width: 100px;  
    height: 100px; 
    border-radius: 50%; 
`;

const PlaceholderImage = styled.div`
    width: 100px;
    height: 100px;
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
    cursor: pointer;
    font-size: 18px;
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
    const { user_pk} = useParams();
    const seller_pk = user.user_pk;
    const customer_pk = user_pk;

    if (!user) {
        return null;
    }
    // 구독취소 부분
    const handleCancelSubscription = async() => {
        try {
            await axios.delete(`https://artion.site/api/following/${customer_pk}/unfollow/${seller_pk}`);
            onUnSubscribe(seller_pk);
        } catch(error){
            console.error("구독취소 실패:", error);
        }
    };

    return (
        <ItemContainer>
            {/* user_pk값 추가하기 */}
            <UserPage to={`/test`}>
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
