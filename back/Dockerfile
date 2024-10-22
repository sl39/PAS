# 베이스 이미지 선택 (Java 17)
FROM openjdk:17-jdk-slim

# 작업 디렉터리 설정
WORKDIR /app

# Gradle 빌드 결과물 JAR 파일을 복사
COPY /home/ubuntu/artion/build/libs/artion-0.0.1-SNAPSHOT.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]

# 서버가 외부에 노출될 포트
EXPOSE 8080
