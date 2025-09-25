import AWS from 'aws-sdk';
import {AWS_REGION,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY} from '../config'


AWS.config.update({
  region: AWS_REGION,
  accessKeyId:AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const sendEmail = async ({ from, to, subject, text, html }) => {
  const params = {
    Source: from || 'no-reply@yourdomain.com',
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: text ? { Data: text } : undefined,
        Html: html ? { Data: html } : undefined,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log('Email sent! Message ID:', result.MessageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
