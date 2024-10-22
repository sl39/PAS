pipeline {
    agent any 

    stages {
        stage('Checkout') {
            steps {
                // GitHub에서 코드 체크아웃
                git url: 'https://github.com/Gom534/PAS/', credentialsId: 'github_gom5314'
            }
        }

        stage('Build') {
            steps {
                script {
                    // 빌드 명령어 (Maven, Gradle 등 사용에 따라 수정)
                    sh 'cd artion && ./gradlew build'
                }
            }
        }

        stage('Copy WAR File') {
            steps {
                // 빌드된 WAR 파일 복사
                script {
                    // WAR 파일의 경로를 정확하게 지정합니다.
                    def warFile = '/home/ubuntu/artion/build/libs/artion-0.0.1-SNAPSHOT.jar'
                    def targetDir = '/var/lib/jenkins/workspace/pipeline/'
                    
                    // 권한 문제를 피하기 위해 Jenkins 사용자가 접근 가능한 디렉토리로 복사
                    sh "cp ${warFile} ${targetDir}"
                }
            }
        }

        stage('Login to Docker') {
            steps {
                script {
                    // Docker Hub 로그인
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_CREDENTIALS', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Docker 이미지 빌드
                    sh 'docker build -t artion .'
                }
            }
        }

        stage('Deploy Docker Image') {
            steps {
                script {
                    // Docker 컨테이너 배포
                    sh 'docker run -d -p 8080:8080 artione'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
