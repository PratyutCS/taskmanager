import { io } from 'socket.io-client';

// In production, this should be an environment variable
const SOCKET_URL = 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: true,
});
