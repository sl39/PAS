# 베이스 이미지 선택 (Java 17)
FROM node:20

# 작업 디렉터리 설정
WORKDIR /home

COPY front/package.json .

RUN npm install

COPY . .

# 애플리케이션 실행
CMD ["npm" "start"]

# 서버가 외부에 노출될 포트
EXPOSE 3000
