import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { IoSend, IoExit, IoPeople, IoGameController, IoTrash } from 'react-icons/io5';

const RoomDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetch, setLastFetch] = useState(new Date().toISOString());
    const messagesEndRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    // Fetch room details
    useEffect(() => {
        if (!user || !user.id || !id) {
            setLoading(false);
            return;
        }

        const fetchRoom = async () => {
            try {
                const response = await api.get(`/rooms/${id}`);
                setRoom(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching room:', err);
                setError('Room not found');
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id, user]);

    // Polling for new messages
    useEffect(() => {
        if (!id) return;

        // Initial fetch of all messages
        const fetchInitialMessages = async () => {
            try {
                const response = await api.get(`/chat/room/${id}`);
                setMessages(response.data);
                if (response.data.length > 0) {
                    const lastMsg = response.data[response.data.length - 1];
                    setLastFetch(lastMsg.timestamp);
                }
            } catch (err) {
                console.error('Error fetching messages:', err);
            }
        };

        fetchInitialMessages();

        // Poll for new messages every 2 seconds
        pollingIntervalRef.current = setInterval(async () => {
            try {
                const response = await api.get(`/chat/room/${id}/since`, {
                    params: { timestamp: lastFetch }
                });

                if (response.data.length > 0) {
                    setMessages(prev => [...prev, ...response.data]);
                    const lastMsg = response.data[response.data.length - 1];
                    setLastFetch(lastMsg.timestamp);
                }
            } catch (err) {
                console.error('Error polling messages:', err);
            }
        }, 2000); // Poll every 2 seconds

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [id, lastFetch]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await api.post(`/chat/room/${id}`, {
                sender: user.username,
                content: newMessage.trim()
            });

            setNewMessage('');
            // Message will appear via polling
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Failed to send message');
        }
    };

    const handleLeaveRoom = async () => {
        try {
            if (user && user.id && id) {
                await api.post(`/rooms/${id}/leave?userId=${user.id}`);
            }
        } catch (err) {
            console.error('Error leaving room:', err);
        } finally {
            navigate('/rooms');
        }
    };

    const handleDeleteRoom = async () => {
        if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/rooms/${id}?userId=${user.id}`);
            navigate('/rooms');
        } catch (err) {
            console.error('Error deleting room:', err);
            alert('Failed to delete room. Only the room creator can delete the room.');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <Card className="text-center p-8">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Room Not Found</h2>
                    <p className="text-gray-400 mb-6">{error || 'This room does not exist'}</p>
                    <Button onClick={() => navigate('/rooms')}>Back to Rooms</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-900 px-4 py-12">
            <div className="fixed inset-0 animated-gradient opacity-10"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                                <IoGameController size={32} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold gradient-text">{room.roomName}</h1>
                                <p className="text-gray-400">
                                    {room.players?.length || 0} / {room.maxPlayers} players
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {room.createdBy?.id === user?.id && (
                                <Button variant="danger" onClick={handleDeleteRoom}>
                                    <IoTrash className="mr-2" /> Delete Room
                                </Button>
                            )}
                            <Button variant="danger" onClick={handleLeaveRoom}>
                                <IoExit className="mr-2" /> Leave Room
                            </Button>
                        </div>
                    </div>

                    {/* Real-time indicator */}
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse"></div>
                        <span className="text-sm text-gray-400">
                            working !!
                        </span>
                    </div>

                    {/* Real-time indicator */}
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse"></div>
                        <span className="text-sm text-gray-400">
                            ✅ active
                        </span>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Players List */}
                    <div className="lg:col-span-1">
                        <Card glow>
                            <div className="flex items-center gap-2 mb-4">
                                <IoPeople size={24} className="text-neon-cyan" />
                                <h2 className="text-2xl font-bold">Players</h2>
                            </div>
                            <div className="space-y-3">
                                {room.players && room.players.length > 0 ? (
                                    room.players.map((player, index) => (
                                        <motion.div
                                            key={player.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg"
                                        >
                                            <img
                                                src={player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}`}
                                                alt={player.username}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <p className="font-semibold">{player.username}</p>
                                                <p className="text-sm text-gray-400">ELO: {player.elo}</p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-4">No players yet</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Chat */}
                    <div className="lg:col-span-2">
                        <Card glow className="h-[600px] flex flex-col">
                            <h2 className="text-2xl font-bold mb-4">Chat</h2>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
                                {messages.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400 mb-2">No messages yet. Start the conversation!</p>
                                        <p className="text-sm text-neon-green">start</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${msg.sender === user.username ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] ${msg.sender === user.username ? 'bg-neon-blue/20' : 'bg-dark-800'} rounded-lg p-3`}>
                                                <p className="text-sm text-neon-cyan font-semibold mb-1">{msg.sender}</p>
                                                <p className="text-white">{msg.content}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan transition-colors"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                >
                                    <IoSend size={20} />
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailPage;
