import { body, query } from 'express-validator';
import validatorErrorHandler from '../../api/validatorErrorHandler';
import { USER_MIN_PASSWORD_LENGTH, MAX_PAGE_LIMIT } from '../../constants';

export const summit = [
  body('accountName').isLength({ min: 1 }).withMessage('accountName is required'),
  body('descriptions').isLength({ min: 1 }).withMessage('descriptions is required'),
  body('approver').isLength({ min: 1 }).withMessage('approver is required'),
  body('supervisor').isNumeric().withMessage('supervisor is required'),
  body('category').isNumeric().withMessage('Category is required'),
  body('hasNotifyMail').isBoolean().withMessage('hasNotifyMail is invalid'),
  validatorErrorHandler,
];

export const updatesummit = [
  body('id').isLength({ min: 1 }).withMessage('id is required'),
  body('accountName').isLength({ min: 1 }).withMessage('accountName is required'),
  body('descriptions').isLength({ min: 1 }).withMessage('descriptions is required'),
  body('approver').isLength({ min: 1 }).withMessage('approver is required'),
  body('supervisor').isNumeric().withMessage('supervisor is required'),
  body('category').isNumeric().withMessage('Category is required'),
  body('hasNotifyMail').isBoolean().withMessage('hasNotifyMail is invalid'),
  validatorErrorHandler,
];

export const comment = [
  body('id').isLength({ min: 1 }).withMessage('id is required'),
  body('descriptions').isLength({ min: 1 }).withMessage('descriptions is required'),
  validatorErrorHandler,
];

export const approve = [
  body('id').isLength({ min: 1 }).withMessage('id is required'),
  body('approve').isBoolean().withMessage('approved is invalid'),
  body('descriptions').isLength({ min: 1 }).withMessage('descriptions is required'),
  validatorErrorHandler,
];