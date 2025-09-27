import { Router } from 'express';
import * as DialogController from './dialog.controller';
import { isAIAuthorized } from './aiAuth.middleware';

const router = new Router();

/**
 * @swagger
 * /ai-dialogs:
 *   post:
 *     summary: Create a new dialog
 *     tags:
 *       - AI Dialogs
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
 *         description: Dialog created
 */
router.route('/')
  .post(isAIAuthorized(), DialogController.createDialog);

/**
 * @swagger
 * /ai-dialogs/{id}:
 *   get:
 *     summary: Get dialog by ID
 *     tags:
 *       - AI Dialogs
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Dialog data
 */
router.route('/:id')
  .get(isAIAuthorized(), DialogController.getDialog);

/**
 * @swagger
 * /ai-dialogs/user/{user_id}:
 *   get:
 *     summary: Get dialogs by user ID
 *     tags:
 *       - AI Dialogs
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: List of dialogs
 */
router.route('/user/:user_id')
  .get(isAIAuthorized(), DialogController.getDialogsByUser);

/**
 * @swagger
 * /ai-dialogs/{id}/message:
 *   post:
 *     summary: Add message to dialog
 *     tags:
 *       - AI Dialogs
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
  .post(isAIAuthorized(), DialogController.addMessage);

/**
 * @swagger
 * /ai-dialogs/user/{user_id}/request/{request_id}:
 *   get:
 *     summary: Get dialog by user and request
 *     tags:
 *       - AI Dialogs
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
 *         description: Dialog data
 */
router.route('/user/:user_id/request/:request_id')
  .get(isAIAuthorized(), DialogController.getDialogByUserAndRequest);

export default router;