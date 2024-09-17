pipeline {
    agent any

    environment {
        MONGO_PASSWORD = credentials('my_secure_password') // Gunakan Jenkins Credentials untuk menyimpan password MongoDB secara aman
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Sesuaikan dengan repository Anda
                git branch: "main", url: 'https://github.com/MadeDiksaPitra/App.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build kedua image: frontend dan backend
                    dockerImageFrontend = docker.build('react-notepad-frontend', './frontend')
                    dockerImageBackend = docker.build('notepad-backend', './backend')
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                script {
                    // Jalankan container backend untuk testing
                    sh 'docker stop notepad-backend-test || true'
                    sh 'docker rm notepad-backend-test || true'
                    
                    // Jalankan container backend untuk menjalankan test
                    sh 'docker run -d --name notepad-backend-test -e MONGO_PASSWORD=$MONGO_PASSWORD -p 5000:5000 notepad-backend'
                    
                    // Jalankan test pada backend
                    sh 'docker exec notepad-backend-test npm install'
                    sh 'docker exec notepad-backend-test npm test'
                    
                    // Hentikan dan hapus container test backend
                    sh 'docker stop notepad-backend-test'
                    sh 'docker rm notepad-backend-test'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                script {
                    // Jalankan container frontend untuk testing
                    sh 'docker stop react-notepad-frontend-test || true'
                    sh 'docker rm react-notepad-frontend-test || true'
                    
                    // Jalankan container frontend untuk menjalankan test
                    sh 'docker run -d --name react-notepad-frontend-test -p 3000:3000 react-notepad-frontend'
                    
                    // Jalankan test pada frontend
                    sh 'docker exec react-notepad-frontend-test npm install'
                    sh 'docker exec react-notepad-frontend-test npm test'
                    
                    // Hentikan dan hapus container test frontend
                    sh 'docker stop react-notepad-frontend-test'
                    sh 'docker rm react-notepad-frontend-test'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    // Hentikan dan hapus container produksi sebelumnya
                    sh 'docker stop notepad-backend-deploy || true'
                    sh 'docker rm notepad-backend-deploy || true'
                    
                    sh 'docker stop react-notepad-frontend-deploy || true'
                    sh 'docker rm react-notepad-frontend-deploy || true'

                    // Deploy backend
                    sh 'docker run -d -e MONGO_PASSWORD=$MONGO_PASSWORD -p 5000:5000 --name notepad-backend-deploy notepad-backend'
                    
                    // Deploy frontend
                    sh 'docker run -d -p 3000:3000 --name react-notepad-frontend-deploy react-notepad-frontend'
                }
            }
        }
    }

    post {
        always {
            // Cleanup resources after build
            echo 'Cleaning up Docker resources...'
            sh 'docker system prune -f'
        }
    }
}
