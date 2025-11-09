import { sub } from 'date-fns';
import PropTypes from 'prop-types';
import { useRef, useMemo, useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import uuidv4 from 'src/utils/uuidv4';

import { sendMessage, createConversation } from 'src/api/chat';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChatMessageInput({
  recipients,
  onAddRecipients,
  onSending,
  //
  disabled,
  selectedConversationId,
}) {
  const router = useRouter();

  const { user } = useMockedUser();

  const fileRef = useRef(null);

  const [message, setMessage] = useState('');

  const myContact = useMemo(
    () => ({
      id: `${user?.id}`,
      role: `${user?.role}`,
      email: `${user?.email}`,
      address: `${user?.address}`,
      name: `${user?.displayName}`,
      lastActivity: new Date(),
      avatarUrl: `${user?.photoURL}`,
      phoneNumber: `${user?.phoneNumber}`,
      status: 'online',
    }),
    [user]
  );

  const messageData = useMemo(
    () => ({
      id: uuidv4(),
      attachments: [],
      body: message,
      contentType: 'text',
      createdAt: sub(new Date(), { minutes: 1 }),
      senderId: myContact.id,
    }),
    [message, myContact.id]
  );

  const conversationData = useMemo(
    () => ({
      id: uuidv4(),
      messages: [messageData],
      participants: [...recipients, myContact],
      type: recipients.length > 1 ? 'GROUP' : 'ONE_TO_ONE',
      unreadCount: 0,
    }),
    [messageData, myContact, recipients]
  );

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const handleSendMessage = useCallback(
    async (event) => {
      try {
        if (event.key === 'Enter') {
          if (message) {
            // Notify parent to show typing indicator (ChatGPT-like)
            if (typeof onSending === 'function') {
              onSending(true);
            }
            if (selectedConversationId) {
              await sendMessage(selectedConversationId, messageData);
            } else {
              const res = await createConversation(conversationData);

              router.push(`${paths.dashboard.chat}?id=${res.conversation.id}`);

              onAddRecipients([]);
            }
          }
          setMessage('');
        }
      } catch (error) {
        console.error(error);
      }
    },
    [conversationData, message, messageData, onAddRecipients, onSending, router, selectedConversationId]
  );

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          px: 2,
          py: 1.5,
          borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          bgcolor: (theme) => theme.palette.background.paper,
        }}
      >
        <InputBase
          value={message}
          onKeyUp={handleSendMessage}
          onChange={handleChangeMessage}
          placeholder="Ask me anything..."
          disabled={disabled}
          multiline
          maxRows={4}
          sx={{
            flex: 1,
            px: 2,
            py: 1,
            borderRadius: 3,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            '&:focus-within': {
              borderColor: (theme) => theme.palette.primary.main,
              boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}25`,
            },
            '& .MuiInputBase-input': {
              fontSize: '0.875rem',
              '&::placeholder': {
                color: (theme) => theme.palette.text.disabled,
                opacity: 0.8,
              },
            },
          }}
        />

        <Stack direction="row" spacing={1} sx={{ ml: 1 }}>
          <IconButton
            size="small"
            onClick={handleAttach}
            sx={{
              color: (theme) => theme.palette.text.secondary,
              '&:hover': {
                color: (theme) => theme.palette.primary.main,
                bgcolor: (theme) => theme.palette.primary.main + '10',
              },
            }}
          >
            <Iconify icon="solar:gallery-add-bold" width={20} />
          </IconButton>

          <IconButton
            size="small"
            onClick={handleAttach}
            sx={{
              color: (theme) => theme.palette.text.secondary,
              '&:hover': {
                color: (theme) => theme.palette.primary.main,
                bgcolor: (theme) => theme.palette.primary.main + '10',
              },
            }}
          >
            <Iconify icon="eva:attach-2-fill" width={20} />
          </IconButton>

          <IconButton
            size="small"
            sx={{
              color: (theme) => theme.palette.text.secondary,
              '&:hover': {
                color: (theme) => theme.palette.primary.main,
                bgcolor: (theme) => theme.palette.primary.main + '10',
              },
            }}
          >
            <Iconify icon="solar:microphone-bold" width={20} />
          </IconButton>

          <IconButton
            onClick={(e) => handleSendMessage({ key: 'Enter', ...e })}
            disabled={!message.trim() || disabled}
            sx={{
              bgcolor: (theme) => theme.palette.primary.main,
              color: 'white',
              width: 40,
              height: 40,
              borderRadius: 2,
              '&:hover': {
                bgcolor: (theme) => theme.palette.primary.dark,
                transform: 'scale(1.05)',
              },
              '&:disabled': {
                bgcolor: (theme) => theme.palette.action.disabledBackground,
                color: (theme) => theme.palette.action.disabled,
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <Iconify icon="solar:send-bold" width={20} />
          </IconButton>
        </Stack>
      </Stack>

      <input type="file" ref={fileRef} style={{ display: 'none' }} />
    </>
  );
}

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  onAddRecipients: PropTypes.func,
  onSending: PropTypes.func,
  recipients: PropTypes.array,
  selectedConversationId: PropTypes.string,
};
