import { Router } from 'express';
import * as UserController from '../../components/user/user.controller';
import * as UserValidator from '../../components/user/user.validator';

const router = new Router();

router.route('/register')
  .post(
    UserValidator.emailRegistry,
    UserController.emailRegister,
  );

router.route('/verify-otp')
  .post(
    UserValidator.verifyOTP,
    UserController.verifyOTP,
  );

router.route('/resend-otp')
  .post(
    UserValidator.resendOTP,
    UserController.resendOTP,
  );

router.route('/login')
  .post(
    UserValidator.emailLogin,
    UserController.emailLogin,
  );

router.route('/forgot-password')
  .post(UserController.forgotPassword);

router.route('/reset-password')
  .post(UserController.verifyForgotPassword);

export default router;