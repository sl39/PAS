pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')  // DockerHub 자격 증명 ID
        REPO_NAME = "wjddntyvld/artion" // DockerHub 리포지토리 이름
        GITHUB_REPO_URL = 'https://github.com/Gom534/PAS.git' // GitHub 리포지토리 URL
        BRANCH_NAME = 'back/feat/AR' // 클론할 브랜치 이름
    }    

    stages {
       stage('Clone Repository') {
            steps {
                // GitHub 리포지토리 클론
                git branch: "${BRANCH_NAME}", url: "${GITHUB_REPO_URL}", credentialsId: 'github_gom5314'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Docker 이미지 빌드
                    sh "docker build -t ${REPO_NAME}:latest ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // DockerHub 로그인
                    sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                    // Docker 이미지 푸시
                    sh "docker push ${REPO_NAME}:latest"
                 }
            }
        }
    }

    post {
        always {
            echo 'Build process completed.'
        }
        success {
            echo 'Docker image was successfully built and pushed.'
        }
        failure {
            echo 'Build or push failed.'
        }
    }
}
