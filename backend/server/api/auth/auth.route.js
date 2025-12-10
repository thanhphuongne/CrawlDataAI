import { Router } from 'express';
import * as UserController from '../../components/user/user.controller';
import * as UserValidator from '../../components/user/user.validator';
import { authLimiter, registerLimiter, otpLimiter } from '../rateLimiter';

const router = new Router();

router.route('/register')
  .post(
    registerLimiter,
    UserValidator.emailRegistry,
    UserController.emailRegister,
  );

router.route('/verify-otp')
  .post(
    otpLimiter,
    UserValidator.verifyOTP,
    UserController.verifyOTP,
  );

router.route('/resend-otp')
  .post(
    otpLimiter,
    UserValidator.resendOTP,
    UserController.resendOTP,
  );

router.route('/login')
  .post(
    authLimiter,
    UserValidator.emailLogin,
    UserController.emailLogin,
  );

router.route('/logout')
  .post((req, res) => {
    // Clear the HttpOnly cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });

router.route('/forgot-password')
  .post(
    otpLimiter,
    UserController.forgotPassword
  );

router.route('/reset-password')
  .post(
    authLimiter,
    UserController.verifyForgotPassword
  );

export default router;