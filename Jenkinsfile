pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')  // DockerHub 자격 증명 ID
        REPO_NAME = "wjddntyvld/artion" // DockerHub 리포지토리 이름        
    }    

    stages {
       stage('clone repository') {
            steps {
                // GitHub 리포지토리 클론
                 git branch: 'back/feat/AR',
                    credentialsId: 'github_gom5314', url: 'https://github.com/Gom534/PAS.git'
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
