/* eslint-disable perfectionist/sort-imports */
import 'src/utils/highlight';

import PropTypes from 'prop-types';
import { useState } from 'react';
// markdown plugins
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import Image from '../image';
import StyledMarkdown from './styles';

// ----------------------------------------------------------------------

/**
 * Code block renderer with "Copy" button.
 * - Handles inline vs fenced code blocks.
 * - Preserves highlight.js classes via className from ReactMarkdown.
 */
function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);

  const codeText = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // no-op
    }
  };

  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton
        size="small"
        title={copied ? 'Copied' : 'Copy'}
        onClick={handleCopy}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: 'rgba(0,0,0,0.3)',
          color: 'common.white',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
        }}
      >
        <Iconify icon={copied ? 'solar:check-read-bold' : 'solar:copy-bold'} width={16} />
      </IconButton>

      <pre>
        <code className={className} {...props}>{children}</code>
      </pre>
    </Box>
  );
}

// ----------------------------------------------------------------------

export default function Markdown({ sx, components, enableCodeBlockCopy = false, ...other }) {
  const defaultComponents = {
    img: ({ ...props }) => (
      <Image alt={props.alt} ratio="16/9" sx={{ borderRadius: 2 }} {...props} />
    ),
    a: ({ ...props }) => {
      const isHttp = props.href.includes('http');

      return isHttp ? (
        <Link target="_blank" rel="noopener" {...props} />
      ) : (
        <Link component={RouterLink} href={props.href} {...props}>
          {props.children}
        </Link>
      );
    },
    ...(enableCodeBlockCopy
      ? {
          code: CodeBlock,
        }
      : {}),
  };

  const mergedComponents = { ...defaultComponents, ...(components || {}) };

  return (
    <StyledMarkdown sx={sx}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight, [remarkGfm, { singleTilde: false }]]}
        components={mergedComponents}
        {...other}
      />
    </StyledMarkdown>
  );
}

Markdown.propTypes = {
  sx: PropTypes.object,
  components: PropTypes.object,
  enableCodeBlockCopy: PropTypes.bool,
};
