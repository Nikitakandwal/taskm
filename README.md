# Task Manager App

## Demo: 


https://github.com/user-attachments/assets/7df18cab-fdd3-41ef-b5a2-88eef73e81b5



A full-stack task management application with React Native (Expo) frontend and Node.js/MongoDB backend.

## ✨ Features

### Frontend
- User authentication (signup/login)
- JWT token storage with AsyncStorage
- CRUD operations for tasks
- Pull-to-refresh functionality
- Smooth UI animations
- Responsive design

### Backend
- REST API with Express.js
- MongoDB database
- Password hashing with bcrypt
- JWT authentication
- Password reset via Mailjet

## 🛠 Tech Stack

**Frontend**:
- React Native (Expo)
- React Navigation
- React Native Paper
- AsyncStorage
- Axios

**Backend**:
- Node.js + Express
- MongoDB + Mongoose
- JWT + Bcrypt
- Mailjet API

 ## 🚀 Installation
 
 ### Prerequisites
 - Node.js (v14+)
 - npm/yarn
 - Expo CLI
 - MongoDB Atlas account
 
 ### Setup
 
 1. **Clone the repository**:
    ```bash
    git clone https:github.com/yourusername/task-manager.git
    cd task-manager
    ```
 
 2. **Backend setup**:
    ```bash
    cd backend
    npm install
    ```
 
    Create `.env` file in backend directory with:
    ```env
    MONGO_URI="your_mongodb_uri"
    JWT_SECRET="your_jwt_secret"
    MAILJET_API_KEY="your_api_key"
    MAILJET_SECRET_KEY="your_secret_key"
    ```
 
    Start server:
    ```bash
    npm start
    ```
 
 3. **Frontend setup**:
    ```bash
    cd ../frontend
    npm install
    expo start
    ```
  
 ## ⚙ Configuration

### Backend Environment Variables

| Variable            | Description                               |
|---------------------|-------------------------------------------|
| `MONGO_URI`        | MongoDB connection URI                    |
| `JWT_SECRET`       | Secret key for JWT token generation       |
| `MAILJET_API_KEY`  | Mailjet API key for password reset        |
| `MAILJET_SECRET_KEY` | Mailjet secret key for password reset     |
