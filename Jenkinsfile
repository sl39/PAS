pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                // /back 디렉토리로 이동 후 체크아웃
                dir('/back') {
                    checkout scm
                }
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
