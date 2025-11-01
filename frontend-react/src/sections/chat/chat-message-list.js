import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';
import ChatTypingIndicator from './chat-typing-indicator';

// ----------------------------------------------------------------------

export default function ChatMessageList({ messages = [], participants, isTyping = false }) {
  const theme = useTheme();
  const { messagesEndRef } = useMessagesScroll(messages);
  const messagesContainerRef = useRef(null);

  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef]);

  return (
    <>
      <Scrollbar
        ref={messagesContainerRef}
        sx={{
          height: 1,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'grey.900'
              : 'grey.25',
          '& .simplebar-content': {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
          },
        }}
      >
        <Box
          sx={{
            py: 2,
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: messages.length === 0 ? 'center' : 'flex-start',
          }}
        >
          {messages.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 2,
              }}
            >
              <Box
                component="img"
                src="/assets/icons/chat/chat-empty.svg"
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 3,
                  opacity: 0.5,
                }}
              />
              <Box
                sx={{
                  color: 'text.secondary',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                Start a conversation
              </Box>
              <Box
                sx={{
                  color: 'text.disabled',
                  fontSize: '0.875rem',
                }}
              >
                Ask me anything about data crawling, AI, or anything else!
              </Box>
            </Box>
          ) : (
            messages.map((message, index) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                participants={participants}
                onOpenLightbox={() => lightbox.onOpen(message.body)}
              />
            ))
          )}

          {isTyping && (
            <ChatTypingIndicator
              isTyping={isTyping}
              avatarUrl="/assets/icons/chat/ai-avatar.svg"
              name="AI Assistant"
            />
          )}

          <div ref={messagesEndRef} />
        </Box>
      </Scrollbar>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}

ChatMessageList.propTypes = {
  messages: PropTypes.array,
  participants: PropTypes.array,
  isTyping: PropTypes.bool,
};
