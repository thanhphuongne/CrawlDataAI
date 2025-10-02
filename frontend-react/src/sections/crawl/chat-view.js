'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import Markdown from 'src/components/markdown';

import { sendCrawlDialog, getCrawlDialogsByUser } from 'src/api/crawl-api';

// ----------------------------------------------------------------------

export default function CrawlChatView() {
  const { enqueueSnackbar } = useSnackbar();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const { register, handleSubmit, reset, formState: { isSubmitting }, watch } = useForm({
    defaultValues: { content: '' },
  });

  const userId = 1; // Assuming user ID is 1, or get from auth
  const content = watch('content');

  useEffect(() => {
    fetchDialogs();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDialogs = async () => {
    try {
      const response = await getCrawlDialogsByUser(userId);
      setMessages(response.data || []);
    } catch (error) {
      enqueueSnackbar('Failed to load dialogs', { variant: 'error' });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!data.content.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: data.content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    reset();

    try {
      const newMessage = {
        request_id: 1, // Assuming request ID
        content: data.content,
      };

      await sendCrawlDialog(newMessage);

      // Simulate AI response delay
      setTimeout(async () => {
        await fetchDialogs();
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      enqueueSnackbar('Failed to send message', { variant: 'error' });
      setIsTyping(false);
    }
  });

  const renderMessage = (message, index) => (
    <Box
      key={message.id || index}
      sx={{
        display: 'flex',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
        mb: 3,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          maxWidth: '80%',
          gap: 1.5,
        }}
      >
        {message.sender !== 'user' && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              flexShrink: 0,
            }}
          >
            <Iconify icon="mdi:robot" sx={{ fontSize: 18 }} />
          </Avatar>
        )}

        <Paper
          sx={{
            p: 2,
            borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            bgcolor: message.sender === 'user'
              ? 'primary.main'
              : (theme) => alpha(theme.palette.grey[800], 0.8),
            color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
            border: message.sender === 'user' ? 'none' : `1px solid ${alpha('#fff', 0.1)}`,
            boxShadow: message.sender === 'user'
              ? '0 2px 8px rgba(0, 167, 111, 0.3)'
              : '0 2px 8px rgba(0, 0, 0, 0.2)',
            maxWidth: '100%',
            wordWrap: 'break-word',
            '& pre': {
              bgcolor: message.sender === 'user'
                ? alpha('#fff', 0.1)
                : (theme) => alpha(theme.palette.grey[900], 0.5),
              borderRadius: 1,
              p: 1,
              overflow: 'auto',
            },
            '& code': {
              bgcolor: message.sender === 'user'
                ? alpha('#fff', 0.1)
                : (theme) => alpha(theme.palette.grey[900], 0.5),
              px: 0.5,
              py: 0.25,
              borderRadius: 0.5,
              fontSize: '0.875em',
            },
          }}
        >
          <Markdown
            sx={{
              '& p': { m: 0, lineHeight: 1.5 },
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                mt: 1,
                mb: 0.5,
                lineHeight: 1.3,
                color: message.sender === 'user' ? 'inherit' : 'primary.main',
              },
              '& ul, & ol': { m: 0, pl: 2 },
              '& li': { mb: 0.5 },
              '& blockquote': {
                borderLeft: `4px solid ${message.sender === 'user' ? alpha('#fff', 0.3) : 'primary.main'}`,
                pl: 2,
                py: 1,
                m: 0,
                bgcolor: alpha('#fff', 0.05),
                borderRadius: 1,
              },
            }}
          >
            {message.content}
          </Markdown>
        </Paper>

        {message.sender === 'user' && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'secondary.main',
              flexShrink: 0,
            }}
          >
            <Iconify icon="mdi:account" sx={{ fontSize: 18 }} />
          </Avatar>
        )}
      </Box>
    </Box>
  );

  const renderTypingIndicator = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 3,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          maxWidth: '80%',
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'primary.main',
            flexShrink: 0,
          }}
        >
          <Iconify icon="mdi:robot" sx={{ fontSize: 18 }} />
        </Avatar>

        <Paper
          sx={{
            p: 2,
            borderRadius: '18px 18px 18px 4px',
            bgcolor: (theme) => alpha(theme.palette.grey[800], 0.8),
            border: `1px solid ${alpha('#fff', 0.1)}`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'typing 1.4s infinite ease-in-out',
                animationDelay: '0s',
              }}
            />
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'typing 1.4s infinite ease-in-out',
                animationDelay: '0.2s',
              }}
            />
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'typing 1.4s infinite ease-in-out',
                animationDelay: '0.4s',
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Grok AI Chat
        </Typography>
      </Box>

      {/* Messages Container */}
      <Box
        ref={messagesContainerRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: (theme) => alpha(theme.palette.grey[600], 0.3),
            borderRadius: '3px',
          },
        }}
      >
        <Box sx={{ flex: 1, maxWidth: 800, mx: 'auto', width: '100%' }}>
          {messages.length === 0 && !isTyping ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                textAlign: 'center',
                px: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  mb: 3,
                }}
              >
                <Iconify icon="mdi:robot" sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                Welcome to Grok AI
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 400 }}>
                Start a conversation with our AI assistant. Ask questions, get help, or just chat!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>
              {messages.map((message, index) => renderMessage(message, index))}
              {isTyping && renderTypingIndicator()}
            </Box>
          )}
        </Box>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha('#fff', 0.1)}`,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <form onSubmit={onSubmit}>
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Ask me anything..."
                {...register('content')}
                disabled={isTyping}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: (theme) => alpha(theme.palette.grey[800], 0.5),
                    border: `1px solid ${alpha('#fff', 0.1)}`,
                    '&:hover': {
                      border: `1px solid ${alpha('#fff', 0.2)}`,
                    },
                    '&.Mui-focused': {
                      border: `1px solid ${(theme) => theme.palette.primary.main}`,
                      boxShadow: `0 0 0 2px ${(theme) => alpha(theme.palette.primary.main, 0.2)}`,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'text.primary',
                    '&::placeholder': {
                      color: 'text.secondary',
                      opacity: 0.7,
                    },
                  },
                }}
              />
              <IconButton
                type="submit"
                disabled={isSubmitting || isTyping || !content?.trim()}
                sx={{
                  bgcolor: content?.trim() ? 'primary.main' : 'grey.600',
                  color: 'white',
                  width: 48,
                  height: 48,
                  '&:hover': {
                    bgcolor: content?.trim() ? 'primary.dark' : 'grey.600',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'grey.600',
                    color: 'grey.400',
                  },
                }}
              >
                <Iconify icon="mdi:send" />
              </IconButton>
            </Stack>
          </form>
        </Box>
      </Box>

      {/* Scroll to Bottom Button */}
      <Fab
        size="small"
        onClick={scrollToBottom}
        sx={{
          position: 'absolute',
          bottom: 100,
          right: 24,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.9),
          color: 'text.primary',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#fff', 0.1)}`,
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.95),
          },
        }}
      >
        <Iconify icon="mdi:chevron-down" />
      </Fab>

      {/* Typing Animation Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            30% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
        `
      }} />
    </Box>
  );
}