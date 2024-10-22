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
        stage('Build Docker Image') {
            steps {
                script {
                    // Docker 이미지 빌드
                    def image = docker.build("artionimage")
                }
            }
        }
    }
}
