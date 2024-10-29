import DaumPostcode from "react-daum-postcode";
import { styled } from "styled-components";
import { AiOutlineClose } from "react-icons/ai";

const DaumPostBackground = styled.div`
   width: 100vw; 
    height: 100vh; 
    position: fixed; 
    top: 0; 
    left: 0; 
    z-index: 1000;
    background : rgba(0, 0, 0, 0.8);
`;

const DaumPostContainer = styled.div`    
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    `;

const Div = styled.div`
  display : flex;
  justify-content : space-between;
`;

// const P = styled.div`
//   color : #fff;
//   height : 50px;
//   width : 100%;
// `;

const Post = styled(DaumPostcode)`
 height : 50%;
  width : 50%;
`;

const AiOutlineCloseSet = styled(AiOutlineClose)`
  color: white;
  height : 20px;
  width : 20px;
  margin: 5px;

`;

export default function DaumPost(props) {
  const complete = (data) =>{
    let fullAddress = data.address || '';
    let zonecode = data.zonecode || '';
    let extraAddress = '';

    if (data.addressType === 'R') {
        if (data.bname !== '') {
            extraAddress += data.bname;
        }
        if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
        }
        fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
    }
   
    // 선택한 주소값을 상태값으로 설정
    props.setAddress({
        ...props,
        address2:fullAddress,
        zonecode:zonecode,
    })

    // 팝업창 닫기(팝업창 'X' 표시)
    props.handleComplete();
}
    return(
        <DaumPostBackground>
            <DaumPostContainer>
            <Div >  
                <AiOutlineCloseSet  onClick={()=> {props.handleComplete()}}/>
            </Div>  
            <Post
                autoClose
                onComplete={complete} /> 
            </DaumPostContainer>   
        </DaumPostBackground>     
    )
}
