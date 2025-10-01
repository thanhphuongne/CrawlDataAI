'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

import { useSnackbar } from 'src/components/snackbar';
import Iconify from 'src/components/iconify';

import { getCrawlDialogsByUser, sendCrawlDialog } from 'src/api/crawl-api';

// ----------------------------------------------------------------------

export default function CrawlChatView() {
  const { enqueueSnackbar } = useSnackbar();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { content: '' },
  });

  const userId = 1; // Assuming user ID is 1, or get from auth

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

    setLoading(true);
    try {
      const newMessage = {
        request_id: 1, // Assuming request ID
        content: data.content,
      };

      await sendCrawlDialog(newMessage);
      reset();
      // Refresh dialogs to show new message
      await fetchDialogs();
    } catch (error) {
      enqueueSnackbar('Failed to send message', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  });

  const renderMessage = (message, index) => (
    <Stack
      key={index}
      direction="row"
      spacing={2}
      sx={{
        mb: 2,
        alignItems: 'flex-start',
        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
      }}
    >
      {message.sender !== 'user' && (
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <Iconify icon="mdi:robot" />
        </Avatar>
      )}
      <Paper
        sx={{
          p: 2,
          maxWidth: '70%',
          bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
          color: message.sender === 'user' ? 'white' : 'text.primary',
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
      </Paper>
      {message.sender === 'user' && (
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          <Iconify icon="mdi:account" />
        </Avatar>
      )}
    </Stack>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">AI Crawl Chat</Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <Stack spacing={2}>
          {messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              Start a conversation with the AI crawler
            </Typography>
          ) : (
            messages.map((message, index) => renderMessage(message, index))
          )}
        </Stack>
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <form onSubmit={onSubmit}>
          <Stack direction="row" spacing={1}>
            <TextField
              fullWidth
              placeholder="Type your message..."
              {...register('content')}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                },
              }}
            />
            <IconButton
              type="submit"
              disabled={isSubmitting || loading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <Iconify icon="mdi:send" />
            </IconButton>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}