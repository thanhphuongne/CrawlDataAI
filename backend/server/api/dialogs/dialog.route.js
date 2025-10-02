import { Router } from 'express';
import * as ConversationController from '../../components/ai-chat/conversation.controller';
import { isAuthorized } from '../../api/auth.middleware';

const router = new Router();

router.route('/')
  .post(isAuthorized(), ConversationController.sendMessage);

router.route('/:user_id')
  .get(isAuthorized(), ConversationController.getConversationsByUser);

export default router;