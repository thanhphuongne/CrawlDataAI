import { Router } from 'express';
import * as UserController from './user.controller';
import { isAIAuthorized } from './aiAuth.middleware';

const router = new Router();

/**
 * @swagger
 * /ai-users/register:
 *   post:
 *     summary: Register a new AI user
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
 *             password:
 *               type: string
 *           example: {
 *             "email": "user@example.com",
 *             "password": "password123"
 *           }
 *     responses:
 *       200:
 *         description: User registered and logged in
 */
router.route('/register')
  .post(UserController.register);

/**
 * @swagger
 * /ai-users/login:
 *   post:
 *     summary: Login AI user
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
 *             password:
 *               type: string
 *           example: {
 *             "email": "user@example.com",
 *             "password": "password123"
 *           }
 *     responses:
 *       200:
 *         description: User logged in
 */
router.route('/login')
  .post(UserController.login);

/**
 * @swagger
 * /ai-users/me:
 *   get:
 *     summary: Get current user info
 *     tags:
 *       - AI Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 */
router.route('/me')
  .get(isAIAuthorized(), UserController.getMe);

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