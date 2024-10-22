pipeline {
    agent any
    stages {
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
