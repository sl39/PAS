import styled from "styled-components"
import { createGlobalStyle } from 'styled-components';
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { BackHeader } from "../components";
import app from "../firebase";

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
  width: 80%;
  padding-left: 0;
  margin-bottom: 1%;
  margin-top: 5%;
`;

const DetailP = styled.p`
  width: 80%;
  margin: 0 0 5px 0;
  color: darkgray;
  padding-left: 0;
`;

const InputSize = styled.input`
  width: 80%;
  height: 40%;
  font-size: 20px;
  border: 1px solid #d0d0d0;
   background-color: #f0f0f0;
`;

const TextBox = styled.textarea`
  width: 80%;
  height: 100px;
  font-size: 20px;
  resize: none;
  border: 1px solid #d0d0d0;
   background-color: #f0f0f0;
`;

const SelectSize = styled.select`
  width: 80%;
  font-size: 20px;
  border: 1px solid #d0d0d0;
  background-color: #f0f0f0;
`;

const SelectButton = styled.button`
    padding: 5px;
    border: 1px solid #d0d0d0;
    width: 30%;
    background-color: lightgray;
`;

const ArtSize = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(80% + 10px);
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
  width: calc(80% + 10px);
  padding: 0;


  &> *{
  margin-right: 5px;
  margin-left: 5px;
  }
`;

const AddList = styled.div`
  display: flex;
  flex-direction: row;
  width: calc(80% + 10px);
  padding: 0;
  
  &> *{
    margin-right: 5px;
    margin-left: 5px;
    }
`;

const List = styled.div`
  height: auto;
  border: 1px solid #d0d0d0;
  width:80%;
`;

const StatusP = styled.p`
  font-size: 20px;
  margin:0;
  padding: 2px;
  background-color: #d0d0d0;
`;

const Button = styled.button`
  width: 80%;
  margin-bottom: 10%;
  border: 1px solid #d0d0d0;
  background-color: lightgray;
`;

const ImageDiv = styled.div`
  width: 80%;
  display: flex;
  align-items : center;
  justify-content: center;
  flex-wrap: wrap;

  &>*{
    width: 30%;
    height: 30%;
    padding: 3%;
    cursor: 'pointer';
  }
`;

export default function Register(){
  const [name2, setName2] = useState('');
  const [description2, setDescription] = useState('');
  const [minP2, setMinP2] = useState();
  const [maxP2, setMaxP2] = useState();
  const [width2, setWidth2]= useState();
  const [depth2, setDepth2]= useState();
  const [height2, setHeight2] = useState();
  const [created, setCreated] = useState('');
  const [start, setStart]=  useState('');
  const [end, setEnd] = useState('');
  const [painter2, setPainter2] = useState('');
  const [images, setImage] = useState([]);
  const [selectedOption, setSelectedOption] = useState('default');
  const [optionList, setOptionList] = useState([]);
  const [minDateTime, setMinDateTime] = useState('');
  const [date, setDate] = useState('');
  const [submit, setSubmit] = useState('false');
  const id = useParams();
  const storage = getStorage();
  const navigate = useNavigate();

  //이름 입력
  const setN = (event) =>{
    setName2(event.target.value);
  } 
  //작품 정보
  const setInfo = (event) => {
    setDescription(event.target.value);
  }
  //최소판매 가격
  const setMip = (e) => {
    setMinP2(e.target.value);
  }
  //즉시 판매가격
  const setMap = (e) => {
    setMaxP2(e.target.value);
  }
  //width
  const setWid = (e) => {
    setWidth2(e.target.value);
  }
  //height
  const setHei = (e) => {
    setHeight2(e.target.value);
  }
  //depth
  const setDep = (e) => {
    setDepth2(e.target.value);
  }
  //created
  const setCrea = (e) => {
    setCreated(e.target.value);
  }
  //start
  const setStar = (e) => {
    setStart(e.target.value);
  }
  //end
  const setEn = (e) => {
    setEnd(e.target.value);
  }
  //painter
  const setPain = (e) => {
    setPainter2(e.target.value);
  }

  const selecetOption = (e) => {
    setSelectedOption(e.target.value);
    return selectedOption;
  }

  const addList = () => {
    if (selectedOption === "default"  || selectedOption === "") {
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
 
  const uploadImage = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        // 이미지 업로드
        await uploadBytes(storageRef, file);
        // 다운로드 URL 가져오기
        const url = await getDownloadURL(storageRef);

        // URL을 images 배열에 추가
        setImage(prevImages => [...prevImages, url]);
  };

  const imageChange = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => uploadImage(file)); // 여러 파일 업로드

  };

    //이미지 클릭시 삭제 부분
  const imageDelete =(index) =>{
      const confirmDelete = window.confirm("삭제하시겠습니까?");
      if (confirmDelete) {
        setImage(prevImages => prevImages.filter((_, i) => i !== index));

      // 삭제 시 파일 input 초기화
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
        }

        console.log(images);
  };

  //현재 이전 날짜 선택 불가 옵션
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() +1).padStart(2,'0');
    const day = String(now.getDate()).padStart(2,'0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    const currentDate = `${year}-${month}-${day}`;
    setMinDateTime(currentDateTime);
    setDate(currentDate);
  }, []);

  // 그림 등록 부분
  useEffect(()=>{
    if(submit === true ){
    async function postArt() {
      try{
        const response = await axios.post(`https://artion.site/api/art/create?user_pk=${id.user_pk}`,{
          art_name: name2,
          art_info: description2,
          minP: minP2,
          maxP: maxP2,
          width: width2,
          depth: depth2,
          height: height2,
          createdAt: created,
          startTime: start,
          endTime: end,
          painter: painter2,
          artImage: images,
          artCategory : optionList
        })
        alert("작품이 등록 되었습니다.");
        navigate('/');
      }catch(e){
          console.error(e);
      }finally{
        setSubmit(false);
      } 
    }
    postArt(); 
  }
  }, [id,submit]);

  const submitButton = () => {
    const requiredFields = [name2, description2, minP2, maxP2, width2, depth2, height2, created, start, end, painter2, images, optionList]; 
    let allFieldsFilled = true;

    requiredFields.forEach((field, index) => {
        if (Array.isArray(field)) {
            if (field.length === 0) {
                allFieldsFilled = false; // 배열이 비어있으면 false로 설정
            }
        } else if (typeof field === 'string') {
            if (field.trim() === '') {
                allFieldsFilled = false; // 빈 문자열이면 false로 설정
            }
        } else if (typeof field === 'number') {
            if (isNaN(field)) {
                allFieldsFilled = false; // 숫자가 NaN이면 false로 설정
            }
        } else {
            allFieldsFilled = false; // 배열도 아니고 문자열도 아닌 경우 false로 설정
        }
    });
    if (!allFieldsFilled) {
        alert("입력이 완료되지 않았습니다. 모든 필드를 입력해주세요.");
    } else {
        setSubmit(true);
    }
}
  return(
    <>
     <GlobalStyle />
    <BackHeader></BackHeader>
    <Div>
      <P>작품 정보</P>
      <DetailP>기본정보</DetailP>
      <InputSize type="text" placeholder="작품명" value={name2} onChange={setN}></InputSize>
      <InputSize type="text" placeholder="작가명"  value={painter2} onChange={setPain}></InputSize>
      <TextBox placeholder="작품설명" value={description2} onChange={setInfo}></TextBox>
      <DetailP>제작날짜</DetailP>
      <InputSize type="date" value={created} onChange={setCrea} max={date}></InputSize>
      <DetailP>작품세부정보</DetailP>
      <ArtSize>
        <InputSize type="number" placeholder="width" value={width2} onChange={setWid}></InputSize>
        <InputSize type="number" placeholder="height" value={height2} onChange={setHei}></InputSize>
        <InputSize type="number" placeholder="depth" value={depth2} onChange={setDep}></InputSize>
      </ArtSize>
      <SelectList>
        <SelectSize onChange={selecetOption} >
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
      <SelectButton onClick={addList}>추가</SelectButton>
      </SelectList>
        {optionList.map((option, index) => (
            <AddList  key={index}>
              <List>
                  <StatusP>
                    {option}
                  </StatusP>
                </List>
              <SelectButton onClick={() => {deleteList(index)}}>삭제</SelectButton>
            </AddList>
        ))}
        <P>입찰 정보</P>
        <DetailP>시작일자</DetailP>
        <InputSize type="datetime-local" min={minDateTime} value={start} onChange={setStar}></InputSize>
        <DetailP>종료일자</DetailP>
        <InputSize type="datetime-local" value={end} onChange={setEn} min={start}></InputSize>
        <DetailP>작품판매가</DetailP>
        <InputSize type="number" placeholder="최소 입찰 가격" value={minP2} onChange={setMip}></InputSize>
        <InputSize type="number" placeholder="즉시 판매 가격" value={maxP2} onChange={setMap}></InputSize>
        <P>작품 사진</P>
        <DetailP>첫번째 사진은 뒷 배경이 나오지 않은 사진을 넣어주세요. </DetailP>
        <InputSize type="file" multiple accept="image/*" onChange={imageChange} style={{border: 0, backgroundColor: 'white'}}></InputSize>
        <ImageDiv>
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              onClick={()=>imageDelete(index)}
            />
          ))}
        </ImageDiv>
        <Button onClick={submitButton}>제출</Button>
        </Div>
    </>
  )
}
