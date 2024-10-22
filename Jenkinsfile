pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                chmod +x gradlew
                sh './gradlew build' // Gradle 빌드 명령어
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t artionimage .'
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                script {
                    sh 'docker push artionimage'
                }
            }
        }
    }
}
