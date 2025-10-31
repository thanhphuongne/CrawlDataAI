'use client';

import { m } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import Avatar from '@mui/material/Avatar';
import { alpha, styled, useTheme } from '@mui/material/styles';

import { bgGradient, textGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import MainLayout from 'src/layouts/main';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  background: theme.palette.mode === 'dark'
    ? '#000000'
    : '#FFFFFF',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}));

const StyledChatContainer = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 700,
  margin: '0 auto',
  width: '100%',
  padding: theme.spacing(0, 2),
  position: 'relative',
  zIndex: 1,
}));

const StyledMessagesContainer = styled('div')(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2, 0),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.text.secondary, 0.2),
    borderRadius: '2px',
  },
}));

const StyledMessage = styled('div')(({ theme, isUser }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: 2,
  backgroundColor: isUser
    ? (theme.palette.mode === 'dark' ? '#2D3748' : '#F7FAFC')
    : 'transparent',
  color: theme.palette.text.primary,
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  border: isUser ? 'none' : 'none',
  marginLeft: isUser ? 'auto' : 0,
  marginRight: isUser ? 0 : 'auto',
  position: 'relative',
}));

const StyledInputContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2, 0),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StyledChatInput = styled('div')(({ theme }) => ({
  maxWidth: 700,
  margin: '0 auto',
  position: 'relative',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#F7FAFC',
    borderRadius: 2,
    border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#E2E8F0'}`,
    transition: theme.transitions.create(['border-color']),
    '&:hover': {
      borderColor: theme.palette.mode === 'dark' ? '#4B5563' : '#CBD5E0',
    },
    '&.Mui-focused': {
      borderColor: '#10A37F',
      boxShadow: 'none',
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1.5, 4, 1.5, 2),
    fontSize: '16px',
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.8,
    },
  },
}));

const StyledSendButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: '50%',
  transform: 'translateY(-50%)',
  color: theme.palette.text.secondary,
  width: 32,
  height: 32,
  '&:hover': {
    color: '#10A37F',
    backgroundColor: 'transparent',
  },
  '&:disabled': {
    color: theme.palette.action.disabled,
  },
}));

const StyledWelcomeMessage = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(6, 2),
  maxWidth: 700,
  margin: '0 auto',
}));

const StyledSuggestions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  maxWidth: 700,
  margin: '0 auto',
  marginTop: theme.spacing(4),
}));

const StyledSuggestionCard = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.mode === 'dark' ? '#374151' : '#E2E8F0'}`,
  backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
  cursor: 'pointer',
  transition: theme.transitions.create(['background-color', 'border-color'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2D3748' : '#F7FAFC',
    borderColor: theme.palette.mode === 'dark' ? '#4B5563' : '#CBD5E0',
  },
  textAlign: 'left',
}));

const examplePrompts = [
  {
    title: 'Analyze Website Content',
    description: 'Extract and analyze data from any website URL',
    icon: 'mdi:web',
  },
  {
    title: 'Generate Reports',
    description: 'Create comprehensive reports from crawled data',
    icon: 'mdi:file-chart',
  },
  {
    title: 'Data Insights',
    description: 'Get AI-powered insights from your datasets',
    icon: 'mdi:lightbulb-on',
  },
  {
    title: 'Custom Queries',
    description: 'Ask specific questions about your data',
    icon: 'mdi:chat-question',
  },
];

export default function ChatHomeView() {
  const theme = useTheme();
  const settings = useSettingsContext();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        content: `I understand you want to: "${userMessage.content}". I'm processing your request for data crawling and analysis. This might take a moment...`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
  };

  return (
    <MainLayout>
      <StyledRoot>
        <StyledChatContainer>
          {messages.length === 0 ? (
            <StyledWelcomeMessage>
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 600,
                    mb: 2,
                    textAlign: 'center',
                  }}
                >
                  CrawlDataAI
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 4,
                    fontSize: '1.1rem',
                    maxWidth: 600,
                    mx: 'auto',
                    textAlign: 'center',
                    lineHeight: 1.6,
                  }}
                >
                  You are CrawlDataAI, an AI-powered data crawling and analysis assistant built by xAI.
                  You can extract insights, generate reports, and chat with your data.
                </Typography>
              </m.div>

              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <StyledSuggestions>
                  {examplePrompts.map((prompt, index) => (
                    <StyledSuggestionCard
                      key={index}
                      onClick={() => handleSuggestionClick(prompt.description)}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {prompt.description}
                      </Typography>
                    </StyledSuggestionCard>
                  ))}
                </StyledSuggestions>
              </m.div>
            </StyledWelcomeMessage>
          ) : (
            <StyledMessagesContainer>
              {messages.map((msg) => (
                <m.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StyledMessage isUser={msg.isUser}>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.6,
                        fontSize: '15px',
                        fontWeight: msg.isUser ? 400 : 500,
                      }}
                    >
                      {msg.content}
                    </Typography>
                  </StyledMessage>
                </m.div>
              ))}
              {isTyping && (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <StyledMessage isUser={false}>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: '15px' }}>
                      CrawlDataAI is thinking...
                    </Typography>
                  </StyledMessage>
                </m.div>
              )}
              <div ref={messagesEndRef} />
            </StyledMessagesContainer>
          )}

          <StyledInputContainer>
            <StyledChatInput>
              <StyledTextField
                fullWidth
                placeholder="Message CrawlDataAI..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                variant="outlined"
                disabled={isTyping}
              />
              <StyledSendButton
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
              >
                <Iconify icon="mdi:send" width={20} />
              </StyledSendButton>
            </StyledChatInput>
          </StyledInputContainer>
        </StyledChatContainer>

        {/* Theme Toggle Button */}
        <IconButton
          onClick={() => settings.onUpdate('themeMode', settings.themeMode === 'light' ? 'dark' : 'light')}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1000,
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.text.primary,
              backgroundColor: 'transparent',
            },
          }}
        >
          <Iconify
            icon={settings.themeMode === 'light' ? 'solar:moon-bold' : 'solar:sun-bold'}
            width={24}
          />
        </IconButton>
      </StyledRoot>
    </MainLayout>
  );
}