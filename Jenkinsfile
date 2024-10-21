pipeline {
    agent any
    stages {
        stage('Clone repository') {
            steps {
                // GitHub에서 소스 코드 클론
                git branch: 'back/feat/AR', url: 'https://github.com/PAS.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    // Docker 이미지 빌드
                    def image = docker.build("artionimage")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    // Docker 이미지 푸쉬 (Docker Hub 또는 다른 레지스트리)
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials-id') {
                        image.push('latest')
                    }
                }
            }
        }
    }
}
