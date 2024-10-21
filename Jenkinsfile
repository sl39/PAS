pipeline {
    agent any

    stages {
        stage('github clone') {
            steps{
                checkout(
                    [$class: 'GitSCM',
                    branches: [[name: '*/back/feat/AR']],
                    extensions:
                    [[$class: 'SubmoduleOption',
                        disableSubmodules: false,
                        parentCredentials: true,
                        recursiveSubmodules: false,
                        reference: '',
                        trackingSubmodules: true]],
                    userRemoteConfigs:
                        [[credentialsId: 'github_gom5314',
                            url: 'https://github.com/woowacourse-teams/2021-jujeol-jujeol']]
                    ]
                )
            }
        }

        stage('build'){
            steps{
                dir('back'){
                    sh 'chmod +x gradlew'
                    sh'''
                        echo build start
                        ./gradlew clean bootJar
                    '''
                }
            }
        }
    }
}
