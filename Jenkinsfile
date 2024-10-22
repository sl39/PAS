pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                // GitHub에서 소스 코드를 체크아웃
                checkout scm                
            }
        }
        stage('Build') {
            steps {
                // 체크아웃한 디렉토리에서 작업
                dir('./') { // 기본 디렉토리 사용 (체크아웃된 경로)
                    sh 'chmod +x gradlew' // Gradle Wrapper에 실행 권한 부여
                    sh './gradlew build' // Gradle 빌드 명령어
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                // 체크아웃한 디렉토리에서 Docker 이미지 빌드
                dir('./') {
                    script {
                        sh 'docker build -t artionimage .' // 현재 디렉토리에서 Docker 이미지 빌드
                    }
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                // 체크아웃한 디렉토리에서 Docker 이미지 푸시
                dir('./') {
                    script {
                        sh 'docker push artionimage' // Docker 이미지 푸시
                    }
                }
            }
        }
    }
}
