# Node.js 20 이미지 사용
FROM node:20

# 작업 디렉터리 설정
WORKDIR /home

# package.json 복사 및 npm 설치
COPY front/package.json ./
RUN npm install

# 전체 프로젝트 파일 복사
COPY . .

# 포트 노출 및 앱 실행
EXPOSE 3000
CMD ["npm", "start"]
