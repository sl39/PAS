import styled from "styled-components"
import BaseAppBar from "../element/appBar";
import { createGlobalStyle } from 'styled-components';
import { useState, useEffect } from "react";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;   
  justify-content: center;

  &> * {
    width: 80%;
    margin-bottom: 15px;
    padding: 5px;  
  }
`;

const P = styled.p`
  font-size: 20px;
  width: 50%;
  padding-left: 0;
`;

const DetailP = styled.p`
  width: 50%;
  margin: 0 0 5px 0;
  color: darkgray;
`;

const InputSize = styled.input`
  width: 50%;
  height: 40%;
  font-size: 20px;
`;

const TextBox = styled.textarea`
  width: 50%;
  height: 100px;
  font-size: 20px;
  resize: none;
`;

const SelectSize = styled.select`
  width: 50%;
  height:31px;
  font-size: 20px;
`;

const ArtSize = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(50% + 10px);
  padding: 0;
  
  &> * {
   margin-right: 5px;
   margin-left: 5px;
   padding: 5px;
  }
`;

const SelectList = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(50% + 10px);
  padding: 0;

  &> *{
  width: 100%;
  margin-right: 5px;
  margin-left: 5px;
  padding-left: 0;
  }
`;

const AddList = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(50% + 10px);
  padding: 0;


  &> *{
    width: 100%;
    margin-right: 5px;
    margin-left: 5px;
    padding-left: 0;
    }
`;

const List = styled.div`
  border : 2px solid darkgray;
  border-radius: 5px;
  font-size: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 5px;
`;

export default function PutRegister(){
  const [images, setImage] = useState([]);
  const [selectedOption, setSelectedOption] = useState('default');
  const [optionList, setOptionList] = useState([]);
  const [minDateTime, setMinDateTime] = useState('');

  const selecetOption = (e) => {
    setSelectedOption(e.target.value);
    return selectedOption;
  }

  const addList = () => {
    if (selectedOption == "default") {
      alert("선택불가능한 옵션입니다.");
      return; // 함수 종료
  }
    if(selectedOption && !optionList.includes(selectedOption)){
      setOptionList((prevOptions) => {
        const updatedOptions = [...prevOptions, selectedOption];
        // selectedOption 초기화
        return updatedOptions;
      });
    }else{
      alert('이미 존재하는 옵션 입니다.');
    }
  }

  const deleteList = (index) => {
    setOptionList((prevOptions) => {
      return prevOptions.filter((_,i) => i !== index)
    })
  };

  const imageChange = (e) => {
    const selectedFile = Array.from(e.target.files);
    const newImage = [...images,...selectedFile]
    setImage(newImage);
  };

  useEffect(() => {
    console.log('옵션 리스트:', optionList);
  }, [optionList]);

  useEffect(() => {
    console.log('선택된 옵션:', selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() +1).padStart(2,'0');
    const day = String(now.getDate()).padStart(2,'0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    setMinDateTime(currentDateTime);
  }, []);

  return(
    <>
     <GlobalStyle />
    <BaseAppBar></BaseAppBar>
    <Div>
      <P>작품 정보</P>
      <DetailP>기본정보</DetailP>
      <InputSize type="text" placeholder="작품명"></InputSize>
      <InputSize type="text" placeholder="작가명"></InputSize>
      <TextBox placeholder="작품설명"></TextBox>
      <DetailP>제작날짜</DetailP>
      <InputSize type="date" max={minDateTime}></InputSize>
      <DetailP>작품세부정보</DetailP>
      <ArtSize>
        <InputSize type="text" placeholder="가로"></InputSize>
        <InputSize type="text" placeholder="세로"></InputSize>
        <InputSize type="text" placeholder="높이"></InputSize>
      </ArtSize>
      <SelectList>
        <SelectSize onChange={selecetOption}>
        <option value="default">--카테고리 선택--</option>
          <option value="유화">유화</option>
          <option value="수채화">수채화</option>
          <option value="아크릴화">아크릴화</option>
          <option value="수묵화">수묵화</option>
          <option value="채색화">채색화</option>
          <option value="벽화">벽화</option>
          <option value="판화">판화</option>
          <option value="콜라쥬">콜라쥬</option>
          <option value="풍경화">풍경화</option>
          <option value="인물화">인물화</option>
          <option value="정물화">정물화</option>
          <option value="크로키">크로키</option>
          <option value="추상화">추상화</option>
          <option value="누드화">누드화</option>
          <option value="초상화">초상화</option>
        </SelectSize>
      <button onClick={addList}>추가</button>
      </SelectList>
        {optionList.map((option, index) => (
            <AddList  key={index}>
              <List>{option}</List>
              <button onClick={() => {deleteList(index)}}>삭제</button>
            </AddList>
        ))}
        <P>입찰 정보</P>
        <DetailP>시작일자</DetailP>
        <InputSize type="datetime-local" min={minDateTime}></InputSize>
        <DetailP>종료일자</DetailP>
        <InputSize type="datetime-local"></InputSize>
        <DetailP>작품판매가</DetailP>
        <InputSize type="text" placeholder="최소 입찰 가격"></InputSize>
        <InputSize type="text" placeholder="즉시 판매 가격"></InputSize>
      
        <P>작품 사진</P>
        <DetailP>첫번째 사진은 뒷 배경이 나오지 않은 사진을 넣어주세요. </DetailP>
        <InputSize type="file" multiple accept="image/*" onChange={imageChange}></InputSize>
        <div>
          {images.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              style={{ width: "100px", height: "100px", margin: "5px" }}
            />
          ))}
        </div>
        </Div>
        <Button>제출</Button>
    </>
  )
}