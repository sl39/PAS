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
                dir('/back') {
                    sh 'chmod +x gradlew'
                    sh './gradlew build' // Gradle 빌드 명령어
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                dir('/back') {
                    script {
                        sh 'docker build -t artionimage .'
                    }
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                dir('/back') {
                    script {
                        sh 'docker push artionimage'
                    }
                }
            }
        }
    }
}
