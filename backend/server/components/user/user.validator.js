import { body, query } from 'express-validator';
import validatorErrorHandler from '../../api/validatorErrorHandler';
import { USER_MIN_PASSWORD_LENGTH, MAX_PAGE_LIMIT } from '../../constants';

export const registry = [
  body('accountName').notEmpty().withMessage('accountName is invalid'),
  // body('phone').isLength({ min: 1 }).withMessage('Phone number is required'),
  body('password').isLength({ min: USER_MIN_PASSWORD_LENGTH }).withMessage(`Password must be at least ${USER_MIN_PASSWORD_LENGTH} chars long`),
  validatorErrorHandler,
];
export const registryList = [
  body('firstName').notEmpty().withMessage('firstName is required'),
  body('lastName').notEmpty().withMessage('lastName is required'),

  body('userList')
    .isArray({ min: 1 })
    .withMessage('User list must be a non-empty array'),

  body('userList.*')
    .isString()
    .notEmpty()
    .withMessage('Each username in userList must be a valid string'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  validatorErrorHandler,
];

export const login = [
  body('accountName').notEmpty().withMessage('accountName is invalid'),
  body('password').isLength({ min: USER_MIN_PASSWORD_LENGTH }).withMessage([
    'Password must be at least %s chars long',
    [USER_MIN_PASSWORD_LENGTH]
  ]),
  validatorErrorHandler,
];

export const emailRegistry = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: USER_MIN_PASSWORD_LENGTH }).withMessage(`Password must be at least ${USER_MIN_PASSWORD_LENGTH} chars long`),
  validatorErrorHandler,
];

export const emailLogin = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: USER_MIN_PASSWORD_LENGTH }).withMessage(`Password must be at least ${USER_MIN_PASSWORD_LENGTH} chars long`),
  validatorErrorHandler,
];

export const updateUserProfile = [
  body('fullName').optional(),
  body('email').optional().isEmail().withMessage('Email is invalid'),
  body('phone').optional(),
  validatorErrorHandler,
];

export const updateUserPassword = [
  body('oldPassword').isLength({ min: USER_MIN_PASSWORD_LENGTH }).withMessage(`Old password must be at least ${USER_MIN_PASSWORD_LENGTH} chars long`),
  body('newPassword').isLength({ min: USER_MIN_PASSWORD_LENGTH }).withMessage(`New password must be at least ${USER_MIN_PASSWORD_LENGTH} chars long`),
  validatorErrorHandler,
];

export const forgotPassword = [
  body('email').isEmail().withMessage('Email is invalid'),
  validatorErrorHandler,
];

export const verifyForgotPassword = [
  body('newPassword').isLength({ min: USER_MIN_PASSWORD_LENGTH }).withMessage(`New password must be at least ${USER_MIN_PASSWORD_LENGTH} chars long`),
  validatorErrorHandler,
];

export const getUsers = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page number must be a positive integer'),
  query('rowPerPage')
    .optional()
    .isInt({ min: 1, max: MAX_PAGE_LIMIT })
    .withMessage(`Row per page must be a positive integer not larger than ${MAX_PAGE_LIMIT}`),
  validatorErrorHandler,
];
