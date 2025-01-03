import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BackHeader } from '../components';
import app from '../firebase';

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

    & > * {
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
    padding: 0;
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

    & > * {
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

    & > * {
        margin-right: 5px;
        margin-left: 5px;
    }
`;

const AddList = styled.div`
    display: flex;
    flex-direction: row;
    width: calc(80% + 10px);
    padding: 0;

    & > * {
        margin-right: 5px;
        margin-left: 5px;
    }
`;

const List = styled.div`
    height: auto;
    border: 1px solid #d0d0d0;
    width: 80%;
`;

const StatusP = styled.p`
    font-size: 20px;
    margin: 0;
    padding: 2px;
    background-color: #d0d0d0;
`;

const Button = styled.button`
    width: 80%;
    padding: 5px;
    border: 1px solid #d0d0d0;
    margin-bottom: 10%;
    background-color: lightgray;
`;

const ImageDiv = styled.div`
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;

    & > * {
        width: 30%;
        height: 30%;
        padding: 3%;
        cursor: 'pointer';
    }
`;

export default function PutRegister() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [minP, setMinP] = useState();
    const [maxP, setMaxP] = useState();
    const [width, setWidth] = useState();
    const [depth, setDepth] = useState();
    const [height, setHeight] = useState();
    const [created, setCreated] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [painter, setPainter] = useState('');
    const [images, setImage] = useState([]);
    const [selectedOption, setSelectedOption] = useState('default');
    const [optionList, setOptionList] = useState([]);
    const [minDateTime, setMinDateTime] = useState('');
    const [submit, setSubmit] = useState('false');
    const [date, setDate] = useState('');
    const id = useParams();
    const storage = getStorage();
    const navigate = useNavigate();

    //이름 입력
    const setN = (event) => {
        setName(event.target.value);
    };
    //작품 정보
    const setInfo = (event) => {
        setDescription(event.target.value);
    };
    //최소판매 가격
    const setMip = (e) => {
        setMinP(e.target.value);
    };
    //즉시 판매가격
    const setMap = (e) => {
        setMaxP(e.target.value);
    };
    //width
    const setWid = (e) => {
        setWidth(e.target.value);
    };
    //height
    const setHei = (e) => {
        setHeight(e.target.value);
    };
    //depth
    const setDep = (e) => {
        setDepth(e.target.value);
    };
    //created
    const setCrea = (e) => {
        setCreated(e.target.value);
    };
    //start
    const setStar = (e) => {
        setStart(e.target.value);
    };
    //end
    const setEn = (e) => {
        setEnd(e.target.value);
    };
    //painter
    const setPain = (e) => {
        setPainter(e.target.value);
    };

    const selecetOption = (e) => {
        setSelectedOption(e.target.value);
        return selectedOption;
    };

    const addList = () => {
        if (selectedOption === 'default') {
            alert('선택불가능한 옵션입니다.');
            return; // 함수 종료
        }
        if (selectedOption && !optionList.includes(selectedOption)) {
            setOptionList((prevOptions) => {
                const updatedOptions = [...prevOptions, selectedOption];
                return updatedOptions;
            });
        } else {
            alert('이미 존재하는 옵션 입니다.');
        }
    };

    const deleteList = (index) => {
        setOptionList((prevOptions) => {
            return prevOptions.filter((_, i) => i !== index);
        });
    };

    const uploadImage = async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        // 이미지 업로드
        await uploadBytes(storageRef, file);
        // 다운로드 URL 가져오기
        const url = await getDownloadURL(storageRef);
        // URL을 images 배열에 추가
        setImage((prevImages) => [...prevImages, url]);
    };

    const imageChange = (e) => {
        const files = Array.from(e.target.files);
        // 여러 파일 업로드
        files.forEach((file) => uploadImage(file));
    };

    //이미지 클릭시 삭제 부분
    const imageDelete = (index) => {
        const confirmDelete = window.confirm('삭제하시겠습니까?');
        if (confirmDelete) {
            setImage((prevImages) => prevImages.filter((_, i) => i !== index));
        }
    };

    //선택날짜 최대 최소를 위한 부분
    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        const currentDate = `${year}-${month}-${day}`;
        setMinDateTime(currentDateTime);
        setDate(currentDate);
    }, []);

    // 그림 등록 부분
    useEffect(() => {
        if (submit === true) {
            async function postArt() {
                try {
                    const request = await axios.put(`https://artion.site/api/art/update?art_pk=${id.art_pk}`, {
                        //담아보낼 데이터
                        art_name: name,
                        art_info: description,
                        minP: minP,
                        maxP: maxP,
                        width: width,
                        depth: depth,
                        height: height,
                        createdAt: created,
                        startTime: start,
                        endTime: end,
                        painter: painter,
                        artImage: images,
                        artCategory: optionList,
                    });

                    alert('작품이 수정되었습니다.');
                    navigate('/');
                } catch (e) {
                    console.error(e);
                } finally {
                    setSubmit(false);
                }
            }
            postArt();
        }
    }, [submit, id]);

    //입력 상태 확인
    const submitButton = () => {
        const requiredFields = [
            name,
            description,
            minP,
            maxP,
            width,
            depth,
            height,
            created,
            start,
            end,
            painter,
            images,
            optionList,
        ];
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
            alert('입력이 완료되지 않았습니다. 모든 필드를 입력해주세요.');
            return;
        }
        // 날짜 유효성 체크
        const now = new Date();
        const startDateTime = new Date(start);
        const endDateTime = new Date(end);
        const timeDiffMs = endDateTime - startDateTime;
        const minTimeDiff = 3 * 60 * 60 * 1000; // 최소 3시간 (ms)
        const maxTimeDiff = 7 * 24 * 60 * 60 * 1000; // 최대 7일 (ms)

        if (startDateTime <= now) {
            alert('시작일자는 현재 시간보다 이후여야 합니다.');
        } else if (endDateTime < startDateTime) {
            alert('종료일자는 시작일자보다 최소 3시간 이후여야 합니다.');
        } else if (timeDiffMs < minTimeDiff) {
            alert('종료일자는 시작일자로부터 최소 3시간 이후여야 합니다.');
        } else if (timeDiffMs > maxTimeDiff) {
            alert('종료일자는 시작일자로부터 최대 7일 이내여야 합니다.');
        } else {
            setSubmit(true); // 모든 조건 충족 시 제출
        }
    };

    //그림 정보 불러오는 부분
    useEffect(() => {
        axios
            .get(`https://artion.site/api/art/update?art_pk=${id.art_pk}`)
            .then((response) => {
                setName(response.data.art_name);
                setDescription(response.data.art_info);
                setMinP(response.data.minP);
                setMaxP(response.data.maxP);
                setWidth(response.data.width);
                setDepth(response.data.depth);
                setHeight(response.data.depth);
                setCreated(response.data.createdAt);
                setStart(response.data.startTime);
                setEnd(response.data.endTime);
                setPainter(response.data.painter);
                setImage(response.data.artImage);
                setOptionList(response.data.artCategory);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    return (
        <>
            <GlobalStyle />
            <BackHeader></BackHeader>
            <Div>
                <P>작품 정보</P>
                <DetailP>기본정보</DetailP>
                <InputSize type="text" placeholder="작품명" value={name} onChange={setN}></InputSize>
                <InputSize type="text" placeholder="작가명" value={painter} onChange={setPain}></InputSize>
                <TextBox placeholder="작품설명" value={description} onChange={setInfo}></TextBox>
                <DetailP>제작날짜</DetailP>
                <InputSize type="date" value={created} onChange={setCrea} max={date}></InputSize>
                <DetailP>작품세부정보</DetailP>
                <ArtSize>
                    <InputSize type="text" placeholder="width" value={width} onChange={setWid}></InputSize>
                    <InputSize type="text" placeholder="height" value={height} onChange={setHei}></InputSize>
                    <InputSize type="text" placeholder="depth" value={depth} onChange={setDep}></InputSize>
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
                    <SelectButton onClick={addList} style={{ border: '2px solid #d0d0d0' }}>
                        추가
                    </SelectButton>
                </SelectList>
                {optionList.map((option, index) => (
                    <AddList key={index}>
                        <List>
                            <StatusP>{option}</StatusP>
                        </List>
                        <SelectButton
                            onClick={() => {
                                deleteList(index);
                            }}
                        >
                            삭제
                        </SelectButton>
                    </AddList>
                ))}
                <P>입찰 정보</P>
                <DetailP>시작일자</DetailP>
                <InputSize type="datetime-local" min={minDateTime} value={start} onChange={setStar}></InputSize>
                <DetailP>종료일자</DetailP>
                <InputSize type="datetime-local" value={end} onChange={setEn} min={start}></InputSize>
                <DetailP>작품판매가</DetailP>
                <InputSize type="text" placeholder="최소 입찰 가격" value={minP} onChange={setMip}></InputSize>
                <InputSize type="text" placeholder="즉시 판매 가격" value={maxP} onChange={setMap}></InputSize>
                <P>작품 사진</P>
                <DetailP>첫번째 사진은 뒷 배경이 나오지 않은 사진을 넣어주세요. </DetailP>
                <InputSize
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={imageChange}
                    style={{ border: 0, backgroundColor: 'white' }}
                ></InputSize>
                <ImageDiv>
                    {images.map((image, index) => (
                        <img key={index} src={image} onClick={() => imageDelete(index)} />
                    ))}
                </ImageDiv>
                <Button onClick={submitButton}>제출</Button>
            </Div>
        </>
    );
}
