FROM node:20
WORKDIR /home

# 프로젝트의 package.json 복사 및 패키지 설치
COPY front/package.json ./
RUN npm install

# src 및 public 폴더 복사
COPY front/public ./public
COPY front/src ./src

# 나머지 파일 복사
COPY front/. .

EXPOSE 3000
CMD ["npm", "start"]
