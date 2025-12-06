# Quick Setup Guide

## ⚠️ Prerequisites Required

### Maven Installation Required
Maven is not currently installed on your system. You have two options:

#### Option 1: Install Maven (Recommended)
1. Download Maven from: https://maven.apache.org/download.cgi
2. Extract to a folder (e.g., `C:\Program Files\Apache\maven`)
3. Add to PATH:
   - Search "Environment Variables" in Windows
   - Edit "Path" variable
   - Add: `C:\Program Files\Apache\maven\bin`
4. Verify: Open new terminal and run `mvn -version`

#### Option 2: Use IDE (IntelliJ IDEA or Eclipse)
1. Open `gameverse-backend` folder in IntelliJ IDEA or Eclipse
2. IDE will auto-detect Maven project
3. Right-click on project → Run As → Spring Boot App

### MySQL Setup
1. Ensure MySQL is running
2. Create database:
   ```sql
   CREATE DATABASE gameverse_db;
   ```
3. Update credentials in `gameverse-backend/.env` (copy from `.env.example`)

## 🚀 Starting the Application

### Backend (After Maven is installed)
```bash
cd gameverse-backend
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend will run on: http://localhost:8080

### Frontend (Ready to start now!)
```bash
cd gameverse-frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## 📝 Notes
- Frontend is ready to start (dependencies installed)
- Backend requires Maven installation first
- Both servers must be running for full functionality
