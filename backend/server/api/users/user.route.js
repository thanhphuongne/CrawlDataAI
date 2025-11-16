import { Router } from 'express';
import * as UserController from '../../components/user/user.controller';
import { isAuthorized } from '../../api/auth.middleware';

const router = new Router();

router.route('/:id')
  .get(isAuthorized(), UserController.getUser)
  .post(isAuthorized(), UserController.updateUserProfileById)
  .delete(isAuthorized(), UserController.deleteUser);

router.route('/:id/password')
  .post(isAuthorized(), UserController.updateUserPassword);

export default router;