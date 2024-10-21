import { IoArrowBackOutline } from "react-icons/io5";

const appBar = {
  margin: 0,
  border: 'none',      // 버튼의 기본 스타일 제거
  background: 'none',  // 배경 제거
  cursor: 'pointer'    // 마우스를 올리면 클릭 가능한 커서 표시
}

const size = {
  width: '50px',
  height: '50px',
}

const baseAppBar = {
  display: 'flex',
  fontSize: '50px',
  margin: 0
}

const arrange = {
  display : 'flex',
  alignItems: 'center',
  margin: 0,
  justifyContent: 'space-between'
}

export default function BaseAppBar() {
  return(
  <div style={arrange}>
    <button style={appBar}>
        <IoArrowBackOutline style={size}/>
      </button>
    <p style={baseAppBar}>Artion</p>
    <div style={{width: '50px'}}></div>
  </div>
  );
}