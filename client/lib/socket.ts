import { io } from 'socket.io-client';

let socket: any;

export const initSocket = () => {
  if (!socket) {
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? undefined 
      : 'http://localhost:3000';
    
    socket = io(socketUrl, {
      path: '/api/socket',
      addTrailingSlash: false,
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 10,
      transports: ['polling', 'websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false,
      withCredentials: true
    });

    socket.on('connect_error', (err: Error) => {
      console.log('Socket connection error:', err.message);
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully');
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};