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

        stage('Security') {
            steps {
                script {
                    def auditStatus = bat(
                        script: 'npm audit --omit=dev --json > npm-audit.json',
                        returnStatus: true
                    )

                    echo "npm audit completed with exit code ${auditStatus}."
                    echo "Security findings are recorded in npm-audit.json for review."
                }
            }

            post {
                always {
                    archiveArtifacts artifacts: 'npm-audit.json', fingerprint: true
                }
            }
        }

        stage('Deploy') {
            steps {
                bat 'docker compose down --remove-orphans'
                bat 'docker compose up --build -d goof-mongo goof'
                bat 'docker ps'
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