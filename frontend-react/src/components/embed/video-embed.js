import PropTypes from 'prop-types';

const getYouTubeVideoId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : url;
};

const getTiktokVideoId = (url) => {
  const regex = /tiktok.com\/.*\/video\/(\d+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return url;
};

const VideoEmbed = ({ platform, videoIdOrUrl }) => {
  let embedUrl;

  switch (platform) {
    case 'Youtube':
      embedUrl = `https://www.youtube.com/embed/${getYouTubeVideoId(videoIdOrUrl)}`;
      break;
    case 'Tiktok':
      embedUrl = `https://www.tiktok.com/embed/${getTiktokVideoId(videoIdOrUrl)}`;
      break;
    default:
      return null;
  }

  return (
    <>
      {platform === 'Youtube' || platform === 'Tiktok' ? (
        <iframe
          title={platform}
          src={embedUrl}
          style={{ border: 'none', width: '100%' }}
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        ></iframe>
      ) : (
        <></>
      )}
    </>
  );
};

export default VideoEmbed;

VideoEmbed.propTypes = {
  platform: PropTypes.string,
  videoIdOrUrl: PropTypes.string,
};
