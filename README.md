# GameVerse Hub 🎮

A full-stack multiplayer gaming platform with real-time chat, game rooms, leaderboards, and stunning sci-fi UI inspired by popular games like Cyberpunk 2077, Valorant, and Apex Legends.

![GameVerse Hub](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Java](https://img.shields.io/badge/Java-21-orange)
![React](https://img.shields.io/badge/React-18-blue)

## ✨ Features

### 🎯 Core Features
- **User Authentication** - JWT-based secure login and registration
- **Game Rooms** - Create, join, and manage multiplayer game rooms
- **Real-Time Chat** - Polling-based chat system (2-second updates)
- **Leaderboard** - Global and friends rankings with ELO system
- **User Profiles** - Customizable profiles with stats and avatars
- **Matchmaking** - Find and join games quickly

### 🎨 Sci-Fi UI Effects
- **iOS 16-style Glassmorphism** - Frosted glass cards with blur effects
- **Holographic Hover** - Cyberpunk-inspired light sweep animations
- **Click Ripple** - Valorant-style button feedback
- **Floating Particles** - 50 animated neon particles
- **Matrix Data Streams** - Falling data stream effects
- **Energy Pulse Borders** - Apex Legends-style glowing borders
- **Scan Lines** - Sci-fi terminal animations
- **Corner Brackets** - Tactical UI elements
- **Neon Glow Effects** - Tron-inspired button styling

### 🔒 Security
- JWT token authentication
- Protected routes
- Creator-only room deletion
- CORS configuration
- Secure password handling

## 🛠️ Tech Stack

### Backend
- **Java 21** with Spring Boot 3.2.0
- **Spring Security** - JWT authentication
- **Spring Data JPA** - Database ORM
- **MySQL 8.x** - Relational database
- **WebSocket (STOMP)** - Real-time communication
- **Lombok** - Boilerplate reduction

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS 3.x** - Utility-first CSS
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Icons** - Icon library

## 🚀 Getting Started

### Prerequisites
- Java 21 or higher
- Node.js 18 or higher
- MySQL 8.x
- Maven

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/kshitijx07/gameverse.git
cd gameverse/gameverse-backend
```

2. **Configure database**
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gameverse
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. **Run the backend**
```bash
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd gameverse-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
Create `.env` file:
```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
```

4. **Run the frontend**
```bash
npm run dev
```
Frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
gameverse/
├── gameverse-backend/          # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/gameverse/
│   │       ├── controller/     # REST controllers
│   │       ├── service/        # Business logic
│   │       ├── repository/     # Data access
│   │       ├── entity/         # JPA entities
│   │       ├── dto/            # Data transfer objects
│   │       ├── config/         # Configuration
│   │       └── security/       # Security config
│   └── src/main/resources/
│       └── application.properties
│
├── gameverse-frontend/         # React frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ui/            # UI components
│   │   │   ├── ParticlesBackground.jsx
│   │   │   └── DataStreams.jsx
│   │   ├── pages/             # Page components
│   │   ├── context/           # React context
│   │   ├── utils/             # Utilities
│   │   └── index.css          # Global styles
│   └── package.json
│
└── README.md
```

## 🎮 Features in Detail

### Game Rooms
- Create custom rooms with player limits
- Join existing rooms
- Real-time player list updates
- Chat with room members
- Leave or delete rooms (creator only)

### Real-Time Chat
- Polling-based messaging (2-second intervals)
- Message history
- Auto-scroll to latest messages
- Sender identification
- Timestamp display

### User System
- Secure registration and login
- JWT token management
- User profiles with stats
- Avatar customization
- ELO rating system

## 🎨 UI Customization

The UI uses a comprehensive set of CSS classes for sci-fi effects:

- `.holographic-text` - Animated gradient text
- `.title-glow` - Pulsing neon glow
- `.icon-glow` - Glowing icons
- `.icon-float` - Floating animation
- `.scan-lines` - Terminal scan effect
- `.energy-border` - Pulsing borders
- `.corner-brackets` - Tactical corners
- `.hex-grid` - Hexagonal pattern
- `.pulse-ring` - Expanding rings
- `.neon-button` - Glowing buttons

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Rooms
- `GET /api/rooms` - Get all active rooms
- `GET /api/rooms/{id}` - Get room details
- `POST /api/rooms` - Create new room
- `POST /api/rooms/{id}/join` - Join room
- `POST /api/rooms/{id}/leave` - Leave room
- `DELETE /api/rooms/{id}` - Delete room (creator only)

### Chat
- `GET /api/chat/room/{id}` - Get all messages
- `GET /api/chat/room/{id}/since?timestamp=X` - Get new messages
- `POST /api/chat/room/{id}` - Send message

## 🔧 Configuration

### Database Schema
The application auto-creates tables on startup. Main entities:
- `users` - User accounts
- `rooms` - Game rooms
- `chat_messages` - Chat history (in-memory)
- `games` - Game catalog
- `match_history` - Match records

### CORS Configuration
Backend allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative port)

## 🚧 Roadmap

- [ ] WebSocket real-time chat (when backend ready)
- [ ] Stats page with match history
- [ ] Games catalog with search
- [ ] Admin panel
- [ ] Tournament system
- [ ] Voice chat integration
- [ ] Achievement badges
- [ ] Friend system

## 🐛 Known Issues

- Chat uses in-memory storage (messages lost on restart)
- WebSocket disabled due to repository detection issues
- Polling interval set to 2 seconds (configurable)

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Kshitij**
- GitHub: [@kshitijx07](https://github.com/kshitijx07)

## 🙏 Acknowledgments

- UI inspired by Cyberpunk 2077, Valorant, Apex Legends, Overwatch, and Fortnite
- Glassmorphism design inspired by iOS 16
- Icons from React Icons library

---

**Built with ❤️ using Spring Boot and React**
