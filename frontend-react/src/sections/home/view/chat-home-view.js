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
    ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark'
      ? `radial-gradient(circle at 20% 80%, ${alpha('#00d4ff', 0.1)} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha('#090979', 0.1)} 0%, transparent 50%)`
      : `radial-gradient(circle at 20% 80%, ${alpha('#667eea', 0.2)} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha('#764ba2', 0.2)} 0%, transparent 50%)`,
    pointerEvents: 'none',
  },
}));

const StyledChatContainer = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 1200,
  margin: '0 auto',
  width: '100%',
  padding: theme.spacing(2),
  position: 'relative',
  zIndex: 1,
}));

const StyledMessagesContainer = styled('div')(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2, 0),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: alpha(theme.palette.common.white, 0.2),
    borderRadius: '3px',
  },
}));

const StyledMessage = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(2, 3),
  borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
  backgroundColor: isUser
    ? (theme.palette.mode === 'dark' ? '#007AFF' : '#007AFF')
    : (theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.8) : alpha(theme.palette.background.paper, 0.9)),
  color: isUser ? '#FFFFFF' : theme.palette.text.primary,
  maxWidth: '70%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  border: isUser ? 'none' : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 4px 12px rgba(0, 0, 0, 0.3)'
    : '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const StyledInputContainer = styled('div')(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  background: theme.palette.mode === 'dark'
    ? 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(2),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backdropFilter: 'blur(20px)',
}));

const StyledChatInput = styled('div')(({ theme }) => ({
  maxWidth: 800,
  margin: '0 auto',
  position: 'relative',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.8 : 0.9),
    borderRadius: 25,
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      borderColor: alpha(theme.palette.primary.main, 0.5),
    },
    '&.Mui-focused': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: theme.spacing(1.5, 5, 1.5, 2),
    fontSize: '16px',
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
  },
}));

const StyledSendButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',
  width: 40,
  height: 40,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

const StyledWelcomeMessage = styled('div')(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 2),
}));

const StyledSuggestions = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(2),
  maxWidth: 900,
  margin: '0 auto',
  marginTop: theme.spacing(3),
}));

const StyledSuggestionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 16,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backgroundColor: alpha(theme.palette.background.paper, theme.palette.mode === 'dark' ? 0.6 : 0.8),
  backdropFilter: 'blur(15px)',
  cursor: 'pointer',
  transition: theme.transitions.create(['transform', 'box-shadow', 'border-color'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
    borderColor: alpha(theme.palette.primary.main, 0.3),
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 25px rgba(0, 0, 0, 0.3)'
      : '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
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
                  variant="h2"
                  sx={{
                    background: theme.palette.mode === 'dark'
                      ? `linear-gradient(135deg, #00d4ff, #090979)`
                      : `linear-gradient(135deg, #667eea, #764ba2)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 700,
                    mb: 2,
                    textAlign: 'center',
                  }}
                >
                  CrawlDataAI
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 4,
                    fontWeight: 400,
                    maxWidth: 600,
                    mx: 'auto',
                    textAlign: 'center',
                  }}
                >
                  Your AI-powered data crawling and analysis assistant.
                  Extract insights, generate reports, and chat with your data.
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
                      elevation={0}
                      onClick={() => handleSuggestionClick(prompt.description)}
                    >
                      <Stack direction="row" alignItems="flex-start" spacing={2}>
                        <Avatar
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            width: 40,
                            height: 40,
                          }}
                        >
                          <Iconify icon={prompt.icon} width={20} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                            {prompt.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            {prompt.description}
                          </Typography>
                        </Box>
                      </Stack>
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
                    <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
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
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        AI is thinking
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Box
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            bgcolor: theme.palette.text.secondary,
                            animation: 'bounce 1.4s ease-in-out infinite both',
                            '@keyframes bounce': {
                              '0%, 80%, 100%': { transform: 'scale(0)' },
                              '40%': { transform: 'scale(1)' },
                            },
                          }}
                        />
                        <Box
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            bgcolor: theme.palette.text.secondary,
                            animation: 'bounce 1.4s ease-in-out 0.16s infinite both',
                          }}
                        />
                        <Box
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            bgcolor: theme.palette.text.secondary,
                            animation: 'bounce 1.4s ease-in-out 0.32s infinite both',
                          }}
                        />
                      </Box>
                    </Stack>
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
                multiline
                maxRows={4}
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
        <Fab
          color="primary"
          size="medium"
          onClick={() => settings.onUpdate('themeMode', settings.themeMode === 'light' ? 'dark' : 'light')}
          sx={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 1000,
            backgroundColor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.common.white, 0.9),
            color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000',
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.95)
                : alpha(theme.palette.common.white, 0.95),
            },
          }}
        >
          <Iconify
            icon={settings.themeMode === 'light' ? 'solar:moon-bold-duotone' : 'solar:sun-bold-duotone'}
            width={24}
          />
        </Fab>
      </StyledRoot>
    </MainLayout>
  );
}