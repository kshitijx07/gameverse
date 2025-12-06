import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { IoGameController, IoPeople, IoAdd } from 'react-icons/io5';

const RoomListPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [maxPlayers, setMaxPlayers] = useState(4);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.id) {
            fetchRooms();
            // Refresh room list every 5 seconds
            const interval = setInterval(fetchRooms, 5000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchRooms = async () => {
        try {
            const response = await api.get('/rooms');
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async () => {
        if (!roomName.trim()) {
            setError('Room name is required');
            return;
        }

        setCreating(true);
        setError('');

        try {
            const response = await api.post('/rooms', {
                roomName: roomName.trim(),
                maxPlayers,
                creatorId: user.id
            });

            setShowCreateModal(false);
            setRoomName('');
            setMaxPlayers(4);

            // Navigate to the newly created room
            navigate(`/rooms/${response.data.id}`);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create room');
        } finally {
            setCreating(false);
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            await api.post(`/rooms/${roomId}/join?userId=${user.id}`);
            navigate(`/rooms/${roomId}`);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to join room');
        }
    };

    const getRoomStatusColor = (status) => {
        switch (status) {
            case 'WAITING': return 'text-neon-green';
            case 'IN_PROGRESS': return 'text-neon-cyan';
            case 'FULL': return 'text-neon-pink';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 px-4 py-12">
            <div className="fixed inset-0 animated-gradient opacity-10"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-6xl font-bold gradient-text mb-4">Game Rooms</h1>
                    <p className="text-xl text-gray-400">Join a room and chat with other players</p>
                </motion.div>

                <div className="flex justify-between items-center mb-8">
                    <p className="text-gray-400">
                        {rooms.length} active {rooms.length === 1 ? 'room' : 'rooms'}
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <IoAdd className="mr-2" /> Create Room
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="spinner"></div>
                    </div>
                ) : rooms.length === 0 ? (
                    <Card className="text-center py-20">
                        <IoGameController size={80} className="mx-auto mb-6 text-gray-600" />
                        <h3 className="text-2xl font-bold mb-4">No Active Rooms</h3>
                        <p className="text-gray-400 mb-6">Be the first to create a game room!</p>
                        <Button onClick={() => setShowCreateModal(true)}>
                            <IoAdd className="mr-2" /> Create Room
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room, index) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card glow className="h-full flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                                                <IoGameController size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{room.roomName}</h3>
                                                <p className={`text-sm ${getRoomStatusColor(room.status)}`}>
                                                    {room.status}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                                        <IoPeople size={20} />
                                        <span>
                                            {room.currentPlayers || 0} / {room.maxPlayers} players
                                        </span>
                                    </div>

                                    <div className="mt-auto">
                                        <Button
                                            onClick={() => handleJoinRoom(room.id)}
                                            disabled={room.status === 'FULL'}
                                            className="w-full"
                                        >
                                            {room.status === 'FULL' ? 'Room Full' : 'Join Room'}
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Create Room Modal */}
                <Modal
                    isOpen={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false);
                        setRoomName('');
                        setMaxPlayers(4);
                        setError('');
                    }}
                    title="Create Game Room"
                >
                    <div className="space-y-6">
                        <Input
                            label="Room Name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            placeholder="Enter room name"
                            error={error}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Max Players
                            </label>
                            <select
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                                className="w-full bg-dark-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            >
                                <option value={2}>2 Players</option>
                                <option value={4}>4 Players</option>
                                <option value={6}>6 Players</option>
                                <option value={8}>8 Players</option>
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <Button
                                variant="secondary"
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateRoom}
                                loading={creating}
                                className="flex-1"
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default RoomListPage;
