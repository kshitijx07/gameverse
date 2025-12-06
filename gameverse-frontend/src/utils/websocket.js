import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
    }

    connect(onConnect) {
        this.client = new Client({
            webSocketFactory: () => new SockJS('/ws'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('WebSocket connected');
                if (onConnect) onConnect();
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            },
        });

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.subscriptions.clear();
        }
    }

    subscribe(destination, callback) {
        if (!this.client || !this.client.connected) {
            console.error('WebSocket not connected');
            return null;
        }

        const subscription = this.client.subscribe(destination, (message) => {
            const data = JSON.parse(message.body);
            callback(data);
        });

        this.subscriptions.set(destination, subscription);
        return subscription;
    }

    unsubscribe(destination) {
        const subscription = this.subscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(destination);
        }
    }

    send(destination, body) {
        if (!this.client || !this.client.connected) {
            console.error('WebSocket not connected');
            return;
        }

        this.client.publish({
            destination,
            body: JSON.stringify(body),
        });
    }
}

export default new WebSocketService();
