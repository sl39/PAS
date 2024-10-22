pipeline {
    agent any
    stages {
        stage('Clone repository') {
            steps {
                // GitHub에서 소스 코드 클론
                git branch: 'back/feat/AR',
                    credentialsId: 'github_gom5314', url: 'https://github.com/Gom534/PAS.git'
            }
        }
        stage('Build with Gradle') {
            steps {
                script {
                    // Gradle 빌드 실행
                    sh './gradlew build'
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Docker 이미지 빌드, Dockerfile 위치를 지정
                    def image = docker.build("artionimage", "-f back/Dockerfile .")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    // Docker 이미지를 레지스트리에 푸시
                    docker.withRegistry('https://your-docker-registry', 'docker_credentials_id') {
                        image.push()
                    }
                }
            }
        }
    }
}
