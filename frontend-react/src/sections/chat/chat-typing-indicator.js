import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default function ChatTypingIndicator({ isTyping = false, avatarUrl, name = "AI Assistant" }) {
  const theme = useTheme();
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isTyping) {
      setDots('');
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isTyping]);

  if (!isTyping) return null;

  return (
    <Stack
      direction="row"
      sx={{
        mb: 3,
        px: 2,
        py: 1,
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.02)',
        },
        transition: 'background-color 0.2s ease-in-out',
      }}
    >
      <Avatar
        alt={name}
        src={avatarUrl}
        sx={{
          width: 36,
          height: 36,
          mr: 1.5,
          border: `2px solid ${theme.palette.background.paper}`,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      />

      <Stack alignItems="flex-start" sx={{ maxWidth: '70%' }}>
        <Typography
          variant="caption"
          sx={{
            mb: 0.5,
            fontSize: '0.75rem',
            color: 'text.disabled',
          }}
        >
          {name}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            p: 1.5,
            minWidth: 48,
            maxWidth: 320,
            borderRadius: '18px 18px 18px 4px',
            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                animation: 'typing 1.4s infinite ease-in-out',
                '@keyframes typing': {
                  '0%, 60%, 100%': {
                    transform: 'translateY(0)',
                    opacity: 0.4,
                  },
                  '30%': {
                    transform: 'translateY(-10px)',
                    opacity: 1,
                  },
                },
              }}
            />
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                animation: 'typing 1.4s infinite ease-in-out 0.2s',
                '@keyframes typing': {
                  '0%, 60%, 100%': {
                    transform: 'translateY(0)',
                    opacity: 0.4,
                  },
                  '30%': {
                    transform: 'translateY(-10px)',
                    opacity: 1,
                  },
                },
              }}
            />
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                animation: 'typing 1.4s infinite ease-in-out 0.4s',
                '@keyframes typing': {
                  '0%, 60%, 100%': {
                    transform: 'translateY(0)',
                    opacity: 0.4,
                  },
                  '30%': {
                    transform: 'translateY(-10px)',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

ChatTypingIndicator.propTypes = {
  isTyping: PropTypes.bool,
  avatarUrl: PropTypes.string,
  name: PropTypes.string,
};