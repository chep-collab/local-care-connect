import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material';
import io from 'socket.io-client';

const ChatContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.background.paper,
  borderRadius: '10px',
  marginTop: theme.spacing(2),
  [theme.breakpoints.down('sm')]: { padding: theme.spacing(1) },
}));

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState(() => io('http://localhost:3000')); // Initialize once

  useEffect(() => {
    socket.on('message', (msg) => setMessages((prev) => [...prev, msg]));

    // Cleanup on unmount
    return () => {
      socket.off('message');
      socket.disconnect();
    };
  }, [socket]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.querySelector('input') as HTMLInputElement;
    if (input.value) socket.emit('message', input.value);
    input.value = '';
  };

  return (
    <ChatContainer>
      <h3>Chat</h3>
      <div>{messages.map((msg, i) => (
        <p key={i}>{msg}</p>
      ))}</div>
      <form onSubmit={sendMessage}>
        <input placeholder="Type a message" aria-label="Type a message" />
        <button type="submit">Send</button>
      </form>
    </ChatContainer>
  );
};

export default Chat;
