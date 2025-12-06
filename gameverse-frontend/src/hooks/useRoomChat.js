import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * Custom hook for WebSocket chat in a room
 * Handles connection, messaging, and cleanup safely
 */
export const useRoomChat = (roomId, username) => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const clientRef = useRef(null);
    const subscriptionsRef = useRef([]);

    // Connect to WebSocket
    const connect = useCallback(() => {
        if (!roomId || !username) return;

        try {
            const client = new Client({
                webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,

                onConnect: () => {
                    console.log('✅ WebSocket connected');
                    setConnected(true);
                    setError(null);

                    try {
                        // Subscribe to room chat messages
                        const chatSub = client.subscribe(`/topic/room/${roomId}`, (message) => {
                            try {
                                const data = JSON.parse(message.body);
                                setMessages(prev => [...prev, data]);
                            } catch (err) {
                                console.error('Error parsing message:', err);
                            }
                        });
                        subscriptionsRef.current.push(chatSub);

                        // Subscribe to player notifications
                        const playerSub = client.subscribe(`/topic/room/${roomId}/players`, (message) => {
                            try {
                                const data = JSON.parse(message.body);
                                setMessages(prev => [...prev, {
                                    type: 'SYSTEM',
                                    content: data.message || 'Player activity',
                                    timestamp: new Date().toISOString()
                                }]);
                            } catch (err) {
                                console.error('Error parsing notification:', err);
                            }
                        });
                        subscriptionsRef.current.push(playerSub);

                    } catch (err) {
                        console.error('Error subscribing:', err);
                        setError('Failed to subscribe to chat');
                    }
                },

                onDisconnect: () => {
                    console.log('❌ WebSocket disconnected');
                    setConnected(false);
                },

                onStompError: (frame) => {
                    console.error('STOMP error:', frame);
                    setError('Connection error');
                    setConnected(false);
                },

                onWebSocketError: (event) => {
                    console.error('WebSocket error:', event);
                    setError('WebSocket connection failed');
                    setConnected(false);
                }
            });

            clientRef.current = client;
            client.activate();

        } catch (err) {
            console.error('Error creating WebSocket client:', err);
            setError('Failed to initialize WebSocket');
            setConnected(false);
        }
    }, [roomId, username]);

    // Send message
    const sendMessage = useCallback((content) => {
        if (!clientRef.current || !connected || !content.trim()) {
            return false;
        }

        try {
            const message = {
                sender: username,
                content: content.trim(),
                roomId: roomId,
                timestamp: new Date().toISOString()
            };

            clientRef.current.publish({
                destination: `/app/chat.send/${roomId}`,
                body: JSON.stringify(message)
            });

            return true;
        } catch (err) {
            console.error('Error sending message:', err);
            return false;
        }
    }, [connected, username, roomId]);

    // Disconnect
    const disconnect = useCallback(() => {
        try {
            subscriptionsRef.current.forEach(sub => {
                try {
                    sub.unsubscribe();
                } catch (err) {
                    console.error('Error unsubscribing:', err);
                }
            });
            subscriptionsRef.current = [];

            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        } catch (err) {
            console.error('Error disconnecting:', err);
        }
    }, []);

    // Auto-connect on mount
    useEffect(() => {
        connect();
        return () => disconnect();
    }, [connect, disconnect]);

    return {
        messages,
        connected,
        error,
        sendMessage,
        reconnect: connect
    };
};
