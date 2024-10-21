pipeline {
    agent any

    stages {
        stage('github clone') {
            steps {
                checkout(
                    branches: name: '*/back/feat/AR',  // 수정된 부분                  
                        credentialsId: 'github_gom5314',  // 확인해야 할 ID
                        url: 'https://github.com/Gom534/PAS.git'
                )}
            }
        }

        stage('build') {
            steps {
                dir('back') {
                    sh 'chmod +x gradlew' // 여기서 실행 권한 부여
                    sh '''
                        echo build start
                        ./gradlew clean bootJar
                    '''
                }
            }
        }
    }
}
