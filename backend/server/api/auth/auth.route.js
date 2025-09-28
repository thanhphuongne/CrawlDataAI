import { Router } from 'express';
import * as UserController from '../../components/user/user.controller';
import * as UserValidator from '../../components/user/user.validator';

const router = new Router();

router.route('/register')
  .post(
    UserValidator.emailRegistry,
    UserController.emailRegister,
  );

router.route('/login')
  .post(
    UserValidator.emailLogin,
    UserController.emailLogin,
  );

export default router;