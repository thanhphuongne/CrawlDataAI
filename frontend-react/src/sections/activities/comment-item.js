import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';


// ----------------------------------------------------------------------

export default function CommentItem({ name, avatarUrl, message, tagUser, postedAt, hasReply }) {
  const reply = useBoolean();

  return (
    <ListItem
      sx={{
        p: 0,
        pt: 3,
        alignItems: 'flex-start',
        // ...(hasReply && {
        //   pl: 8,
        // }),
      }}
    >
      <Avatar alt={name} src="/assets/images/avatar/avatar-2.webp" sx={{ mr: 2, width: 48, height: 48 }} />

      <Stack
        flexGrow={1}
        sx={{
          pb: 3,
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {name}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {(postedAt)}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {/* {tagUser && (
            <Box component="strong" sx={{ mr: 0.5 }}>
              @{tagUser}
            </Box>
          )} */}
          {message}
        </Typography>

        {/* {reply.value && (
          <Box sx={{ mt: 2 }}>
            <TextField fullWidth autoFocus placeholder="Write comment..." />
          </Box>
        )} */}
      </Stack>

      {/* {!hasReply && (
        <Button
          size="small"
          color={reply.value ? 'primary' : 'inherit'}
          startIcon={<Iconify icon="solar:pen-bold" width={16} />}
          onClick={reply.onToggle}
          sx={{ right: 0, position: 'absolute' }}
        >
          Reply
        </Button>
      )} */}
    </ListItem>
  );
}

  CommentItem.propTypes = {
  avatarUrl: PropTypes.string,
  hasReply: PropTypes.bool,
  message: PropTypes.string,
  name: PropTypes.string,
  postedAt: PropTypes.string,
  tagUser: PropTypes.string,
};
