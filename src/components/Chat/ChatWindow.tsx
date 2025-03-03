import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import {
  Send,
  AttachFile,
  Image,
  MoreVert,
  Error as ErrorIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useSocket } from '@/hooks/useSocket';
import { Message, ChatParticipant } from '@/types';

// Temp fix: need to handle image uploads properly
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const TYPING_DEBOUNCE = 1000;

interface Props {
  chatId: string;
  otherParticipant: ChatParticipant;
  initialMessages?: Message[];
}

export const ChatWindow: React.FC<Props> = ({
  chatId,
  otherParticipant,
  initialMessages = []
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [failedMessages, setFailedMessages] = useState<string[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { socket, connected } = useSocket();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle incoming messages
  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('message_failed', handleMessageFailed);

    return () => {
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('message_failed');
    };
  }, [socket]);

  const scrollToBottom = () => {
    // Added timeout to handle slow rendering
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNewMessage = (data: { message: Message }) => {
    setMessages(prev => [...prev, data.message]);
    setIsTyping(false);
  };

  const handleUserTyping = () => {
    setIsTyping(true);
    // Clear typing indicator after 3 seconds
    setTimeout(() => setIsTyping(false), 3000);
  };

  const handleMessageFailed = (messageId: string) => {
    setFailedMessages(prev => [...prev, messageId]);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !socket) return;

    const messageId = Date.now().toString();
    const message = {
      id: messageId,
      content: newMessage,
      timestamp: new Date(),
      sender: 'me',
      type: 'text'
    };

    try {
      // Optimistically add message
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Send to server
      socket.emit('send_message', {
        chatId,
        content: newMessage,
        type: 'text',
        messageId
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setFailedMessages(prev => [...prev, messageId]);
    }
  };

  const handleTyping = () => {
    if (!socket) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit('typing_start', { chatId });

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { chatId });
    }, TYPING_DEBOUNCE);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !socket) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert('Image size should be less than 5MB');
      return;
    }

    try {
      setImageUploading(true);

      // TODO: Implement proper image upload service
      const imageUrl = await uploadImage(file);

      socket.emit('send_message', {
        chatId,
        content: imageUrl,
        type: 'image'
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Temporary upload function
  const uploadImage = async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return URL.createObjectURL(file);
  };

  const renderMessage = (message: Message) => {
    const isMe = message.sender === 'me';
    const failed = failedMessages.includes(message.id);

    return (
      <Box
        key={message.id}
        sx={{
          display: 'flex',
          justifyContent: isMe ? 'flex-end' : 'flex-start',
          mb: 1,
          position: 'relative'
        }}
      >
        {!isMe && (
          <Avatar
            src={otherParticipant.profileImage}
            sx={{ width: 32, height: 32, mr: 1 }}
          />
        )}
        
        <Box
          sx={{
            maxWidth: '70%',
            position: 'relative'
          }}
        >
          <Paper
            sx={{
              p: 1,
              bgcolor: isMe ? 'primary.main' : 'grey.100',
              color: isMe ? 'white' : 'text.primary',
              borderRadius: 2,
              wordBreak: 'break-word'
            }}
          >
            {message.type === 'image' ? (
              // Basic image preview - needs proper modal
              <Box
                component="img"
                src={message.content}
                alt="Shared image"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: 1
                }}
              />
            ) : (
              message.content
            )}
            
            <Typography
              variant="caption"
              display="block"
              sx={{
                textAlign: 'right',
                mt: 0.5,
                opacity: 0.8
              }}
            >
              {format(new Date(message.timestamp), 'HH:mm')}
            </Typography>
          </Paper>

          {failed && (
            <Tooltip title="Failed to send. Click to retry.">
              <IconButton
                size="small"
                color="error"
                sx={{
                  position: 'absolute',
                  right: isMe ? -30 : 'auto',
                  left: isMe ? 'auto' : -30,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
                onClick={() => {
                  // TODO: Implement retry logic
                  console.log('Retrying message:', message.id);
                }}
              >
                <ErrorIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Paper 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          color={connected ? 'success' : 'error'}
        >
          <Avatar src={otherParticipant.profileImage} />
        </Badge>
        <Box>
          <Typography variant="subtitle1">
            {otherParticipant.name}
          </Typography>
          {isTyping && (
            <Typography variant="caption" color="text.secondary">
              typing...
            </Typography>
          )}
        </Box>
        <IconButton sx={{ ml: 'auto' }}>
          <MoreVert />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: 'grey.50',
          // Hide scrollbar on webkit browsers
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}
      >
        <Box
          component="form"
          sx={{
            display: 'flex',
            gap: 1
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          
          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={imageUploading}
          >
            {imageUploading ? (
              <CircularProgress size={24} />
            ) : (
              <Image />
            )}
          </IconButton>

          <IconButton>
            <AttachFile />
          </IconButton>

          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            // Quick fix for mobile keyboard issues
            onFocus={() => scrollToBottom()}
            disabled={!connected}
          />

          <IconButton 
            color="primary"
            onClick={handleSend}
            disabled={!newMessage.trim() || !connected}
          >
            <Send />
          </IconButton>
        </Box>

        {!connected && (
          <Typography 
            variant="caption" 
            color="error"
            sx={{ display: 'block', mt: 1 }}
          >
            Connecting... Messages will be sent when connection is restored.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
