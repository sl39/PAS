import Profile from "../element/profile";
import { useState, useEffect } from "react";
import axios from "axios";
import BaseAppBar from "../element/appBar";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  &>*{
    width: 50%;
  }
`;

const InputSize = styled.input`
  width: 80%;
  height: 40%;
  font-size: 20px;
  padding: 5px;
`;

const SubmitButton = styled.button`
 width: 100%;
  padding: 5px;
`;

const AddressDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  
  &>*{
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  }
`;

const P = styled.p`
  font-size : 20px;
  margin: 10px;
   width: 80%;
`;

const AccountDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
   &>*{
  width: 100%;
  margin-bottom: 10px;
  padding: 5px;
  }
`;

const Select = styled.select`
  font-size: 20px;
`;

export default function SettingPage() {
  
  const [text, setText] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [acc, setAccount] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [submit, setSubmit] = useState(false);

  //useEffect로 URL 연결
  useEffect(() => {
    if(submit){
    async function postUserData() {
      try{
    const request = await axios.post("http://artion.site:8080/api/user/create",{
          user_name : text,
          phone_number : phone,
          bank_name : bankName,
          user_account : acc,
          address : fullAdd
      });
      console.log(request);
      console.log("성공");
    }catch(error){
      console.error(error);
    }finally{
      setSubmit(false);
    }
  }
  postUserData();
}
  }, [submit]); 
  
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

  const setAdd = event => {
    const newAddress = event.target.value;
    setAddress(newAddress);
  }

  const setD = event => {
    const newDtailAdd = event.target.value;
    setDetailAddress(newDtailAdd);
  }

  const fullAdd = address + ' ' +  detailAddress ;

  //버튼이 눌러지면 post메소드 실행
  function postButton(){
    setSubmit(true);
    alert("성공");
  }

  return (
    <>
      <GlobalStyle></GlobalStyle>
      <BaseAppBar />
      <Profile />
      <Div>
        <P>닉네임</P>
        <InputSize  placeholder="닉네임을 입력하세요." value={text} onChange={setN} ></InputSize>
        <P>핸드폰 번호</P>
        <InputSize placeholder="번호를 입력하세요." value={phone} onChange={setP}></InputSize>
        <P>계좌정보</P>
        <AccountDiv>
        <Select value={bankName} onChange={setB}>
        <option value="kb">KB국민은행</option>
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
          <InputSize placeholder="도로명주소를 입력하세요." value={address} onChange={setAdd} ></InputSize>
          <InputSize placeholder="상세주소를 입력하세요." value={detailAddress} onChange={setD} ></InputSize>
        </AddressDiv>
      </Div>
      <SubmitButton onClick={postButton}>저장</SubmitButton>
    </>
  )
}