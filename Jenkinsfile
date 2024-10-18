pipeline {
    agent any

    stages {
        stage('github clone') {
            steps {
                checkout(
                    [$class: 'GitSCM',
                    branches: [[name: '*/back/feat/AR']],  // 수정된 부분
                    extensions: [
                        [$class: 'SubmoduleOption',
                            disableSubmodules: false,
                            parentCredentials: true,
                            recursiveSubmodules: false,
                            reference: '',
                            trackingSubmodules: true]
                    ],
                    userRemoteConfigs: [[
                        credentialsId: 'github_gom5314',  // 확인해야 할 ID
                        url: 'https://github.com/Gom534/PAS.git'
                    ]]
                ])
            }
        }

        stage('build') {
            steps {
                dir('backend') {
                    sh '''
                        echo build start
                        ./gradlew clean bootJar
                    '''
                }
            }
        }
    }
}
