import Profile from "../element/profile";
import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { BackHeader } from "../components";
import DaumPost from "../components/DaumPost";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const Div = styled.div`
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputSize = styled.input`
  width: 80%;
  font-size: 20px;
  padding: 5px;
  margin-bottom: 5%;
  border: 1px solid #d0d0d0;
  background-color: #f0f0f0;
`;

const SubmitButton = styled.button`
  width: 80%;
  padding: 5px;
  border: 2px solid #d0d0d0;
  margin-bottom: 10%;
  background-color: lightgray;
`;

const AddressDiv = styled.div`
 display: flex;
  flex-direction: column;
  width: 80%;
  margin-bottom: 5%;
  
  &>*{
  width: 100%;
  margin-bottom: 5%;
  padding: 5px;
  }
`;

const P = styled.p`
    font-size : 20px;
    margin: 10px;
    width: 80%;
    color: black;
`;

const AccountDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-bottom: 5%;

  &>*{
  width: 100%;
  margin-bottom: 0;
  padding: 5px;
  }
`;

const Select = styled.select`
   font-size: 20px;
   margin-bottom: 5%;
    border: 1px solid #d0d0d0;
    background-color: #f0f0f0;
`;

const AllBox = styled.div`
  width: 100%;
`;

const AddressButton = styled.button`
  border: 1px solid #d0d0d0;
  width: 30%;
  margin-left : 5%;
  background-color: lightgray;
`;

const AddressSerchDiv = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  aligin-items: center;
  justify-content : space-between;
  padding:0;
`;

export default function SettingPage() {
  const [text, setText] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [acc, setAccount] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [submit, setSubmit] = useState(false);
  const [mail, setMail] = useState(``);
  const id = useParams();
  const navigate = useNavigate();
    
  //버튼 상태를 위한 state
  const [popup, setPopup] = useState(false);

  //주소 객체 관리를 위한 state
    const [form, setForm] = useState({
      address2: '',
      zonecode: '', 
  });

  //주소 팝업 열기
  const handleComplete = () => {
    setPopup(!popup);
  }  

  //formdata가 바뀔 때마다 저장
  useEffect(()=> {
      setAddress(form.address2);
      setMail(form.zonecode);
  },[form.zonecode])

  //useEffect로 URL 연결
  useEffect(() => {
    if(submit){
    async function postUserData() {
      try{
          await axios.put(`https:/artion.site/api/user/update`,{
          user_name : text,
          phone_number : phone,
          bank_name : bankName,
          user_account : acc,
          address : fullAdd
      },        {
        withCredentials: true,
      });
      alert("개인정보가 수정되었습니다.");
      navigate('/');
    }catch(error){
      console.error(error);
    }finally{
      setSubmit(false);
    }
  }
  postUserData();
}
  }, [id, submit]); 
  
  function setN(event){
    const newText = event.target.value;
    setText(newText);   
  }

  const setP = event => {
    const newPhone = event.target.value;
    setPhone(newPhone);
  }

  const setB = event => {
    const newBankName = event.target.value;
    setBankName(newBankName);
  }

  const setA = event => {
    const newAccount = event.target.value;
    setAccount(newAccount);
  }

  const setD = event => {
    const newDtailAdd = event.target.value;
    setDetailAddress(newDtailAdd);
  }

  const fullAdd = mail + `,` + address + ',' +  detailAddress ;
  
  //, 앞까지 불러오는 함수
  const getFirstString = (str) => {
    return str.split(',')[0].trim();
  }

  //, 뒤를 불러오는 함수
  const getSecondString = (str) => {
    return str.split(',')[1]?.trim() || '';
  }

  //, 뒤를 불러오는 함수
  const getThirdString = (str) => {
    return str.split(',')[2]?.trim() || '';
  }

  //개인정보 수정전 정보 불러오는 부분
  useEffect(()=>{
    axios.get(`https:/artion.site/api/user/update`,         {
          withCredentials: true,
        })
    .then( response => {
      const { user_name, phone_number, bank_name, user_account, address } = response.data;

      // 필요한 상태 업데이트
      setText(user_name);
      setPhone(phone_number);
      setBankName(bank_name);
      setAccount(user_account);

      // 주소 파싱
      const parsedMail = getFirstString(address);
      const parsedAddress = getSecondString(address);
      const parsedDetailAddress = getThirdString(address);

      // 파싱한 값을 상태로 설정 및 콘솔 출력
      setMail(parsedMail);
      setAddress(parsedAddress);
      setDetailAddress(parsedDetailAddress);

      // setForm을 response data를 사용해 직접 업데이트
      setForm(prevForm => ({
        ...prevForm,
        address2: parsedAddress,
        zonecode: parsedMail
      }));

    }).catch(error => {
      console.error(error); 
    })
  },[]);

  const postButton = () => {
    // 필드 값이 비어 있거나 'default' 값인지 확인
    const requiredFields = [text, phone, bankName, acc, address, detailAddress]; 
    const allFieldsFilled = requiredFields.every(field => 
        field && field.trim() !== '' && field !== 'default'
    );

    if (!allFieldsFilled) {
        alert("입력이 완료되지 않았습니다. 모든 필드를 입력해주세요.");
    } else {
        setSubmit(true);
    }
};

  return (
    <AllBox>
        {popup && <DaumPost address={form} setAddress={setForm} handleComplete={handleComplete} />}
      <GlobalStyle></GlobalStyle>
      <BackHeader />
      <Profile user={id.user_pk}/>
      <Div>
        <P>닉네임</P>
        <InputSize  placeholder="닉네임을 입력하세요." value={text} onChange={setN} ></InputSize>
        <P>핸드폰 번호</P>
        <InputSize placeholder="번호를 입력하세요." value={phone} onChange={setP}></InputSize>
        <P>계좌정보</P>
        <AccountDiv>
        <Select value={bankName} onChange={setB}>
        <option value="default">--은행선택--</option>
        <option value="국민은행 ">KB국민은행</option>
            <option value="신한은행">신한은행</option>
            <option value="하나은행">하나은행</option>
            <option value="우리은행">우리은행</option>
            <option value="IBK기업은행">IBK기업은행</option>
            <option value="KDB산업은행">KDB산업은행</option>
            <option value="NH농협은행">NH농협은행</option>
            <option value="SC제일은행">SC제일은행</option>
            <option value="한국씨티은행">한국씨티은행</option>
            <option value="카카오뱅크">카카오뱅크</option>
            <option value="케이뱅크">케이뱅크</option>
            <option value="토스뱅크">토스뱅크</option>
            <option value="부산은행">부산은행</option>
            <option value="대구은행">대구은행</option>
            <option value="광주은행">광주은행</option>
            <option value="전북은행">전북은행</option>
            <option value="경남은행">경남은행</option>
            <option value="제주은행">제주은행</option>
            <option value="우체국">우체국</option> 
            <option value="새마을금고">새마을금고</option>  
            <option value="신협">신협</option> 
        </Select>
        <InputSize placeholder="계좌를 입력하세요." value={acc} onChange={setA} ></InputSize>
        </AccountDiv>
        <P>주소정보</P>
        <AddressDiv>
          <AddressSerchDiv>
          <InputSize readOnly style={{ marginBottom: '0' }} placeholder="우편번호" value={form.zonecode}></InputSize>
          <AddressButton onClick={handleComplete}>주소검색</AddressButton>
          </AddressSerchDiv>
          <InputSize readOnly placeholder="도로명주소" value={form.address2} ></InputSize>
          <InputSize placeholder="상세주소를 입력하세요." value={detailAddress} onChange={setD} ></InputSize>
        </AddressDiv>
        <SubmitButton onClick={postButton}>저장</SubmitButton>
      </Div>
    </AllBox>
  )
}