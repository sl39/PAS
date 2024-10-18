pipeline {
    agent any

    stages {
        stage('github clone') {
            steps{
                checkout(
                    [$class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions:
                    [[$class: 'SubmoduleOption',
                        disableSubmodules: false,
                        parentCredentials: true,
                        recursiveSubmodules: false,
                        reference: '',
                        trackingSubmodules: true]],
                    userRemoteConfigs:
                        [[credentialsId: 'repo-and-hook-access-token-credentials',
                            url: 'https://github.com/Gom534/PAS.git']]
                    ]
                )
            }
        }

        stage('build'){
            steps{https://github.com/Gom534/PAS.git
                dir('backend'){
                    sh'''
                        echo build start
                        ./gradlew clean bootJar
                    '''
                }
            }
        }
    }
}
