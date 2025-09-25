/* eslint-disable no-nested-ternary */

// import { t } from 'i18next';
import PropTypes from 'prop-types';
import { useState, useEffect, useContext, useCallback } from 'react';

import { alpha } from '@mui/material/styles';
// import { varTranHover } from 'src/components/animate';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
// import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
// import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
// import IconButton from '@mui/material/IconButton';
// import MenuItem from '@mui/material/MenuItem';
// import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// import CardContent from '@mui/material/CardContent';
// import ListItemText from '@mui/material/ListItemText';
import ListItemText from '@mui/material/ListItemText';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

// import { useCountdownDate } from 'src/hooks/use-countdown';
import { useAuthContext } from 'src/auth/hooks';
import { submitJoin, uploadFile, submitQuest, checkCompletedQuest } from 'src/api/campaign-detail';

import Markdown from 'src/components/markdown';
import { LoginDialogContext } from 'src/components/settings';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import { fDate } from 'src/utils/format-time';
// import { fCurrency } from 'src/utils/format-number';

// import Image frIconifyom 'src/components/image';
import Iconify from 'src/components/iconify';
import {
  Upload,
  // UploadBox, UploadAvatar
} from 'src/components/upload';

// ----------------------------------------------------------------------
// làm ngắn URL

const createShortenedUrl = (url) => {
  const startLength = 15;
  const endLength = 15;

  if (url.length <= startLength + endLength) {
    return url;
  }

  const start = url.slice(0, startLength);
  const end = url.slice(-endLength);

  return `${start}...${end}`;
};

const ShortenedUrl = ({ url }) => {
  const shortUrl = createShortenedUrl(url);

  return (
    <Tooltip title={url}>
      <Stack sx={{ display: 'inline-block', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        <Link href={url} target="_blank" rel="noopener noreferrer" underline="none">
          {shortUrl}
        </Link>
      </Stack>
    </Tooltip>
  );
};

export default function CampignQuestItem({ checkJoin, campaign, quest, sx, setcheckJoined }) {
  const [files, setFiles] = useState([]);
  // const [isVerify, setVerify] = useState(false);
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(0);
  const [submit, setSubmit] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedAnsCheck, setSelectedAnsCheck] = useState([]);
  const [showResults] = useState(false);
  const [results, setResults] = useState('');
  const [textFieldValue, setTextFieldValue] = useState('');
  const [linkPost, setLinkPost] = useState('');
  const [content, setContent] = useState('');
  const { handleOpenLoginDialog } = useContext(LoginDialogContext);
  // const [filename, setFilename] = useState('');
  const [ formatData, setFormatData] = useState();

  const { id, step_info_general, vendor_id, ref_id,status_id  } = campaign;

  const handleDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => {
      const newFiles = [
        ...prevFiles,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ];
      // console.log('Updated files:', newFiles);
      return newFiles;
    });
  }, []);

  const handleRemoveFile = useCallback((fileToRemove) => {
    // console.log('File to remove:', fileToRemove);

    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file !== fileToRemove);
      // console.log('Updated files:', updatedFiles);
      return updatedFiles;
    });
  }, []);
  // const handleRemoveAllFiles = useCallback(() => { }, []);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // console.log('quest: ', quest)

  const { description, submission_type, name, reward, actions, status_submit } = quest;

  // hiện thị tên của nút làm nhiệm vụ tuỳ thuộc vào từng loại nhiệm vụ
  const getAcctionName = () => {
    let result = '';
    try {
      const actionName = actions[0]?.action;

      // loại nhiệm vụ submit
      if (submission_type === 'submit') return 'Submit';

      // các nhiệm vụ còn lại
      switch (actionName) {
        case 'quiz':
          result = 'Submit answer';
          break;

        case 'visit_link':
          result = 'Visit Now';
          break;

        default:
          // Replace underscores with spaces
          result = actionName.replace(/_/g, ' ');
          // Capitalize the first letter of each word
          result = result.replace(/\b\w/g, (char) => char.toUpperCase());
          break;
      }
    } catch (error) {
      console.log(error);
    }
    return result;
  };

  // Check join campaign
  const submitJoinCampaign = async () => {
    let ref_id_ = ref_id;
    if (user.id === ref_id) {
      ref_id_ = null;
    }
    const res = await submitJoin(user, step_info_general, vendor_id, id, ref_id_);
    if (res) {
      setcheckJoined(true);
    }
  };

  // thực hiện quest
  const actionQuest = () => {
    if (!user) {
      handleOpenLoginDialog();
      return;
    }
    // setVerify(true);
    if (checkJoin === false) {
      submitJoinCampaign();
    }
    if (submission_type === 'submit' || actions[0].action === 'review' || !actions[0]?.link) {
      return null;
    } else {
      window.open(actions[0].link, '_blank', 'width=800,height=600');
      // ẩn button join
      // if (submission_type === 'visit_link') {
      //   verifyQuest();
      // }
    }
    return null;
  };

  // verify nhiệm vụ
  const verifyQuest = async () => {
    if (!user) {
      handleOpenLoginDialog();
      return;
    }
    actionQuest();
    setLoading(1);
    let attributes = '';
    let status = 1;
    if (submission_type === 'submit') {
      status = 0;
      if (actions.type === 'file') {
        // await handleDataFile();
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file, file.name);
          formData.append('module', 'campaigns');
          formData.append('id', 0);
          const res = await uploadFile(user, formData, file.type);
          if (res?.data) {
            attributes = { fileName: res?.data.data.share };
            await submitQuest(quest, user, attributes, status);
            setLoading(false);
            setSubmit(1);
          }
        })
      } else {
        attributes = { data: textFieldValue };
        await submitQuest(quest, user, attributes, status);
      }
    } else if (actions[0].action === 'review') {
      status = 0;
      attributes = { type: name, link_post: linkPost, content: content };
      await submitQuest(quest, user, attributes, status);
      await checkCompletedQuest(campaign.id);
    } else if (submission_type === 'visit_link') {
        setTimeout(async () => {
          attributes = actions[0].link;
          await submitQuest(quest, user, attributes, status);
          await checkCompletedQuest(campaign.id);
          setLoading(false);
          setSubmit(1);
          // Đặt lại trạng thái loading thành false sau 30 giây
        }, 10000);
      } else {
        setTimeout(async () => {
          attributes = actions[0].link;
          await submitQuest(quest, user, attributes, status);
          await checkCompletedQuest(campaign.id);
          setLoading(false);
          setSubmit(1);
          // Đặt lại trạng thái loading thành false sau 30 giây
        }, 30000);
    }
    
    if (
      (submission_type === 'submit' && actions.type !== 'file' ) ||
      submission_type === 'review' ||
      submission_type === 'quiz'
    ) {
      // await submitQuest(quest, user, attributes, status);
      // await checkCompletedQuest(campaign.id);
      setLoading(false);
      setSubmit(1);
    }
    // setVerify(0);
  };

  // nhiệm vụ vào link nào đó
  const renderVisitLinkQuest = () => {
    if (!actions[0].link) return null;
    return (
      <Typography variant="body">
        Click
        <Typography component="span" color="success.main" sx={{ px: 1 }}>
          {getAcctionName()}
        </Typography>
        button to visit&nbsp;
        <ShortenedUrl url={actions[0].link} />
        &nbsp;and wait at least
        <Typography component="span" color="success.main" sx={{ px: 0.5 }}>
          {actions[0].duration}s
        </Typography>
        to complete this quest
      </Typography>
    );
  };

  // nhiệm vụ liên quan tới discord, telegram, twitter (cần verify)
  const renderVerifyQuest = () => {
    if (!actions[0].link) return null;
    return (
      <>
        <Typography variant="body">
          {/* <strong>Step 1: </strong> */}
          Click
          <Typography component="span" color="success.main" sx={{ px: 0.5 }}>
            {getAcctionName()}
          </Typography>{' '}
          button to access&nbsp;
          <ShortenedUrl url={actions[0].link} />
        </Typography>

        {/* <Typography variant="body">
          <strong>Step 2: </strong>Click{' '}
          <Typography component="span" color="warning.main" sx={{ px: 0.5 }}>
            Verify
          </Typography>{' '}
          and wait for system check your action!
        </Typography> */}
      </>
    );
  };

  // nhiệm vụ trả lời câu hỏi
  const renderQuizQuest = () => {
    if (!actions[0]?.quiz) return null;
    listAnswerTrue(actions[0]?.quiz)
    // console.log('quiz', actions[0]);
    return (
      <>
        {actions[0]?.quiz.map((question) => (
          <Question key={question.id} questionData={question} />
        ))}
        <Stack direction="row" alignItems="center" sx={status_submit === 1 ||  status_submit ? { pb: 1}: { pb: 3, pt: 1 }}>
        { status_submit === 1 ? null : (
        <Button
          fullWidth
          color={
            submit || status_submit
              ? 'success'
              : results === ''
                ? 'success'
                : results
                  ? 'primary'
                  : 'warning'
          }
          variant="soft"
          disabled={loading || selectedAnsCheck.length === 0 || submit || status_id === 3}
          onClick={() => submitAnswer(actions[0]?.quiz)}
        >
          {loading ? "Loading" : submit || status_submit
            ? 'Completed'
            : results === ''
              ? 'Submit Answer'
              : results
                ? 'Correct Answer'
                : 'Incorrect Answer'}
        </Button>)}
        </Stack>
      </>
    );
  };

  // check câu trả lời của user
  const submitAnswer = async (answers) => {
    if (!user) {
      handleOpenLoginDialog();
      return;
    }
    setLoading(1);
    actionQuest();
    let isCorrect = true;
    if (selectedAnsCheck.length === countAnswerTrue(answers)) {
      selectedAnsCheck.forEach((answer) => {
        if (!answer.value) {
          isCorrect = false;
        }
      });
    } else {
      isCorrect = false;
    }
    setResults(isCorrect);
    if (isCorrect) {
      const attributes = selectedAnsCheck;
      await submitQuest(quest, user, attributes, 1);
      await checkCompletedQuest(campaign.id);
      setSubmit(1);
    }
    setLoading(0);
  };

  // lấy list câu trả lời đúng
  const listAnswerTrue = (quizs) => {
    useEffect(() => {
      const fetchData = async () => {
        if (status_submit) {
          const newSelectedAnswers = { ...selectedAnswers };
          quizs.forEach((quiz) => {
            quiz.answers?.forEach((answer) => {
              if (answer.value) {
                newSelectedAnswers[answer.name] = true;
              }
            });
          })
          setSelectedAnswers(newSelectedAnswers);
        }
      }
      fetchData()
    }, [status_submit, quizs]);
  };


  // Đếm câu trả lời đúng
  const countAnswerTrue = (quizs) => {
    let count = 0;
    quizs.forEach((quiz) => {
      quiz.answers?.forEach((answer) => {
        if (answer.value) {
          count += 1;
        }
      });
    })
    return count;
  };

  // layout của một câu hỏi
  const Question = ({ questionData }) => {
    const handleCheckboxChange = (event, answer) => {
      const newSelectedAnswers = { ...selectedAnswers };
      let answerCheck = [...selectedAnsCheck];
      if (event.target.checked) {
        newSelectedAnswers[answer.name] = true;
        answerCheck.push(answer);
      } else {
        delete newSelectedAnswers[answer.name];
        answerCheck = answerCheck.filter((item) => item !== answer);
      }
      setSelectedAnswers(newSelectedAnswers);
      setSelectedAnsCheck(answerCheck);
    };

    return (
      <Stack>
        <Typography variant="h6" gutterBottom>
          {/* {!submit && !status_submit && questionData.question} */}
          {questionData.question}
        </Typography>
          <FormGroup>
            {questionData.answers.map((answer, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={selectedAnswers[answer.name] || false}
                    onChange={(event) => handleCheckboxChange(event, answer)}
                    disabled={submit || status_submit}
                  />
                }
                label={answer.name}
                style={
                  showResults
                    ? answer.value
                      ? { color: 'green' }
                      : selectedAnswers[answer.name]
                        ? { color: 'red' }
                        : {}
                    : {}
                }
              />
            ))}
          </FormGroup>
        {/* <Stack direction="row" alignItems="center" sx={{ pt: 2 }}>
          <Button
            fullWidth
            color={
              submit || status_submit
                ? 'success'
                : results === ''
                  ? 'success'
                  : results
                    ? 'primary'
                    : 'warning'
            }
            variant="soft"
            disabled={loading || selectedAnsCheck.length === 0 || submit}
            onClick={() => submitAnswer(questionData.answers)}
          >
            {loading
              ? 'Loading'
              : submit || status_submit
                ? 'Completed'
                : results === ''
                  ? 'Submit Answer'
                  : results
                    ? 'Correct Answer'
                    : 'Incorrect Answer'}
          </Button>
        </Stack> */}
      </Stack>
    );
  };

  Question.propTypes = {
    questionData: PropTypes.shape({
      question: PropTypes.string.isRequired,
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
  };

  // Xử lý dữ liệu nhập vào quest submit
  const handleTextFieldChange = (event) => {
    setFormatData(validateSubmit(event.target.value))
    setTextFieldValue(event.target.value);
    // console.log('text', event.target.value);
  };

  // nhiệm vụ liên quan tới upload file
  const renderSubmitQuest = (
    <Stack spacing={1.5}>
      <Markdown children={description} />
      {status_submit === null &&
        submit === 0 &&
        (actions.type === 'url' || actions.type === 'email' || actions.type === 'text') && (
          <TextField fullWidth placeholder={actions.type} onChange={handleTextFieldChange} />
        )}

      {status_submit === null && submit === 0 && actions.type === 'file' && (
        <Upload
          multiple
          files={files}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
        // onRemoveAll={handleRemoveAllFiles}
        // onUpload={() => console.info('ON UPLOAD')}
        />
      )}
        {formatData === false && actions.type !== 'text' && (<Typography variant="body" color="red">
          Please enter correct &quot;{actions.type}&quot; format.
        </Typography>)}
      <Stack direction="row" alignItems="center" sx={status_submit === 1 ? { pb: 1}: { pb: 3, pt: 1 }}>
        {status_submit === 1 ? null : (
        <Button
          fullWidth
          color={submit || status_submit ? 'success' : 'warning'}
          variant="soft"
          disabled={
            loading || status_submit === 1 || actions.type === 'file'
              ? files.length === 0
              : !formatData
          }
          onClick={submit || status_submit ? null : () => verifyQuest()}
          sx={{
            cursor: submit || status_submit === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          {loading
            ? 'Loading'
            : status_submit === 1
              ? 'Completed'
              : submit || status_submit === 0
                ? 'Waiting for approval'
                : 'Submit'}
        </Button>)}
      </Stack>
    </Stack>
  );

  // Validate data input email
  const validateSubmit = (textInput) => {
    let re = '';
    if (submission_type === 'review'){
      if (name === 'Facebook'){
        re = /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/;
      } else if (name === 'Youtube'){
        re = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      } else if (name === 'Tiktok') {
        re = /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/;
      } else {
        re = /^(ftp|http|https):\/\/[^ "]+$/;
      }
      return re.test(String(textInput).toLowerCase());
    }

    if (actions?.type === 'email') {
      re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(textInput).toLowerCase());
    }
    if (actions?.type === 'url'){
      re = /^(ftp|http|https):\/\/[^ "]+$/;
      return re.test(String(textInput).toLowerCase());
    }
    return textInput.length > 0
  };

  // Xử lý dữ liệu nhập vào quest submit
  const handleLinkPostChange = (event) => {
    setFormatData(validateSubmit(event.target.value))
    setLinkPost(event.target.value);
  };

  // Xử lý dữ liệu nhập vào quest submit
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  // nhiệm vụ liên quan tới review
  const reviewQuest = (
    <Stack spacing={1.5}>
      <Markdown children={description} />
      {status_submit === null && submit === 0 && (
        <Stack>
          <Stack>
            <Typography variant="body" color="green" sx={{ px: 1, mb: 1 }}>
              {' '}
              Your message
            </Typography>
            <TextField
              fullWidth
              placeholder="Please enter your review"
              onChange={handleContentChange}
              sx={{ px: 1, mb: 2 }}
            />
          </Stack>
          <Typography variant="body" color="green" sx={{ px: 1, mb: 1 }}>
            {' '}
            Link review
          </Typography>
          <TextField
            fullWidth
            placeholder="Please enter your review link"
            onChange={handleLinkPostChange}
            sx={{ px: 1 }}
          />
        </Stack>
      )}
      {formatData === false && (<Typography variant="body" color="red" sx={ status_submit === 1 ? { pb: 1}: { pb: 3, pt: 1 }}>
          Please enter correct &quot;{name}&quot; format.
        </Typography>)}
        <Stack direction="row" alignItems="center" sx={{ pb: 3, pt: 1 }}>
        { status_submit === 1 ? null : (
          <Button
            fullWidth
            color={submit || status_submit ? 'success' : 'warning'}
            variant="soft"
            disabled={loading || status_submit === 1 || !content || !linkPost || !formatData}
            onClick={submit || status_submit ? null : () => verifyQuest()}
            sx={{
              cursor: submit || status_submit === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {loading
              ? 'Loading'
              : status_submit === 1
                ? 'Completed'
                : submit === 1 || status_submit === 0
                  ? 'Waiting for approval'
                  : 'Submit'}
          </Button>)}
      </Stack>
    </Stack>
  );

  const renderQuestContent = () => {
    switch (submission_type) {
      case 'visit_link':
        return renderVisitLinkQuest();
      case 'quiz':
        return renderQuizQuest();
      case 'submit':
        return renderSubmitQuest;
      case 'twitter':
      case 'telegram':
      case 'discord':
        return renderVerifyQuest();
      case 'review':
        // case 'Youtube':
        // case 'Facebook':
        // case 'Checkin':
        return reviewQuest;
      default:
        return submission_type;
    }
  };

  // Ẩn button v
  // // kiểm tra nhiệm vụ có cần nút verify hay không
  // const checkVerifyBtn = () => {
  //   if (submission_type === 'submit') return false;
  //   if (submission_type === 'quiz') return false;
  //   if (submission_type === 'visit_link') return false;
  //   if (actions[0].action === 'review') return false;
  //   return true;
  // };

  return (
    <Card
      sx={{
        my: 2,
        // p: 2,
        // boxShadow: 'none',
        borderRadius: 2,
        // color: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : 'primary.lighter'),
        // bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        border:
          submit ||
            status_submit === 1 ||
            (status_submit === 0 && (submission_type === 'submit' || actions[0].action === 'review'))
            ? (theme) => `3px solid ${alpha(theme.palette.success.main, 0.24)}`
            : (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
        // border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.24)}`,
        ...sx,
      }}
    >
      <Stack
        spacing={3}
        sx={{
          p: 2,
          cursor: 'pointer',

          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
          },
        }}
        onClick={handleExpandClick}
      >
        <Stack direction="row" alignItems="center">
          {/* <Avatar src="https://api-prod-minimal-v510.vercel.app/assets/images/avatar/avatar_8.jpg" sx={{ width: 48, height: 48, mr: 2 }} /> */}
          <Iconify
            width={30}
            icon={
              (submission_type === 'submit' && 'ic:round-upload') ||
              (submission_type === 'discord' && 'ic:baseline-discord') ||
              (submission_type === 'telegram' && 'basil:telegram-solid') ||
              (submission_type === 'visit_link' && 'fa6-solid:link') ||
              (submission_type === 'quiz' && 'mdi:quiz') ||
              (submission_type === 'twitter' && 'ri:twitter-x-fill') ||
              ''
            }
            color={
              (submission_type === 'discord' && '#5865F2') ||
              (submission_type === 'telegram' && '#0088cc') ||
              (submission_type === 'quiz' && '#6640ce') ||
              (submission_type === 'twitter' && '#000000') ||
              'primary.main'
            }
            sx={{ mr: 1 }}
          />
          <ListItemText
            primary={
              <Typography variant="subtitle2" sx={{ fontSize: 16 }}>
                {name}
              </Typography>
            }
          />
          <Box
            component="span"
            sx={{
              typography: 'button',
              color: 'success.main',
            }}
          >
            +{reward} Points
          </Box>
          {/* <Image
            sx={{ ml: 0.75 }}
            src="/assets/icons/components/gamma.svg"
            style={{ width: 24, height: 24 }}
          /> */}

          {submit ||
            status_submit === 1 ||
            (status_submit === 0 &&
              (submission_type === 'submit' || actions[0].action === 'review')) ? (
            <Iconify
              icon="eva:checkmark-circle-2-outline"
              width={24}
              sx={{ ml: 3, color: 'success.main' }}
            />
          ) : null}
          {loading ? (
            <CircularProgress
              size={18}
              sx={{
                ml: 2,
                typography: 'button',
                color: 'success.main',
              }}
            />
          ) : (
            ''
          )}
          {/* {submit || status_submit ? 
            <CheckCircleIcon style={{ color: 'green' }} />
           : null
          } */}
        </Stack>
      </Stack>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Stack sx={{ px: 3, pt: 1.5 }}>{renderQuestContent()}</Stack>
        {/* <Stack sx={{ px: 3, pt: 1.5 }}>
          {seconds && <TimeBlock label="Seconds" value={seconds} />}
        </Stack> */}

        {
          submission_type !== 'quiz' &&
          submission_type !== 'submit' && submission_type !== 'review' &&
         <Stack direction="row" alignItems="center" sx={ !submit && !status_submit ? { p: 3, pt: 2 } : {pb: 3}}>
             {!submit && !status_submit && <Button
              fullWidth
              color="success"
              variant="soft"
              disabled={loading}
              onClick={() => verifyQuest()}
            >
              {loading ? 'Loading' : getAcctionName()}
            </Button>}


            {/* ẩn button verify */}
            {/* {checkVerifyBtn() && (
            <Button
              fullWidth
              color={submit || status_submit ? 'success' : 'warning'}
              variant="soft"
              disabled={submit === 1 || status_submit === 1}
              onClick={isVerify ? () => verifyQuest() : null}
              sx={{
                cursor: !isVerify ? 'not-allowed' : 'pointer',
              }}
            >
              {submit || status_submit ? 'Completed' : 'Verify'}
            </Button>
          )} */}
          </Stack>}
      </Collapse>
    </Card>
  );
}

CampignQuestItem.propTypes = {
  quest: PropTypes.object,
  sx: PropTypes.object,
  checkJoin: PropTypes.string,
  campaign: PropTypes.object,
  setcheckJoined: PropTypes.object,
  // onDelete: PropTypes.func,
  // onEdit: PropTypes.func,
  // onView: PropTypes.func,
};

ShortenedUrl.propTypes = {
  url: PropTypes.string,
};
// function TimeBlock({ label, value }) {
//   return (
//     <div>
//       <Box sx={{ color: 'primary.main' }}> Verify after {value} seconds </Box>
//       {/* <Box sx={{ color: 'text.secondary', typography: 'body1' }}>{label}</Box> */}
//     </div>
//   );
// }

// TimeBlock.propTypes = {
//   label: PropTypes.string,
//   value: PropTypes.string,
// };
