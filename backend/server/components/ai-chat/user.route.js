import { Router } from 'express';
import * as UserController from './user.controller';

const router = new Router();

/**
 * @swagger
 * /ai-users:
 *   post:
 *     summary: Create a new AI user
 *     tags:
 *       - AI Users
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *           example: {
 *             "email": "user@example.com"
 *           }
 *     responses:
 *       200:
 *         description: User created
 */
router.route('/')
  .post(UserController.createUser);

/**
 * @swagger
 * /ai-users/by-email:
 *   get:
 *     summary: Get user by email
 *     tags:
 *       - AI Users
 *     parameters:
 *       - name: email
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User data
 */
router.route('/by-email')
  .get(UserController.getUserByEmail);

export default router;