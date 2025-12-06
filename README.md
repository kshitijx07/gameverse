# 🎮 GameVerse Hub - Multiplayer Gaming Platform

A production-ready full-stack gaming platform featuring **ELO-based matchmaking**, **real-time game rooms with WebSocket chat**, **leaderboards**, and a **game review & recommendation system**.

## ✨ Features

### Module 1: Multiplayer Matchmaking & Leaderboards
- **User Authentication**: JWT-based signup/login with secure password hashing
- **ELO-Based Matchmaking**: Automatic opponent matching based on skill rating
- **Match Simulation**: Automated match outcomes with ELO calculations
- **Real-time Notifications**: WebSocket integration for match found/result events
- **Leaderboards**: Global and friends-only rankings
- **Player Stats**: Comprehensive statistics with performance tracking
- **Game Rooms**: Create/join rooms with real-time WebSocket chat

### Module 2: Game Review & Recommendation Platform
- **Game Catalog**: Browse games with search and filter capabilities
- **Review System**: Write, edit, delete reviews with 1-5 star ratings
- **Like/Unlike Reviews**: Community engagement features
- **Recommendation Engine**:
  - Collaborative filtering (similarity-based)
  - Popularity-based recommendations
  - Recently reviewed games
- **Admin Panel**: Game management and review moderation

## 🛠️ Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with MySQL
- **WebSocket (STOMP)** for real-time features
- **Maven** for dependency management

### Frontend
- **React 18** with **Vite**
- **TailwindCSS 3.x** with custom gaming theme
- **Framer Motion** for animations
- **Axios** for API calls
- **STOMP.js** for WebSocket connections
- **React Router** for navigation

### Database
- **MySQL 8.x**

## 📋 Prerequisites

- **Java 17+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **MySQL 8+** ([Download](https://dev.mysql.com/downloads/))
- **Maven 3.6+** ([Download](https://maven.apache.org/download.cgi))

## 🚀 Quick Start

### 1. Clone the Repository
```bash
cd c:/Users/kshit/Desktop/super30-game
```

### 2. Backend Setup

#### Configure MySQL Database
```sql
CREATE DATABASE gameverse_db;
```

#### Set Environment Variables
Create `.env` file in `gameverse-backend/` directory:
```bash
cp gameverse-backend/.env.example gameverse-backend/.env
```

Edit `.env` with your MySQL credentials:
```
DB_URL=jdbc:mysql://localhost:3306/gameverse_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your-super-secret-jwt-key-min-256-bits
JWT_EXPIRATION=86400000
```

#### Run Backend
```bash
cd gameverse-backend
mvn clean install
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd gameverse-frontend
npm install
```

#### Set Environment Variables
Create `.env` file in `gameverse-frontend/` directory:
```bash
cp .env.example .env
```

Content:
```
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
```

#### Run Frontend
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
super30-game/
├── gameverse-backend/          # Spring Boot Backend
│   ├── src/main/java/com/gameverse/
│   │   ├── config/            # Security, WebSocket configs
│   │   ├── controller/        # REST & WebSocket controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA Entities
│   │   ├── repository/       # Database repositories
│   │   ├── security/         # JWT authentication
│   │   └── service/          # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── gameverse-frontend/         # React Frontend
    ├── src/
    │   ├── components/        # Reusable UI components
    │   │   └── ui/           # Button, Card, Input, Modal
    │   ├── context/          # React Context (Auth)
    │   ├── pages/            # Page components
    │   ├── utils/            # API client, WebSocket
    │   ├── App.jsx           # Main app with routing
    │   └── index.css         # Global styles
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Matchmaking
- `POST /api/matchmaking/enqueue?userId={id}` - Join matchmaking queue
- `POST /api/matchmaking/dequeue?userId={id}` - Leave queue
- `GET /api/matchmaking/status?userId={id}` - Get queue status

### Leaderboard
- `GET /api/leaderboard/global` - Top 100 players
- `GET /api/leaderboard/friends?userId={id}` - Friends leaderboard

### Stats
- `GET /api/stats/user/{id}` - User statistics
- `GET /api/stats/matches/{id}` - Match history
- `GET /api/stats/performance/{id}?period=weekly` - Performance stats

### Rooms
- `POST /api/rooms` - Create room
- `POST /api/rooms/{id}/join?userId={userId}` - Join room
- `POST /api/rooms/{id}/leave?userId={userId}` - Leave room
- `GET /api/rooms` - List active rooms
- `GET /api/rooms/{id}` - Get room details

### Games
- `GET /api/games` - List all games (supports ?genre, ?tag, ?sort)
- `GET /api/games/{id}` - Get game details
- `POST /api/games` - Create game (Admin only)
- `PUT /api/games/{id}` - Update game (Admin only)
- `DELETE /api/games/{id}` - Delete game (Admin only)

### Reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/{id}?userId={userId}` - Update review
- `DELETE /api/reviews/{id}?userId={userId}` - Delete review
- `GET /api/reviews/game/{gameId}` - Get game reviews
- `POST /api/reviews/{id}/like` - Like review
- `POST /api/reviews/{id}/unlike` - Unlike review

### Recommendations
- `GET /api/recommendations/similar/{gameId}` - Similar games
- `GET /api/recommendations/popular` - Popular games
- `GET /api/recommendations/recent` - Recently reviewed games

### WebSocket Endpoints
- `/ws` - WebSocket connection endpoint
- `/app/chat/{roomId}` - Send chat message
- `/topic/room/{roomId}` - Subscribe to room chat
- `/user/{username}/queue/match-found` - Match found notification
- `/user/{username}/queue/match-result` - Match result notification

## 🎨 UI Features

- **Neon Gaming Theme**: Custom TailwindCSS configuration with neon colors
- **Glassmorphism**: Modern glass-effect cards and modals
- **Smooth Animations**: Framer Motion page transitions and interactions
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Default dark theme optimized for gaming
- **Custom Fonts**: Inter for body text, Orbitron for headings

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: BCrypt encryption
- **CORS Configuration**: Controlled cross-origin requests
- **Role-Based Access**: Admin-only endpoints
- **Input Validation**: Server-side validation with annotations

## 🧪 Testing

### Backend Tests
```bash
cd gameverse-backend
mvn test
```

### Frontend Tests
```bash
cd gameverse-frontend
npm test
```

## 📦 Building for Production

### Backend
```bash
cd gameverse-backend
mvn clean package
java -jar target/gameverse-backend-1.0.0.jar
```

### Frontend
```bash
cd gameverse-frontend
npm run build
# Serve the dist/ folder with your preferred web server
```

## 🚢 Deployment

### Backend Deployment
1. Package application: `mvn clean package`
2. Set production environment variables
3. Deploy JAR to your server (AWS, Heroku, etc.)
4. Ensure MySQL is accessible

### Frontend Deployment
1. Build: `npm run build`
2. Deploy `dist/` folder to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

## 🎯 Key Algorithms

### ELO Rating System
```
Expected Score = 1 / (1 + 10^((opponent_elo - player_elo) / 400))
New ELO = Old ELO + K * (Actual Score - Expected Score)
K-Factor = 32
```

### Matchmaking Algorithm
- Matches players within ±100 ELO range initially
- Expands range by 50 ELO every 10 seconds in queue
- Prioritizes closest ELO match

### Recommendation Engine
- **Collaborative Filtering**: Finds users with similar ratings, recommends their other highly-rated games
- **Popularity Score**: `averageRating × reviewCount`
- **Recent Activity**: Games reviewed in last 30 days

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Built as a comprehensive full-stack demonstration project.

## 🆘 Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check Java version: `java -version` (should be 17+)

### Frontend won't connect to backend
- Verify backend is running on port 8080
- Check `.env` file has correct API URL
- Clear browser cache and restart dev server

### WebSocket connection fails
- Ensure CORS origins are configured correctly
- Check firewall isn't blocking WebSocket connections
- Verify backend WebSocket endpoint is accessible

## 🎮 Default Test Account

After first run, you can create a test account:
- Username: `testuser`
- Password: `password123`

## 📊 Database Schema

The application automatically creates tables on first run using JPA's `ddl-auto=update`. Key tables:
- `users` - User accounts and stats
- `match_history` - Match records
- `rooms` - Game room lobbies
- `games` - Game catalog
- `reviews` - User reviews
- `friends` - Friend relationships

---

**Enjoy gaming on GameVerse Hub! 🎮✨**
