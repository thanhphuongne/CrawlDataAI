import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTheme, alpha } from '@mui/material/styles';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

import { useGetMessage } from './hooks';

// ----------------------------------------------------------------------

export default function ChatMessageItem({ message, participants, onOpenLightbox }) {
  const theme = useTheme();
  const { user } = useMockedUser();
  const [isHovered, setIsHovered] = useState(false);

  const { me, senderDetails, hasImage } = useGetMessage({
    message,
    participants,
    currentUserId: `${user?.id}`,
  });

  const { firstName, avatarUrl } = senderDetails;
  const { body, createdAt } = message;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(body || '');
    } catch (e) {
      // no-op
    }
  }, [body]);

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        mb: 0.5,
        fontSize: '0.75rem',
        color: 'text.disabled',
        ...(!me && {
          mr: 'auto',
        }),
      }}
    >
      {!me && `${firstName},`} &nbsp;
      {formatDistanceToNowStrict(new Date(createdAt), {
        addSuffix: true,
      })}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 480,
        borderRadius: me ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        typography: 'body2',
        fontSize: '0.875rem',
        lineHeight: 1.4,
        bgcolor: me
          ? theme.palette.mode === 'dark'
            ? 'primary.main'
            : 'primary.main'
          : theme.palette.mode === 'dark'
          ? 'grey.800'
          : 'grey.100',
        color: me
          ? 'primary.contrastText'
          : theme.palette.mode === 'dark'
          ? 'grey.100'
          : 'grey.900',
        boxShadow: me
          ? '0 2px 8px rgba(99, 102, 241, 0.15)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease-in-out',
        transform: isHovered && me ? 'scale(1.02)' : 'scale(1)',
        ...(hasImage && {
          p: 0,
          bgcolor: 'transparent',
          boxShadow: 'none',
        }),
      }}
    >
      {hasImage ? (
        <Box
          component="img"
          alt="attachment"
          src={body}
          onClick={() => onOpenLightbox(body)}
          sx={{
            minHeight: 220,
            borderRadius: 2,
            cursor: 'pointer',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)',
              opacity: 0.95,
            },
          }}
        />
      ) : (
        <Markdown enableCodeBlockCopy>
          {body}
        </Markdown>
      )}
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        opacity: 0,
        top: '100%',
        left: 0,
        position: 'absolute',
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        ...(me && {
          left: 'unset',
          right: 0,
        }),
      }}
    >
      <IconButton size="small" sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}>
        <Iconify icon="solar:reply-bold" width={16} />
      </IconButton>
      <IconButton size="small" sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}>
        <Iconify icon="eva:smiling-face-fill" width={16} />
      </IconButton>
      <IconButton size="small" onClick={handleCopy} sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}>
        <Iconify icon="solar:copy-bold" width={16} />
      </IconButton>
      <IconButton size="small" sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}>
        <Iconify icon="solar:trash-bin-trash-bold" width={16} />
      </IconButton>
    </Stack>
  );

  return (
    <Stack
      direction="row"
      justifyContent={me ? 'flex-end' : 'unset'}
      sx={{
        mb: 3,
        px: 2,
        '&:hover': {
          bgcolor: alpha(theme.palette.common.white, 0.02),
        },
        transition: 'background-color 0.2s ease-in-out',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!me && (
        <Avatar
          alt={firstName}
          src={avatarUrl}
          sx={{
            width: 36,
            height: 36,
            mr: 1.5,
            border: `2px solid ${theme.palette.background.paper}`,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        />
      )}

      <Stack alignItems={me ? 'flex-end' : 'flex-start'} sx={{ maxWidth: '70%' }}>
        {!me && renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            '&:hover': {
              '& .message-actions': {
                opacity: 1,
              },
            },
          }}
        >
          {renderBody}
          {renderActions}
        </Stack>

        {me && renderInfo}
      </Stack>
    </Stack>
  );
}

ChatMessageItem.propTypes = {
  message: PropTypes.object,
  onOpenLightbox: PropTypes.func,
  participants: PropTypes.array,
};
