import PropTypes from 'prop-types';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { connectSocial, disconnectSocial, checkAndConnectSocial } from 'src/api/social';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------

export default function AccountSocialLinks({ socialLinks }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user, updateDispath } = useAuthContext();


  const socials = user?.socials;
  const [telegram, setTelegram] = useState(null);
  const [discord, setDiscord] = useState(null);
  const [twitter, setTwitter] = useState(null);
  const [facebook, setFacebook] = useState(null);
  const [tiktok, setTiktok] = useState(null);
  const [youtube, setYoutube] = useState(null);
  const [instagram, setInstagram] = useState(null);
  const [disabledInstagram, setDisabledInstagram] = useState(true);
  const [disabledTiktok, setDisabledTiktok] = useState(true);
  const [disabledYoutube, setDisabledYoutube] = useState(true);
  const [loadingInstagram, setLoadingInstagram] = useState(false);
  const [loadingTiktok, setLoadingTiktok] = useState(false);
  const [loadingYoutube, setLoadingYoutube] = useState(false);
  const [inputTiktok, setInputTiktok] = useState('');
  const [inputYoutube, setInputYoutube] = useState('');
  const [inputInstagram, setInputInstagram] = useState('');
  const telegramDivRef = useRef(null);
  const router = useRouter();


  // copy hastag
  const handleCopy = () => {
    const textToCopy = "#xoffer_" + user?.code;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        // setOpen(true);
        enqueueSnackbar('Copied');

      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  // Hàm xử lý thay đổi giá trị của input
  const handleChangeTiktok = (event) => {
    setInputTiktok(event.target.value);
    const tiktokUrlRegex = /^(https?:\/\/)?(www\.)?tiktok\.com\/(@[A-Za-z0-9._-]+\/video\/\d+|@[A-Za-z0-9._-]+|v\/\d+|\S+)$/;
    if (tiktokUrlRegex.test(event.target.value)) {
      setDisabledTiktok(false)
    }
    else {
      setDisabledTiktok(true)
    }

  };

  const handleChangeYoutube = (event) => {
    const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    setInputYoutube(event.target.value);
    if (youtubeUrlRegex.test(event.target.value)) {
      setDisabledYoutube(false)
    }
    else {
      setDisabledYoutube(true)
    }
  };

  const handleChangeInstagram = (event) => {
    const instagramUrlRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/([A-Za-z0-9._-]+)$/;
    setInputInstagram(event.target.value);
    if (instagramUrlRegex.test(event.target.value)) {
      setDisabledInstagram(false)
    }
    else {
      setDisabledInstagram(true)
    }
  };

  const socialSetters = {
    telegram: setTelegram,
    discord: setDiscord,
    twitter: setTwitter,
    facebook: setFacebook,
    tiktok: setTiktok,
    youtube: setYoutube,
    instagram: setInstagram,
  };

  //
  useEffect(() => {
    socials.forEach(({ type, data }) => {
      if (Object.keys(data).length > 0) {
        if (['telegram', 'discord', 'twitter', 'facebook'].includes(type)) {
          socialSetters[type]({ type, username: data.username });
        } else if (['tiktok', 'youtube', 'instagram'].includes(type)) {
          const link = data.link || '';
          socialSetters[type]({ type, link });
          if (type === 'tiktok') setInputTiktok(link);
          if (type === 'youtube') setInputYoutube(link);
          if (type === 'instagram') setInputInstagram(link);
        }
      }
    });

  }, [socials]);

  // ket noi telegram khi ở link connect
  useEffect(() => {
    const currentPath = window.location.href;
    const connectTelegram = async (data) => {
      const response = await connectSocial(user, 'telegram', null, data);
      updateDispath()
      router.push('/user/account');

    }
    if (currentPath.includes('user/account?id')) {
      const queryParameters = new URLSearchParams(window.location.search);
      const username = queryParameters.get("username");
      const first_name = queryParameters.get("first_name");
      const photo_url = queryParameters.get("photo_url");
      let data;
      if (username && first_name && photo_url) {
        data = {
          username: username,
          first_name: first_name,
          photo_url: photo_url,
        };
        connectTelegram(data)
        // router.push('/');
      }
    }

  }, []);

  // khoi tao button connect telegram
  useEffect(() => {
    if (telegram === null) {
      const url = window.location.href;
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'xoffer_monitor_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-auth-url', url);
      script.setAttribute('data-request-access', 'write');
      script.setAttribute('data-radius', '2');
      script.setAttribute('data-userpic', 'false');

      if (telegramDivRef.current) {
        telegramDivRef.current.appendChild(script);
      }

      return () => {
        // if (telegramDivRef.current) {
        //   telegramDivRef.current.removeChild(script);
        // }
      };
    }
  }, [telegram]);

  // thong bao ket noi that bai khi duong dan co chua 'status=402'
  useEffect(() => {
    const { href } = window.location;
    if (href.includes('status=402')) {
      enqueueSnackbar('Connect failed', { variant: 'error' });
    }
  }, []);

  // connect discord, twitter, facebook
  const link = async (type) => {
    const currentPath = window.location.href;
    const url = `${type}/link?path=${currentPath}`;

    const response = await connectSocial(user, type, currentPath, null);
    window.open(response.data.redirect_url, '_self')
    updateDispath()


  };

  // disconnect (su dung cho tat ca social)
  const disconnect = async (type) => {
    const url = `disable/${type}`;
    const response = await disconnectSocial(user, type)
    updateDispath()
    switch (type) {
      case 'telegram':
        setTelegram(null);
        break;
      case 'discord':
        setDiscord(null);
        break;
      case 'twitter':
        setTwitter(null);
        break;
      case 'facebook':
        setFacebook(null);
        break;
      case 'tiktok':
        setTiktok(null);
        break;
      case 'youtute':
        setYoutube(null);
        break;
      case 'instagram':
        setInstagram(null);
        break;
      default: break;
    }

  };

  // connect tiktok, youtube, instagram
  const check = async (type) => {
    try {
      let data;
      switch (type) {
        case 'tiktok':
          setLoadingTiktok(true);
          data = {
            hashtag: `#xoffer_${user?.code}`,
            link: inputTiktok,
            type: type,
          }
          break;
        case 'youtube':
          setLoadingYoutube(true);
          data = {
            hashtag: `#xoffer_${user?.code}`,
            link: inputYoutube,
            type: type,
          }
          break;
        case 'instagram':
          setLoadingInstagram(true);
          data = {
            hashtag: `#xoffer_${user?.code}`,
            link: inputInstagram,
            type: type,
          }
          break;
        default: break;
      }
      const response = await checkAndConnectSocial(user, type, data);
      if (response?.message) {
        if (response?.status) {
          enqueueSnackbar(response?.message);

        } else
          enqueueSnackbar(response?.message, { variant: 'error' });
      }
    } catch (error) {
      console.log(error)
    } finally {
      updateDispath();
      switch (type) {
        case 'tiktok':
          setLoadingTiktok(false);
          break;
        case 'youtube':
          setLoadingYoutube(false);
          break;
        case 'instagram':
          setLoadingInstagram(false);
          break;
        default: break;
      }
    }
  };


  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);



  // get gia tri co cac thuoc tinh cua input
  const getValueForAttributeInput = (attribute, type) => {
    if (attribute === 'value') {
      if (type === 'tiktok') {
        return inputTiktok;
      } else if (type === 'youtube') {
        return inputYoutube;
      } else if (type === 'instagram') {
        return inputInstagram;
      }
    } else if (attribute === 'onChange') {
      if (type === 'tiktok') {
        return handleChangeTiktok;
      } else if (type === 'youtube') {
        return handleChangeYoutube;
      } else if (type === 'instagram') {
        return handleChangeInstagram;
      }
    } else if (attribute === 'disabled') {
      if (type === 'tiktok') {
        return disabledTiktok;
      } else if (type === 'youtube') {
        return disabledYoutube;
      } else if (type === 'instagram') {
        return disabledInstagram;
      }
    } else if (attribute === 'loading') {
      if (type === 'tiktok') {
        return loadingTiktok;
      } else if (type === 'youtube') {
        return loadingYoutube;
      } else if (type === 'instagram') {
        return loadingInstagram;
      }
    }
  }

  const renderButtonSocial = useCallback((type, social) =>
    <Grid xs={12} md={12} lg={6}>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Box>
          <Box sx={{ width: '240px', justifyContent: 'center' }}>
            <Box sx={{ mx: 2, my: 1, typography: 'subtitle2' }}>
              {social != null ? `Connected ${social?.username}` : `Connect to ${capitalizeFirstLetter(type)}`}
            </Box>
            {type === 'telegram' && social === null ?

              <Box
                id="telegram-login" ref={telegramDivRef}
                sx={{
                  px: 2,
                  background: '#54a9eb', borderRadius: 1,
                  '&:hover': {
                    background: '#54a9eb',
                  },
                }}
              >
              </Box>

              // <Button
              //   size="large"
              //   fullWidth
              //   variant="soft"
              //   id="telegram-login" ref={telegramDivRef}
              //   sx={{
              //     background: '#54a9eb', borderRadius: 1, '&:hover': {
              //       background: '#54a9eb', 
              //     },
              //   }}
              // onClick={social != null ? () => disconnect(type) : () => link(type)}
              // >

              // </Button>

              :
              // <Box
              //     sx={{ width: '260', height: '40', bgcolor: (theme) => alpha(theme.palette.primary.light, 0.5), borderRadius: 1}}
              // >
              <Button
                disabled={type === 'facebook' && true} // vo hieu hoa connect facebook
                size="large"
                fullWidth
                variant="soft"
                color='info'
                sx={{ py: 1, }}
                onClick={social != null ? () => disconnect(type) : () => link(type)}
              // disabled={loadingConnectTon || loadingConnect}
              >
                {type === 'facebook' ?
                  (<Typography variant="p">Comming soon</Typography>) :
                  (<Typography variant="p">{social != null ? `Disconect` : 'Connect'}</Typography>)
                }

                {social != null && (<Iconify icon="solar:trash-bin-trash-bold" width={24} color="red" sx={{ ml: 1 }} />
                )}
              </Button>
              // </Box>
            }


          </Box>
        </Box>

        <Box
          sx={{
            width: 80,
            height: 80,
            lineHeight: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {type === 'telegram' && (<Iconify icon="mingcute:telegram-fill" width="80%" color="#007AFF" />)}
          {type === 'discord' && (<Iconify icon="mingcute:discord-fill" width="80%" color='#956AFF' />)}
          {type === 'twitter' && (<Iconify icon="mingcute:social-x-line" width="80%" color='#09244B' />)}
          {type === 'facebook' && (<Iconify icon="mingcute:facebook-fill" width="80%" color='#007AFF' />)}


        </Box>
      </Card>
    </Grid>

    , [user])

  const renderInputSocial = useCallback((type, social) =>
    <TextField
      label="Profile link"
      // value={getValueInputSocial(type)}
      // onChange={getOnchangeInputSocial(type)}
      value={getValueForAttributeInput('value', type)}
      onChange={getValueForAttributeInput('onChange', type)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {type === 'tiktok' && <Iconify icon="mingcute:tiktok-fill" width={24} color='#09244B' />}
            {type === 'youtube' && <Iconify icon="mingcute:youtube-fill" width={24} color='#FF6252' />}
            {type === 'instagram' && <Iconify icon="mingcute:ins-fill" width={24} color='#FF6252' />}

          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            {/* <Button onClick={() => { }} color="info" sx={{ width: 1 }}>
              <Typography >Connect</Typography>
            </Button> */}
            <LoadingButton disabled={getValueForAttributeInput('disabled', type)} onClick={() => check(type)} variant="contained" color="info" loading={getValueForAttributeInput('loading', type)}>
              Connect
            </LoadingButton>
          </InputAdornment>
        ),
      }}
      sx={{
        borderRadius: 1,
        bgcolor: 'common.white',
        my: 2,
        width: 1
      }}
    />

    , [inputInstagram, inputTiktok, inputYoutube, loadingTiktok, loadingYoutube, loadingInstagram])


  return (
    <Grid container spacing={3}>
      {renderButtonSocial('telegram', telegram)}
      {renderButtonSocial('discord', discord)}
      {renderButtonSocial('twitter', twitter)}
      {renderButtonSocial('facebook', facebook)}

      <Grid xs={12} md={12}>
        <Card
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            p: 2,
            width: 1
          }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="start"
            spacing={1}
            sx={{ width: 1 }}
          >
            <Stack
              variant="outlined"
              color="warning"
              sx={{ width: 1 }}
              justifyContent="space-between"
            >

              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
                sx={{
                  p: 1,
                  bgcolor: (theme) => alpha(theme.palette.success.light, 0.1),
                  borderRadius: '5px',
                  border: (theme) => `solid 1px ${alpha(theme.palette.success.main, 0.8)}`,
                }}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                  }}
                >
                  <Iconify icon="ep:guide" width={28} sx={{ color: 'success.main', mx: 1 }} />
                  <Typography variant="subtitle2" olor='info'>Add a hashtag to your bio before connecting</Typography>
                </Box>

                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                    justifyContent: 'end',
                  }}
                >
                  <Typography variant="body2" olor='info'>Your hashtag:</Typography>
                  <Box sx={{
                    alignItems: 'center',
                    display: 'inline-flex',
                    ml: 1,
                    p: 1,
                    borderRadius: '8px',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[300], 0.8)}`,
                  }}
                  >
                    <Typography variant="subtitle2" sx={{ ml: 1, mr: 2, color: 'info.main', }}>#xoffer_{user?.code}</Typography>
                    <Button color="info" variant="soft" size='small' onClick={handleCopy}>
                      Copy
                    </Button>
                  </Box>

                </Box>
              </Box>

              {/* Add hastag to your bio before connecting. */}

              {/* <Stack
                direction="row"
                justifyContent="center"
                alignItems="flex-start"
                spacing={0}
              >

                <Typography color='warning'>Use hastag: #xoffer_{user?.code}</Typography>
                <IconButton color="warning" size="small" variant="soft" onClick={handleCopy} sx={{ pb: 1 }}>
                  <Iconify icon="eva:copy-fill" width={24} />
                </IconButton>
              </Stack> */}
            </Stack>
            {renderInputSocial('tiktok', tiktok)}
            {renderInputSocial('youtube', youtube)}
            {renderInputSocial('instagram', instagram)}
          </Stack>
        </Card>
      </Grid >
    </Grid >
  );
}

AccountSocialLinks.propTypes = {
  socialLinks: PropTypes.object,
};
