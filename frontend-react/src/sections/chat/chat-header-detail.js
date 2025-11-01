import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { fToNow } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ChatHeaderDetail({ participants }) {
  const group = participants.length > 1;

  const singleParticipant = participants[0];

  const renderGroup = (
    <AvatarGroup
      max={3}
      sx={{
        [`& .${avatarGroupClasses.avatar}`]: {
          width: 32,
          height: 32,
        },
      }}
    >
      {participants.map((participant) => (
        <Avatar key={participant.id} alt={participant.name} src={participant.avatarUrl} />
      ))}
    </AvatarGroup>
  );

  const renderSingle = (
    <Stack flexGrow={1} direction="row" alignItems="center" spacing={2}>
      <Badge
        variant={singleParticipant.status}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          src={singleParticipant.avatarUrl}
          alt={singleParticipant.name}
          sx={{
            width: 48,
            height: 48,
            border: (theme) => `3px solid ${theme.palette.background.paper}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        />
      </Badge>

      <ListItemText
        primary={singleParticipant.name}
        secondary={
          singleParticipant.status === 'offline'
            ? fToNow(singleParticipant.lastActivity)
            : singleParticipant.status
        }
        primaryTypographyProps={{
          variant: 'h6',
          sx: {
            fontWeight: 600,
            fontSize: '1.125rem',
          },
        }}
        secondaryTypographyProps={{
          component: 'span',
          sx: {
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
          },
          ...(singleParticipant.status !== 'offline' && {
            textTransform: 'capitalize',
          }),
        }}
      />
    </Stack>
  );

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: 2.5,
        pl: 3,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: (theme) => theme.palette.background.paper,
        minHeight: 80,
      }}
    >
      {group ? renderGroup : renderSingle}

      <Stack direction="row" spacing={1}>
        <IconButton
          sx={{
            color: (theme) => theme.palette.text.secondary,
            '&:hover': {
              color: (theme) => theme.palette.primary.main,
              bgcolor: (theme) => theme.palette.primary.main + '10',
            },
          }}
        >
          <Iconify icon="solar:phone-bold" />
        </IconButton>
        <IconButton
          sx={{
            color: (theme) => theme.palette.text.secondary,
            '&:hover': {
              color: (theme) => theme.palette.primary.main,
              bgcolor: (theme) => theme.palette.primary.main + '10',
            },
          }}
        >
          <Iconify icon="solar:videocamera-record-bold" />
        </IconButton>
        <IconButton
          sx={{
            color: (theme) => theme.palette.text.secondary,
            '&:hover': {
              color: (theme) => theme.palette.primary.main,
              bgcolor: (theme) => theme.palette.primary.main + '10',
            },
          }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </Stack>
    </Stack>
  );
}

ChatHeaderDetail.propTypes = {
  participants: PropTypes.array,
};
