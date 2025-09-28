import { Router } from 'express';
import * as DialogController from '../../components/ai-chat/dialog.controller';
import { isAuthorized } from '../../api/auth.middleware';

const router = new Router();

router.route('/')
  .post(isAuthorized(), DialogController.sendMessage);

router.route('/:user_id')
  .get(isAuthorized(), DialogController.getDialogsByUser);

export default router;