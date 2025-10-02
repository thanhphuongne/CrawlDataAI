import { Router } from 'express';
import * as ConversationController from './conversation.controller';
import { isAuthorized } from '../../api/auth.middleware';

const router = new Router();

/**
 * @swagger
 * /ai-conversations:
 *   post:
 *     summary: Create a new conversation
 *     tags:
 *       - AI Conversations
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: integer
 *             request_id:
 *               type: integer
 *           example: {
 *             "user_id": 1,
 *             "request_id": 1
 *           }
 *     responses:
 *       200:
 *         description: Conversation created
 */
router.route('/')
  .post(isAuthorized(), ConversationController.createConversation);

/**
 * @swagger
 * /ai-conversations/{id}:
 *   get:
 *     summary: Get conversation by ID
 *     tags:
 *       - AI Conversations
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Conversation data
 */
router.route('/:id')
  .get(isAuthorized(), ConversationController.getConversation);

/**
 * @swagger
 * /ai-conversations/user/{user_id}:
 *   get:
 *     summary: Get conversations by user ID
 *     tags:
 *       - AI Conversations
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: List of conversations
 */
router.route('/user/:user_id')
  .get(isAuthorized(), ConversationController.getConversationsByUser);

/**
 * @swagger
 * /ai-conversations/{id}/message:
 *   post:
 *     summary: Add message to conversation
 *     tags:
 *       - AI Conversations
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             role:
 *               type: string
 *             content:
 *               type: string
 *           example: {
 *             "role": "user",
 *             "content": "Hello AI"
 *           }
 *     responses:
 *       200:
 *         description: Message added
 */
router.route('/:id/message')
  .post(isAuthorized(), ConversationController.addMessage);

/**
 * @swagger
 * /ai-conversations/user/{user_id}/request/{request_id}:
 *   get:
 *     summary: Get conversation by user and request
 *     tags:
 *       - AI Conversations
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: request_id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Conversation data
 */
router.route('/user/:user_id/request/:request_id')
  .get(isAuthorized(), ConversationController.getConversationByUserAndRequest);

export default router;