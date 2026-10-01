pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                bat 'npm ci'
                bat 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'public/js/bundle.js', fingerprint: true
                }
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }

        stage('Code Quality') {
            steps {
                bat 'npm run quality'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Check the Jenkins console output.'
        }
    }
}