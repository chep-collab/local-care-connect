import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// For demo purposes, we'll simulate socket connection
export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // In production, this would be your actual socket server URL
    const socketInstance = io('http://localhost:3001', {
      autoConnect: false // Don't connect automatically for demo
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    // For demo, simulate connected state after 1 second
    const timer = setTimeout(() => {
      setConnected(true);
    }, 1000);

    setSocket(socketInstance);

    return () => {
      clearTimeout(timer);
      socketInstance.close();
    };
  }, []);

  return {
    socket,
    connected,
    // Mock methods for demo
    emit: (event: string, data: any) => {
      console.log('Emitting event:', event, data);
      // Simulate successful message sending
      if (event === 'send_message') {
        setTimeout(() => {
          console.log('Message sent successfully');
        }, 500);
      }
    },
    on: (event: string, callback: (data: any) => void) => {
      console.log('Subscribing to event:', event);
    },
    off: (event: string) => {
      console.log('Unsubscribing from event:', event);
    }
  };
}
