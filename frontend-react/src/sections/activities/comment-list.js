import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import PostCommentItem from './comment-item';

// ----------------------------------------------------------------------

export default function CommentList({ comments }) {
  const validComments = Array.isArray(comments)
    ? comments.filter((comment) => comment.descriptions && comment.descriptions.trim() !== '')
    : [];

  return (
    <>
      {validComments.length > 0 ? (
        validComments.map((comment) => {
          const { id, commenter, descriptions, createdAt } = comment;

          return (
            <Box key={id}>
              <PostCommentItem
                name={commenter?.accountName}
                message={descriptions}
                postedAt={createdAt}
              />
            </Box>
          );
        })
      ) : (
        <Typography>No comments data</Typography>
      )}

      {/* <Pagination count={8} sx={{ my: 5, mx: 'auto' }} /> */}
    </>
  );
}

CommentList.propTypes = {
  comments: PropTypes.array,
};
