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
                bat 'docker rm -f goof-monitor 2>nul || exit /b 0'
                bat 'docker rm -f goof-release 2>nul || exit /b 0'
                bat 'docker compose down --remove-orphans'
                bat 'docker compose up --build -d goof-mongo goof'
                bat 'docker ps'
            }
        }

        stage('Release') {
            steps {
                script {
                    def releaseTag = "release-${env.BUILD_NUMBER}"

                    bat "docker tag sit223-73hd-devops-goof:latest sit223-73hd-devops-goof:${releaseTag}"

                    bat 'docker rm -f goof-release 2>nul || exit /b 0'

                    bat """
                    docker run -d ^
                      --name goof-release ^
                      --network sit223-73hd-devops_default ^
                      -e DOCKER=1 ^
                      -p 3002:3001 ^
                      sit223-73hd-devops-goof:${releaseTag}
                    """

                    bat "docker images sit223-73hd-devops-goof"
                    bat "docker ps"
                }
            }
        }

        stage('Monitoring') {
            steps {
                script {
                    echo 'Checking released application health...'

                    bat '''
curl --fail --retry 5 --retry-delay 3 http://localhost:3002 >nul
'''

                    echo 'Release health check passed: HTTP service is responding.'

                    bat 'docker rm -f goof-monitor 2>nul || exit /b 0'

                    bat '''
docker run -d ^
--name goof-monitor ^
--network sit223-73hd-devops_default ^
-p 3003:3001 ^
-v uptime-kuma-data:/app/data ^
louislam/uptime-kuma:1
'''

                    bat 'docker stats --no-stream goof-release'
                    bat 'docker ps'
                }
            }

            post {
                failure {
                    echo 'ALERT: Production health check failed.'
                }

                success {
                    echo 'Monitoring check completed successfully.'
                }
            }
        }