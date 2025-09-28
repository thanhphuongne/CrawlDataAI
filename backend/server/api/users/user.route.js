import { Router } from 'express';
import * as UserController from '../../components/user/user.controller';
import { isAuthorized } from '../../api/auth.middleware';

const router = new Router();

router.route('/:id')
  .post(isAuthorized(), UserController.updateUserProfileById);

export default router;