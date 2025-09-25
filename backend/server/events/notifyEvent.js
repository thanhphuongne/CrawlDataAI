import { EventEmitter } from 'events';
import sendEmail from '../util/sendMail';
import { FROMEMAIL } from '../config';
import fs from 'fs';

import path from 'path';
import ejs from 'ejs'; // Thêm import thư viện EJS
// Tạo đường dẫn tuyệt đối tới file HTML

// Hàm tải và thay thế nội dung template
// Hàm tải và render template với EJS
const loadTemplate = (filePath, replacements) => {
  const template = fs.readFileSync(filePath, 'utf-8');
  return ejs.render(
    template,
    replacements,
    { delimiters: ['{{', '}}'] } // Giữ nguyên cú pháp template
  );
};
// Tạo một instance của EventEmitter
const eventEmitter = new EventEmitter();
// Đăng ký sự kiện 'processData'
eventEmitter.on('sentEmailNotify', async (data) => {
  try{

 
  console.log('Process Data Event Triggered:', data.email);



  const templatePath = path.resolve(__dirname, '../templates/' + data.template + ".ejs");

  let htmlBody = null;

  if (data.template == "NotifyApproverSupervisor") {
    const replacements = {
      accountName: data.dataSubmit.accountName,
      descriptions: data.dataSubmit.descriptions,
      userCreate: data.dataSubmit.userCreate,
      category: data.dataSubmit.name,
      score: data.dataSubmit.score,
      supervisor: data.dataSubmit.accountName,
      userCreate: data.dataSubmit.userCreate
    };

    htmlBody = loadTemplate(templatePath, replacements);
    if (htmlBody) {
      await sendEmail({
        from: FROMEMAIL,
        to: data.email,
        cc: ['tienpm3@fpt.com', 'chiennh2@fpt.com'],
        subject: '[Qai-scoring] Notification of a New Submission for Processing',
        text: '[Qai-scoring] Notification of a New Submission for Processing',
        html: htmlBody,
      });
      console.log('Email sent successfully.');
    }
  }
  // else if (data.template == "NotifyApproverSupervisor") {

  //   const replacements = {
  //     submitId: data.dataSubmit.dataValues.id,
  //     category: data.dataSubmit.dataValues.category.dataValues.name,
  //     score: data.dataSubmit.dataValues.category.dataValues.score,
  //     descriptions: data.dataSubmit.dataValues.descriptions,
  //     suppervisorApproved: data.dataSubmit.dataValues.suppervisorApproved,
  //     suppervisor: data.dataSubmit.dataValues.supervisorInfo.dataValues.email,
  //     accountName: data.dataSubmit.dataValues.accountName,
  //     userCreate: data.dataSubmit.dataValues.userCreate.dataValues.email,
  //   };
  //   htmlBody = loadTemplate(templatePath, replacements);
  //   if (htmlBody) {
  //     await sendEmail({
  //       from: FROMEMAIL,
  //       to: data.email,
  //       subject: '[Qai-scoring] Notification of a New Submission for Processing',
  //       text: '[Qai-scoring] Notification of a New Submission for Processing',
  //       html: htmlBody,
  //     });
  //     console.log('Email sent successfully.');
  //   }
  // }
  else if (data.template == "NotifySubmiter" || data.template == "NotifySubmiterFromApprover") {
    const replacements = {
      submitId: data.dataSubmit.submitId,
      category: data.dataSubmit.name,
      descriptions: data.dataSubmit.descriptions,
      suppervisorApproved: data.dataSubmit.suppervisorApproved,
      approverApproved: data.dataSubmit.approverApproved,
      supervisor: data.dataSubmit.accountName,
      comment: data.dataSubmit.comment || '',
      approver: data.dataSubmit.approver,
      userCreate: data.dataSubmit.userCreate
    };

    htmlBody = loadTemplate(templatePath, replacements);
    let subject_ = '[Qai-scoring] Contribution Processing Update';
    if (htmlBody) {
      await sendEmail({
        from: FROMEMAIL,
        to: data.email,
        subject: subject_,
        text: '[Qai-scoring] Contribution Processing Update',
        html: htmlBody,
      });
      console.log('Email sent successfully.');
    }
  }


  if (data.template == "ForgotPassWord") {
    const replacements = {
      accountName: data.dataSubmit.accountName,
      descriptions: data.dataSubmit.descriptions,
      userCreate: data.dataSubmit.userCreate,
    };

    htmlBody = loadTemplate(templatePath, replacements);
    if (htmlBody) {
      await sendEmail({
        from: FROMEMAIL,
        to: data.email,
        //cc: ['tienpm3@fpt.com', 'chiennh2@fpt.com'],
        subject: '[Qai-scoring] Notification of a New Submission for Processing',
        text: '[Qai-scoring] Notification of a New Submission for Processing',
        html: htmlBody,
      });
      console.log('Email sent successfully.');
    }
  }

  if (data.template == "VerifyForgotPasswordCode") {
    const replacements = {
      accountName: data.dataSubmit.accountName,
      descriptions: data.dataSubmit.descriptions,
      userCreate: data.dataSubmit.userCreate,
    };

    htmlBody = loadTemplate(templatePath, replacements);
    if (htmlBody) {
      await sendEmail({
        from: FROMEMAIL,
        to: data.email,
        //cc: ['tienpm3@fpt.com', 'chiennh2@fpt.com'],
        subject: '[Qai-scoring] Notification of a New Submission for Processing',
        text: '[Qai-scoring] Notification of a New Submission for Processing',
        html: htmlBody,
      });
      console.log('Email sent successfully.');
    }
  }
} catch (e) {
  console.log('Email sent failed.',e);
}
  // Xử lý logic tại đây
});

// Xuất module để sử dụng
export default eventEmitter;
