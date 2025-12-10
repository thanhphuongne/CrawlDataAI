import { Router } from 'express';
import * as UserController from './user.controller';
import * as UserValidator from './user.validator';
import * as UserMulter from './user.multer';
import { isAuthorized, isAdmin, limitRequest } from '../../api/auth.middleware';
import { multerBodyParser, setExpressRequestTimeout } from '../../api/multerBodyParser.middleware';
import { USER_JWT_SECRET_KEY_FORGOT_PASSWORD } from '../../config';
import { authLimiter, registerLimiter, otpLimiter } from '../../api/rateLimiter';

const router = new Router();

/**
 * @swagger
 * /users/registry:
 *   post:
 *     summary: Registry new user account with basic information
 *     tags:
 *       - User
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *           example: {
 *             "firstName": "Join Smith",
*               "lastName": "03494343487",
 *             "email": "example@email.com",
 *             "password": "superStOngPassword",
 *           }
 *     responses:
 *       200:
 *         description: The user account
 *         schema:
 *           type: object
 *           example: {
 *              success: true,
 *              accessToken:"jfdshfksdhfsjkhfskfhsjk",
 *              user: {
 *                "_id": "1",
 *                "lastName": "Join Smith",
 *                "email": "example@email.com",
 *                "firstName": "03494343487",
 *                "role":"USER"
 *              }
 *           }
 *       403:
 *         description: When data cannot be process
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 msg: "Email already used, please try to login instead",
 *                 param: "email",
 *                 location: "body",
 *               }
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
router.route('/registry')
  .post(
    registerLimiter,
    UserValidator.registry,
    UserController.registry,
  );

router.route('/registryList')
  .post(
    isAdmin(),
    UserValidator.registryList,
    UserController.registryList,
  );
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login to your account
 *     tags:
 *       - User
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             accountName:
 *               type: string
 *             password:
 *               type: string
 *           example: {
 *             "accountName": "example@fpt.com",
 *             "password": "password"
 *           }
 *     responses:
 *       200:
 *         description: Your account info
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             payload:
 *               $ref: '#/definitions/User'
 *           example: {
 *             "success": true,
 *             "accessToken":"sdfhuksyhfgsiufysukfyks",
 *             "user": {
 *               "_id": "5bea5655d05143d8a576a5a9",
 *               "fullName": "Join Smith",
 *               "email": "example@email.com",
 *               "avatar": "uploads/11-7-2020/user-avatar/5bea5655d05143d8a576a5a9.png",
 *               "role": "user",
 *               "token": "JWT token"
 *             }
 *           }
 *       403:
 *         description: When data cannot be process
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/ValidatorErrorItem"
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 "msg": "The email address that you've entered doesn't match any account.",
 *                 "param": "emailNotRegistered",
 *               },
 *               {
 *                 "msg": "Email or password is not correct",
 *                 "param": "emailPassword",
 *               },
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
router.route('/login')
  .post(
    authLimiter,
    UserValidator.login,
    UserController.login,
  );

/**
 * @swagger
 * /users/verify-otp:
 *   post:
 *     summary: Verify OTP code for email verification
 *     tags:
 *       - User
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             accountName:
 *               type: string
 *             otp:
 *               type: string
 *             password:
 *               type: string
 *           example: {
 *             "accountName": "user@example.com",
 *             "otp": "123456",
 *             "password": "Password123"
 *           }
 *     responses:
 *       200:
 *         description: Verification successful
 */
router.route('/verify-otp')
  .post(
    UserValidator.verifyOTP,
    UserController.verifyOTP,
  );

/**
 * @swagger
 * /users/resend-otp:
 *   post:
 *     summary: Resend OTP verification code
 *     tags:
 *       - User
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             accountName:
 *               type: string
 *           example: {
 *             "accountName": "user@example.com"
 *           }
 *     responses:
 *       200:
 *         description: OTP resent successfully
 */
router.route('/resend-otp')
  .post(
    UserValidator.resendOTP,
    UserController.resendOTP,
  );

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get user information
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: The user information
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             payload:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 *                   description: The user avatar
 *                 email:
 *                   type: string
 *                   description: The user email
 *                 fullName:
 *                   type: string
 *                   description: The user fullName
 *                 token:
 *                   type: string
 *                   description: The user token
 *           example: {
 *             success: true,
 *             payload: {
 *               _id: "5f092acdfd2938050e3d5ed5",
 *               avatar: "uploads/user-avatar/5bea5655d05143d8a576a5d9/avatar.png",
 *               fullName: "Join Smith",
 *               email: "user@mail.com",
 *               token: 'abd.sd.wew'
 *             }
 *           }
 *       404:
 *         description: When the User not found
 *         schema:
 *           type: string
 *           example: "User not found"
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
router.route('/me')
  .get(
    isAuthorized(),
    UserController.getUser,
  );

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: identityCardFront
 *         type: file
 *         description: The user identity card front face, upload type jpg|jpeg|png
 *       - in: formData
 *         name: identityCardBack
 *         type: file
 *         description: The user identity card back face, upload type jpg|jpeg|png
 *       - in: formData
 *         name: avatar
 *         type: file
 *         description: The user avatar, upload type jpg|jpeg|png
 *       - in: formData
 *         name: cover
 *         type: file
 *         description: The user cover, upload type jpg|jpeg|png
 *       - in: formData
 *         name: data
 *         type: string
 *         description: The body stringify information
 *         default: '{"fullName": "David Hall", "email": "email@domain.com", "phone": "054888383223"}'
 *     responses:
 *       200:
 *         description: The user profile updated
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *       304:
 *         description: Not Modified
 *       403:
 *         description: When data cannot be process
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/ValidatorErrorItem"
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 msg: 'User avatar file is invalid, only image files are allowed!',
 *                 param: 'userAvatarInvalid',
 *                 location: 'body',
 *               },
 *               {
 *                 msg: 'Email is not available',
 *                 param: 'emailNotAvailable',
 *                 location: 'body',
 *               }
 *             ]
 *           }
 *       422:
 *         description: Unprocessable Entity, the data is not valid
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/ValidatorErrorItem"
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 "value": "mail@mail",
 *                 "msg": "User email is invalid",
 *                 "param": "email",
 *                 "location": "body"
 *               },
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 */
router.route('/')
  .put(
    setExpressRequestTimeout(60000),
    isAuthorized(),
    UserMulter.userProfileUploader,
    multerBodyParser,
    UserValidator.updateUserProfile,
    UserController.updateUserProfile,
  );

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Update user password
 *     tags:
 *       - User
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             currentPassword:
 *               type: string
 *             newPassword:
 *               type: string
 *           example: {
 *             "currentPassword": "superStOngPassword",
 *             "newPassword": "superStOngPassword2",
 *           }
 *     responses:
 *       200:
 *         description: Update password success
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *           example: {
 *             success: true,
 *           }
 *       403:
 *         description: When data cannot be process
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/ValidatorErrorItem"
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 "msg": "New password must be difference with current password",
 *                 param: 'passwordNotChanged',
 *               },
 *               {
 *                 "msg": "Password is not correct",
 *                 param: 'passwordIncorrect',
 *               }
 *             ]
 *           }
 *       422:
 *         description: Unprocessable Entity, the data is not valid
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/ValidatorErrorItem"
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 "value": "123",
 *                 "msg": "Current password must be at least 8 chars long",
 *                 "param": "currentPassword",
 *                 "location": "body"
 *               },
 *               {
 *                 "value": "abd",
 *                 "msg": "New password must be at least 8 chars long",
 *                 "param": "newPassword",
 *                 "location": "body"
 *               }
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
router.route('/password')
  .put(
    UserValidator.updateUserPassword,
    isAuthorized(),
    UserController.updateUserPassword,
  );

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Reset user password
 *     tags:
 *       - User
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *           example:
 *             email: example@email.com
 *     responses:
 *       200:
 *         description: Send the forgot password email success
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: "If your email is correctly, we have sent you a forgot password email, please check your inbox",
 *           }
 *       403:
 *         description: When data cannot be process
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 "msg": "Your account is not available, had been rejected or deactivated",
 *                 param: 'accountNotAvailable',
 *               },
 *             ]
 *           }
 *       422:
 *         description: Unprocessable Entity, the data is not valid
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 "value": "mail mail",
 *                 "msg": "must be an email",
 *                 "param": "email",
 *                 "location": "body"
 *               }
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
router.route('/forgot-password')
  .post(
    otpLimiter,
    UserValidator.forgotPassword,
    UserController.forgotPassword,
  );
router.route('/verify-code')
  .post(
    UserController.verifyForgotPasswordCode,
  );
/**
 * @swagger
 * /users/forgot-password/verify:
 *   post:
 *     summary: Verify user forgot password
 *     tags:
 *       - User
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             newPassword:
 *               type: string
 *           example:
 *             newPassword: superStOngPassword2
 *     responses:
 *       200:
 *         description: Password update success, please login to your account with new password
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             payload: "Password update success, please login with new password",
 *           }
 *       403:
 *         description: When data cannot be process
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/ValidatorErrorItem'
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 "msg": "You have no forgot password request",
 *                 param: 'noForgotPasswordRequest',
 *               },
 *               {
 *                 "msg": "Your verification code is expired, please request new one",
 *                 param: 'verificationCodeExpired',
 *               },
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

router.route('/forgot-password/verify')
  .post(
    UserValidator.verifyForgotPassword,
    isAuthorized(USER_JWT_SECRET_KEY_FORGOT_PASSWORD),
    UserController.verifyForgotPassword,
  );

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Admin get all users
 *     tags:
 *       - User
 *     parameters:
 *       - name: page
 *         in: query
 *         type: number
 *         description: The page want to load
 *       - name: rowPerPage
 *         in: query
 *         type: number
 *         description: The rowPerPage want to load
 *       - name: textSearch
 *         in: query
 *         type: string
 *         description: The textSearch(by email) want to load
 *     responses:
 *       200:
 *         description: The users
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             payload:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *           example: {
 *              success: true,
 *              "payload": {
 *                "data": [
 *                ],
 *                "currentPage": 1,
 *                "totalPage": 1,
 *                "totalItems": 12
 *              }
 *           }
 *       422:
 *         description: Unprocessable Entity, the data is not valid
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/ValidatorErrorItem"
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 "msg": "Page number must be a positive integer",
 *                 "param": "page",
 *               },
 *               {
 *                 "msg": "Row per page must be a positive integer not larger than 200",
 *                 "param": "rowPerPage",
 *               },
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
router.route('/')
  .get(
    isAuthorized(),
    UserValidator.getUsers,
    UserController.getUsers,
  );

/**
 * @swagger
 * /users/list-supervisors:
 *   get:
 *     summary:  get all users suppervisor
 *     tags:
 *       - User
 *     parameters:
 *       - name: page
 *         in: query
 *         type: number
 *         description: The page want to load
 *       - name: rowPerPage
 *         in: query
 *         type: number
 *         description: The rowPerPage want to load
 *       - name: textSearch
 *         in: query
 *         type: string
 *         description: The textSearch(by email) want to load
 *     responses:
 *       200:
 *         description: The users
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             payload:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *           example: {
 *              success: true,
 *              "payload": {
 *                "data": [
 *                ],
 *                "currentPage": 1,
 *                "totalPage": 1,
 *                "totalItems": 12
 *              }
 *           }
 *       422:
 *         description: Unprocessable Entity, the data is not valid
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             errors:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/ValidatorErrorItem"
 *           example: {
 *             success: false,
 *             errors: [
 *               {
 *                 "msg": "Page number must be a positive integer",
 *                 "param": "page",
 *               },
 *               {
 *                 "msg": "Row per page must be a positive integer not larger than 200",
 *                 "param": "rowPerPage",
 *               },
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */
router.route('/list-supervisors')
  .get(
    isAuthorized(),
    UserValidator.getUsers,
    UserController.getSupervisorUsers,
  );

export default router;
