pipeline {
    agent any
    environment {
    	S3_FOLDER = "dsat-cdn/cancelacion_establecimiento"
    	CLOUDFRONT_DIST_ID = "E15KN4FT1H25SQ"
    }
    triggers {
        pollSCM('H/10 * * * *')
    }    
    stages {
        stage('Install Packages (Node.js)') {
            steps {
			    nodejs(
			        nodeJSInstallationName: 'nodejs10') {
			      sh "npm install"
			    }
            }
        }
        stage('Build (Angular)') {
            steps {
			    nodejs(
			        nodeJSInstallationName: 'nodejs10') {
			      sh "ng build --configuration=developing --base-href /cancelacion_establecimiento/ --deploy-url /cancelacion_establecimiento/"
			    }
            }
        }
        stage('Upload to S3') {
            steps {
            	sh "aws s3 sync dist/ s3://${S3_FOLDER} --delete"
            }
        }
        stage('Invalidate Cloudfront Distribution') {
            steps {
            	sh "aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DIST_ID} --paths \"/*\""
            }
        }        
    }
    post {
		always {
			emailext (
			    from: "jenkins-aws@sat.gob.gt",
      			subject: "JENKINS-AWS: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
      			body: """<p><span style="font-weight: bold">Integración en Jenkins-AWS del proyecto:</span> ${env.JOB_NAME} [${env.BUILD_NUMBER}]</p>
      				<p><span style="font-weight: bold">Revisión de SVN:</span> ${env.SVN_REVISION}</p>
      				<p><span style="font-weight: bold">Resultado:</span> ${currentBuild.currentResult}</p>""",
      			recipientProviders: [[$class: 'DevelopersRecipientProvider']],
      			attachLog: true
    		)
		}
    } 
	
}