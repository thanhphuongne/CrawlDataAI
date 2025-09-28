import { Router } from 'express';
import * as RequestController from '../../components/ai-chat/request.controller';
import { isAuthorized } from '../../api/auth.middleware';

const router = new Router();

router.route('/')
  .post(isAuthorized(), RequestController.createRequest)
  .get(isAuthorized(), RequestController.getRequestsByUser);

router.route('/:id')
  .get(RequestController.getRequest)
  .delete(isAuthorized(), RequestController.deleteRequest);

export default router;