import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, styled, IconButton, InputAdornment } from '@mui/material';
import { AttachFile, Send as SendIcon } from '@mui/icons-material';
import io from 'socket.io-client';

const ChatCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  width: '100%',
  maxWidth: '500px',
  '@media (max-width: 600px)': {
    width: '90%',
  },
}));

const MessageBubble = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
  borderRadius: '12px',
  display: 'inline-block',
  maxWidth: '70%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

interface Message {
  id: number;
  sender: string;
  text: string;
  file?: string;
  read: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sender] = useState('Client');
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    socketRef.current.on('connect', () => console.log('Connected to Socket.IO server for chat'));
    socketRef.current.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, { ...msg, read: false }]);
      if (msg.sender !== sender) {
        socketRef.current.emit('readMessage', msg.id);
      }
    });
    socketRef.current.on('typing', () => setIsTyping(true));
    socketRef.current.on('stopTyping', () => setIsTyping(false));
    socketRef.current.on('readReceipt', (messageId: number) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
      );
    });
    socketRef.current.on('connect_error', (error: any) => console.error('Socket.IO error:', error.message));
    socketRef.current.on('disconnect', () => console.log('Disconnected from Socket.IO server'));

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const handleTyping = () => {
    if (message.trim()) {
      socketRef.current.emit('typing');
    } else {
      socketRef.current.emit('stopTyping');
    }
  };

  const handleSend = () => {
    if ((message.trim() || file) && socketRef.current) {
      const newMessage: Message = {
        id: Date.now(),
        sender,
        text: message,
        file: file ? URL.createObjectURL(file) : undefined,
        read: false,
      };
      socketRef.current.emit('message', newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
      setFile(null);
      socketRef.current.emit('stopTyping');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ChatCard>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Chat with Caregiver
        </Typography>
        <Box sx={{ maxHeight: '300px', overflowY: 'auto', mb: 2, p: 1, background: 'rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          {messages.map((msg) => (
            <Box key={msg.id} sx={{ mb: 1, textAlign: msg.sender === 'Client' ? 'right' : 'left' }}>
              <MessageBubble sx={{ backgroundColor: msg.sender === 'Client' ? '#2a5298' : '#1e3c72' }}>
                <Typography>{msg.sender}: {msg.text}</Typography>
                {msg.file && (
                  <Box sx={{ mt: 1 }}>
                    <a href={msg.file} download target="_blank" rel="noopener noreferrer" style={{ color: '#26c6da' }}>
                      Download File
                    </a>
                  </Box>
                )}
              </MessageBubble>
              {msg.sender === 'Client' && (
                <Typography sx={{ fontSize: '0.8rem', color: '#bbbbbb' }}>
                  {msg.read ? 'Read' : 'Sent'}
                </Typography>
              )}
            </Box>
          ))}
          {isTyping && (
            <Typography sx={{ color: '#bbbbbb', fontStyle: 'italic' }}>
              Caregiver is typing...
            </Typography>
          )}
          <div ref={messagesEndRef} />
        </Box>
        <TextField
          label="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleTyping}
          fullWidth
          margin="normal"
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton component="label">
                  <AttachFile sx={{ color: '#bbbbbb' }} />
                  <input type="file" hidden onChange={handleFileChange} ref={fileInputRef} />
                </IconButton>
                <IconButton onClick={handleSend} disabled={!message.trim() && !file}>
                  <SendIcon sx={{ color: message.trim() || file ? '#ffffff' : '#bbbbbb' }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </CardContent>
    </ChatCard>
  );
};

export default Chat;