import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Protected Pages - Lazy load to avoid import errors
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const MatchmakingPage = React.lazy(() => import('./pages/MatchmakingPage'));
const LeaderboardPage = React.lazy(() => import('./pages/LeaderboardPage'));
const StatsPage = React.lazy(() => import('./pages/StatsPage'));
const GameListPage = React.lazy(() => import('./pages/GameListPage'));
const GameDetailPage = React.lazy(() => import('./pages/GameDetailPage'));
const RoomListPage = React.lazy(() => import('./pages/RoomListPage'));
const RoomDetailPage = React.lazy(() => import('./pages/RoomDetailPage'));
const SnakeGame = React.lazy(() => import('./pages/SnakeGame'));

function App() {
    return (
        <AuthProvider>
            <Router>
                <React.Suspense fallback={
                    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                        <div className="spinner"></div>
                    </div>
                }>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />

                        {/* Protected Routes */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                        <Route path="/matchmaking" element={<ProtectedRoute><MatchmakingPage /></ProtectedRoute>} />
                        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
                        <Route path="/stats" element={<ProtectedRoute><StatsPage /></ProtectedRoute>} />
                        <Route path="/games" element={<ProtectedRoute><GameListPage /></ProtectedRoute>} />
                        <Route path="/games/:id" element={<ProtectedRoute><GameDetailPage /></ProtectedRoute>} />
                        <Route path="/rooms" element={<ProtectedRoute><RoomListPage /></ProtectedRoute>} />
                        <Route path="/rooms/:id" element={<ProtectedRoute><RoomDetailPage /></ProtectedRoute>} />
                        <Route path="/play/snake" element={<ProtectedRoute><SnakeGame /></ProtectedRoute>} />
                    </Routes>
                </React.Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;
