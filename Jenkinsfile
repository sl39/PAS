pipeline {
    agent any
    stages {
       
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
         stage('Build') {
            steps {
                sh 'chmod +x gradlew'
                sh './gradlew build' // Gradle 빌드 명령어
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
