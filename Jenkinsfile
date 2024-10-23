pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub') // Jenkins에 저장된 자격 증명 ID
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Gom534/PAS.git', credentialsId: 'github_gom5314', branch: 'back/feat/AR'
                sh 'ls -la'
                sh 'pwd'
                sh 'cd back'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {                 
                    sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"

                    // Docker 이미지 빌드
                    sh 'docker build -t wjddntyvld/artion:latest -f back/Dockerfile .'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Docker 이미지 푸시
                    sh 'docker push wjddntyvld/artion:latest'
                }
            }
        }
    }
}
