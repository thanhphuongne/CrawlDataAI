import { Router } from 'express';
import * as RequestController from './request.controller';
import { isAuthorized } from '../../api/auth.middleware';

const router = new Router();

/**
 * @swagger
 * /ai-requests:
 *   post:
 *     summary: Create a new request
 *     tags:
 *       - AI Requests
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: integer
 *             requirement:
 *               type: string
 *           example: {
 *             "user_id": 1,
 *             "requirement": "Crawl AI news from nytimes.com"
 *           }
 *     responses:
 *       200:
 *         description: Request created
 */
router.route('/')
  .post(isAuthorized(), RequestController.createRequest);

/**
 * @swagger
 * /ai-requests/{id}:
 *   get:
 *     summary: Get request by ID
 *     tags:
 *       - AI Requests
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Request data
 */
router.route('/:id')
  .get(RequestController.getRequest);

/**
 * @swagger
 * /ai-requests/user/{user_id}:
 *   get:
 *     summary: Get requests by user ID
 *     tags:
 *       - AI Requests
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: List of requests
 */
router.route('/user/:user_id')
  .get(isAuthorized(), RequestController.getRequestsByUser);

/**
 * @swagger
 * /ai-requests/{id}/status:
 *   put:
 *     summary: Update request status
 *     tags:
 *       - AI Requests
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [pending, processing, completed, failed]
 *             export_path:
 *               type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.route('/:id/status')
  .put(isAuthorized(), RequestController.updateRequestStatus);

export default router;