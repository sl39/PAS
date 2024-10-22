pipeline { 
    environment { 
        repository = "wjddntyvld/myjenkns"  //docker hub id와 repository 이름
        DOCKERHUB_CREDENTIALS = credentials('dockerhub') // jenkins에 등록해 놓은 docker hub credentials 이름
        dockerImage = '' 
  }
  agent any 
  stages { 
      stage('Building our image') { 
          steps { 
              script { 
               sh '''
		 cp /home/ubuntu/artion/build/libs/artion-0.0.1-SNAPSHOT.war /var/lib/jenkins/workspace/pipeline/
		'''
                  dockerImage = docker.build repository + ":$BUILD_NUMBER" 
              }
          } 
      }
      stage('Login'){
          steps{
              sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-wjddn123@@!' // docker hub 로그인
          }
      }
      stage('Deploy our image') { 
          steps { 
              script {
                sh 'docker push $repository:$BUILD_NUMBER' //docker push
              } 
          }
      } 
      stage('Cleaning up') { 
		  steps { 
              sh "docker rmi $repository:$BUILD_NUMBER" // docker image 제거
          }
      } 
  }
    }
