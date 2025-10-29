'use client';

import { m } from 'framer-motion';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { alpha, styled, useTheme } from '@mui/material/styles';

import { bgGradient, textGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import MainLayout from 'src/layouts/main';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  ...bgGradient({
    direction: '135deg',
    startColor: alpha(theme.palette.primary.main, 0.1),
    endColor: alpha(theme.palette.secondary.main, 0.1),
  }),
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 20% 80%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
    pointerEvents: 'none',
  },
}));

const StyledHero = styled('div')(({ theme }) => ({
  textAlign: 'center',
  position: 'relative',
  zIndex: 1,
  maxWidth: 800,
  margin: '0 auto',
}));

const StyledChatInput = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 24,
  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[8],
  marginTop: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(4),
}));

const StyledExamplePrompts = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
  maxWidth: 800,
  margin: '0 auto',
}));

const StyledPromptCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  backdropFilter: 'blur(10px)',
  cursor: 'pointer',
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
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
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <MainLayout>
      <StyledRoot>
        <Container maxWidth="lg">
          <StyledHero>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  ...textGradient(
                    `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.primary.main} 100%`
                  ),
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 700,
                  mb: 2,
                  backgroundSize: '400%',
                  animation: 'gradient 15s ease infinite',
                  '@keyframes gradient': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                }}
              >
                CrawlDataAI
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  fontWeight: 400,
                  maxWidth: 600,
                  mx: 'auto',
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
              <StyledChatInput elevation={0}>
                <TextField
                  fullWidth
                  placeholder="Ask me anything about data crawling, analysis, or insights..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '1rem',
                      padding: theme.spacing(1),
                    },
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <Iconify icon="mdi:send" width={24} />
                </IconButton>
              </StyledChatInput>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <StyledExamplePrompts>
                {examplePrompts.map((prompt, index) => (
                  <StyledPromptCard
                    key={index}
                    elevation={0}
                    onClick={() => setMessage(prompt.description)}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Iconify icon={prompt.icon} width={24} color="primary.main" />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {prompt.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {prompt.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </StyledPromptCard>
                ))}
              </StyledExamplePrompts>
            </m.div>
          </StyledHero>
        </Container>
      </StyledRoot>
    </MainLayout>
  );
}