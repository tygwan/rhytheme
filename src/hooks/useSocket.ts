import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const useSocket = (sessionId: string) => {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialize Socket connection
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
            query: { sessionId },
        });

        socketRef.current.on('connect', () => {
            console.log('Socket connected:', socketRef.current?.id);
            setIsConnected(true);
            socketRef.current?.emit('join-session', sessionId);
        });

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [sessionId]);

    return { socket: socketRef.current, isConnected };
};
