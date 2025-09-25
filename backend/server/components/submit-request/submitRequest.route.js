import { Router } from 'express';
import * as UserController from './submitRequest.controller';
import * as UserValidator from './submitRequest.validator';
import * as UserMulter from './submitRequest.multer';
import { isAuthorized, isAdmin,isSupervisor, isSupervisorOrAdmin } from '../../api/auth.middleware';
import { multerBodyParser, setExpressRequestTimeout } from '../../api/multerBodyParser.middleware';
import { USER_JWT_SECRET_KEY_FORGOT_PASSWORD } from '../../config';
import * as SubmitRequest from './submitRequest.controller';
import * as SubmitRequestValidator from './submitRequest.validator';

const router = new Router();
/**
 * @swagger
 * /submit-request:
 *   post:
 *     summary: Create submit request
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             accountName:
 *               type: string
 *             descriptions:
 *               type: string
 *             approver:
 *               type: string
 *             supervisor:
 *               type: integer
 *             category:
 *               type: integer
 *             hasNotifyMail:
 *               type: boolean
 *           example: {
 *             "accountName": "Join Smith",
 *             "descriptions": "example@email.com",
 *             "approver": "tienpm3",
 *             "supervisor": 1,
 *             "category": 1,
 *             "hasNotifyMail":true
 *           }
 *     responses:
 *       200:
 *         description: The submit Request successfully
 *         schema:
 *           type: object
 *           example: {
 *              success: true,
 *              payload: {
 *       "suppervisorApproved": false,
 *        "approverApproved": false,
 *        "status": "WAITING",
 *        "id": 3,
 *        "accountName": "tienpm3",
 *        "descriptions": "params.descriptions",
 *        "supervisor": 1,
 *        "categoryId": 1,
 *        "hasNotifyMail": true,
 *        "createBy": 1
 *           
 *              }
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              success: false
 *           }
 */
router.route('/')
  .post(
    isAuthorized(),
    SubmitRequest.submit,
    SubmitRequestValidator.summit
  );

/**
 * @swagger
 * /submit-request:
 *   put:
 *     summary: Update submit request
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             accountName:
 *               type: string
 *             descriptions:
 *               type: string
 *             supervisor:
 *               type: integer
 *             category:
 *               type: integer
 *             hasNotifyMail:
 *               type: boolean
 *           example: {
 *             "id":1,
 *             "accountName": "Join Smith",
 *             "descriptions": "example@email.com",
 *             "supervisor": 1,
 *             "category": 1,
 *             "hasNotifyMail":true
 *           }
 *     responses:
 *       200:
 *         description: The submit Request successfully
 *         schema:
 *           type: object
 *           example: {
 *              success: true,
 *              "msg": "Update success"
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              success: false
 *           }
 */
router.route('/')
  .put(
    isAuthorized(),
    SubmitRequest.UpdateSubmit,
    SubmitRequestValidator.updatesummit
  );
/**
 * @swagger
 * /submit-request/list:
 *   get:
 *     summary: Get list submit request
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: pagenumber
 *         in: query
 *         description: The page number to retrieve
 *         required: false
 *         type: integer
 *         default: 1
 *       - name: pagesize
 *         in: query
 *         description: The number of items per page
 *         required: false
 *         type: integer
 *         default: 10
 *     responses:
 *       200:
 *         description: The user information
 *         schema:
 *           type: object
 *           properties:
 *             pageNumber:
 *               type: integer
 *               description: The current page number
 *             pageSize:
 *               type: integer
 *               description: The number of items per page
 *             totalItems:
 *               type: integer
 *               description: The total number of items
 *             totalPages:
 *               type: integer
 *               description: The total number of pages
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   accountName:
 *                     type: string
 *                   descriptions:
 *                     type: string
 *                   supervisor:
 *                     type: integer
 *                   categoryId:
 *                     type: integer
 *                   hasNotifyMail:
 *                     type: boolean
 *                   suppervisorApproved:
 *                     type: boolean
 *                   approverApproved:
 *                     type: boolean
 *                   status:
 *                     type: string
 *                   createBy:
 *                     type: integer
 *           example: {
 *             pageNumber: 1,
 *             pageSize: 10,
 *             totalItems: 6,
 *             totalPages: 1,
 *             data: [
 *               {
 *                 id: 2,
 *                 accountName: "tienpm3",
 *                 descriptions: "params.descriptions",
 *                 supervisor: 1,
 *                 categoryId: 1,
 *                 hasNotifyMail: true,
 *                 suppervisorApproved: false,
 *                 approverApproved: false,
 *                 status: "WAITING",
 *                 createBy: 1
 *               }
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              success: false
 *           }
 */
  router.route('/list')
  .get(
    isAuthorized(),
    SubmitRequest.getListSubmit
  );
/**
 * @swagger
 * /submit-request/ranking:
 *   get:
 *     summary: Get ranking of submit requests
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: pagenumber
 *         in: query
 *         description: The page number to retrieve
 *         required: false
 *         type: integer
 *         default: 1
 *       - name: pagesize
 *         in: query
 *         description: The number of items per page
 *         required: false
 *         type: integer
 *         default: 6
 *       - name: startdate
 *         in: query
 *         description: The start date for filtering rankings (YYYY-MM-DD)
 *         required: true
 *         type: string
 *         format: date
 *         default: '2025-01-01T00:00:00.000Z'
 *       - name: enddate
 *         in: query
 *         description: The end date for filtering rankings (YYYY-MM-DD)
 *         required: true
 *         type: string
 *         format: date
 *         default: '2025-01-30T00:00:00.000Z'
 *     responses:
 *       200:
 *         description: The ranking data
 *         schema:
 *           type: object
 *           properties:
 *             pageNumber:
 *               type: integer
 *               description: The current page number
 *             pageSize:
 *               type: integer
 *               description: The number of items per page
 *             totalItems:
 *               type: integer
 *               description: The total number of items
 *             totalPages:
 *               type: integer
 *               description: The total number of pages
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   accountName:
 *                     type: string
 *                     description: The account name of the user
 *                   totalScore:
 *                     type: string
 *                     description: The total score of the user
 *                   rank:
 *                     type: integer
 *                     description: The rank of the user
 *           example: {
 *             pageNumber: 1,
 *             pageSize: 6,
 *             totalItems: 1,
 *             totalPages: 1,
 *             data: [
 *               {
 *                 accountName: "tienpm3",
 *                 totalScore: "800",
 *                 rank: 1
 *               }
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              success: false
 *           }
 */
  router.route('/ranking')
  .get(
    SubmitRequest.getListRank
  );

  router.route('/comment')
  .post(
    isAuthorized(),
    SubmitRequest.comments,
    SubmitRequestValidator.comment
  );
  router.route('/comment')
  .get(
    isAuthorized(),
    SubmitRequest.getComments,
  );
/**
 * @swagger
 * /submit-request/supervisor-approve:
 *   post:
 *     summary: approve submit request
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             approve:
 *               type: boolean
 *             descriptions:
 *               type: string
 *           example: {
 *             "id": 1,
 *             "approve": true,
 *             "descriptions": "chi tiết là gì "
 *           }
 *     responses:
 *       200:
 *         description: The submit Request successfully
 *         schema:
 *           type: object
 *           example: {
 *              "success": true,
 *              "msg": "Success"
 *           }
 *       401:
 *         description: Internal server error
 *         schema:
 *           type: string
 *           example: "Internal server error"
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              "success": true
 *           }
 */
  router.route('/supervisor-approve')
  .post(
    isAuthorized(),
    SubmitRequest.Approve,
    SubmitRequestValidator.approve
  );


/**
 * @swagger
 * /submit-request/list-assign:
 *   get:
 *     summary: Get ranking of submit requests
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: pagenumber
 *         in: query
 *         description: The page number to retrieve
 *         required: false
 *         type: integer
 *         default: 1
 *       - name: pagesize
 *         in: query
 *         description: The number of items per page
 *         required: false
 *         type: integer
 *         default: 6
 *       - name: status
 *         in: query
 *         description: WAITING/CONFIRM/REJECT
 *         required: false
 *         type: string
 *         default: 
 *       - name: type
 *         in: query
 *         description: BIZDEV
 *         required: false
 *         type: string
 *         default: 
 *       - name: approver
 *         in: query
 *         description: tienpm
 *         required: false
 *         type: string
 *         default: 
 *       - name: supervisor
 *         in: query
 *         description: tienpm
 *         required: false
 *         type: string
 *         default: 
 *     responses:
 *       200:
 *         description: The fitter data
 *         schema:
 *           type: object
 *           properties:
 *             pageNumber:
 *               type: integer
 *               description: The current page number
 *             pageSize:
 *               type: integer
 *               description: The number of items per page
 *             totalItems:
 *               type: integer
 *               description: The total number of items
 *             totalPages:
 *               type: integer
 *               description: The total number of pages
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   accountName:
 *                     type: string
 *                     description: The account name of the user
 *                   totalScore:
 *                     type: string
 *                     description: The total score of the user
 *                   rank:
 *                     type: integer
 *                     description: The rank of the user
 *           example: {
 *             pageNumber: 1,
 *             pageSize: 6,
 *             totalItems: 1,
 *             totalPages: 1,
 *             data: [
 *               {
 *                 accountName: "tienpm3",
 *                 totalScore: "800",
 *                 rank: 1
 *               }
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              success: false
 *           }
 */
router.route('/list-assign')
.get(
  isAuthorized(),
  SubmitRequest.getListAssign
);

/**
 * @swagger
 * /submit-request/admin-approve:
 *   post:
 *     summary: admin approve submit request
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             approve:
 *               type: boolean
 *             descriptions:
 *               type: string
 *           example: {
 *             "id": 1,
 *             "approve": true,
 *             "descriptions": "chi tiết là gì "
 *           }
 *     responses:
 *       200:
 *         description: The submit Request successfully
 *         schema:
 *           type: object
 *           example: {
 *              "success": true,
 *              "msg": "Success"
 *           }
 *       401:
 *         description: Internal server error
 *         schema:
 *           type: string
 *           example: "Internal server error"
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              "success": true
 *           }
 */
router.route('/admin-approve')
.post(
  isAdmin(),
  SubmitRequest.adminApprove,
  SubmitRequestValidator.approve
);

/**
 * @swagger
 * /submit-request/approver-approve:
 *   post:
 *     summary: admin approve submit request
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             approve:
 *               type: boolean
 *             descriptions:
 *               type: string
 *           example: {
 *             "id": 1,
 *             "approve": true,
 *             "descriptions": "chi tiết là gì "
 *           }
 *     responses:
 *       200:
 *         description: The submit Request successfully
 *         schema:
 *           type: object
 *           example: {
 *              "success": true,
 *              "msg": "Success"
 *           }
 *       401:
 *         description: Internal server error
 *         schema:
 *           type: string
 *           example: "Internal server error"
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              "success": true
 *           }
 */
router.route('/approver-approve')
.post(
  isAuthorized(),
  SubmitRequest.ApproverApprove,
  SubmitRequestValidator.approve
);

/**
 * @swagger
 * /submit-request/list-all:
 *   get:
 *     summary: Get ranking of submit requests
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: pagenumber
 *         in: query
 *         description: The page number to retrieve
 *         required: false
 *         type: integer
 *         default: 1
 *       - name: pagesize
 *         in: query
 *         description: The number of items per page
 *         required: false
 *         type: integer
 *         default: 6
 *       - name: status
 *         in: query
 *         description: WAITING/CONFIRM/REJECT
 *         required: false
 *         type: string
 *         default: 
 *       - name: type
 *         in: query
 *         description: BIZDEV
 *         required: false
 *         type: string
 *         default: 
 *       - name: approver
 *         in: query
 *         description: tienpm
 *         required: false
 *         type: string
 *         default: 
 *       - name: supervisor
 *         in: query
 *         description: tienpm
 *         required: false
 *         type: string
 *         default: 
 *     responses:
 *       200:
 *         description: The fitter data
 *         schema:
 *           type: object
 *           properties:
 *             pageNumber:
 *               type: integer
 *               description: The current page number
 *             pageSize:
 *               type: integer
 *               description: The number of items per page
 *             totalItems:
 *               type: integer
 *               description: The total number of items
 *             totalPages:
 *               type: integer
 *               description: The total number of pages
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   accountName:
 *                     type: string
 *                     description: The account name of the user
 *                   totalScore:
 *                     type: string
 *                     description: The total score of the user
 *                   rank:
 *                     type: integer
 *                     description: The rank of the user
 *           example: {
 *             pageNumber: 1,
 *             pageSize: 6,
 *             totalItems: 1,
 *             totalPages: 1,
 *             data: [
 *               {
 *                 accountName: "tienpm3",
 *                 totalScore: "800",
 *                 rank: 1
 *               }
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              success: false
 *           }
 */
router.route('/list-all')
.get(
  isAdmin(),
  SubmitRequest.getListAll
);
router.route('/export-data')
.get(
  isAdmin(),
  SubmitRequest.exportData
);

/**
 * @swagger
 * /submit-request/list-approver:
 *   get:
 *     summary: Get list-approver of submit requests
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: pagenumber
 *         in: query
 *         description: The page number to retrieve
 *         required: false
 *         type: integer
 *         default: 1
 *       - name: pagesize
 *         in: query
 *         description: The number of items per page
 *         required: false
 *         type: integer
 *         default: 6
 *       - name: status
 *         in: query
 *         description: WAITING/CONFIRM/REJECT
 *         required: false
 *         type: string
 *         default: 
 *       - name: type
 *         in: query
 *         description: BIZDEV
 *         required: false
 *         type: string
 *         default: 
 *       - name: approver
 *         in: query
 *         description: tienpm
 *         required: false
 *         type: string
 *         default: 
 *       - name: supervisor
 *         in: query
 *         description: tienpm
 *         required: false
 *         type: string
 *         default: 
 *     responses:
 *       200:
 *         description: The fitter data
 *         schema:
 *           type: object
 *           properties:
 *             pageNumber:
 *               type: integer
 *               description: The current page number
 *             pageSize:
 *               type: integer
 *               description: The number of items per page
 *             totalItems:
 *               type: integer
 *               description: The total number of items
 *             totalPages:
 *               type: integer
 *               description: The total number of pages
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   accountName:
 *                     type: string
 *                     description: The account name of the user
 *                   totalScore:
 *                     type: string
 *                     description: The total score of the user
 *                   rank:
 *                     type: integer
 *                     description: The rank of the user
 *           example: {
 *             pageNumber: 1,
 *             pageSize: 6,
 *             totalItems: 1,
 *             totalPages: 1,
 *             data: [
 *               {
 *                 accountName: "tienpm3",
 *                 totalScore: "800",
 *                 rank: 1
 *               }
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              success: false
 *           }
 */
router.route('/list-approver')
.get(
  isAuthorized(),
  SubmitRequest.getListSubmitApprover
);

/**
 * @swagger
 * /submit-request/sumary:
 *   get:
 *     summary: Get ranking of submit requests
 *     tags:
 *       - submitRequest
 *     parameters:
 *       - name: pagenumber
 *         in: query
 *         description: The page number to retrieve
 *         required: false
 *         type: integer
 *         default: 1
 *       - name: pagesize
 *         in: query
 *         description: The number of items per page
 *         required: false
 *         type: integer
 *         default: 6
 *       - name: status
 *         in: query
 *         description: WAITING/CONFIRM/REJECT
 *         required: false
 *         type: string
 *         default: 
 *       - name: type
 *         in: query
 *         description: BIZDEV
 *         required: false
 *         type: string
 *         default: 
 *       - name: approver
 *         in: query
 *         description: tienpm
 *         required: false
 *         type: string
 *         default: 
 *       - name: supervisor
 *         in: query
 *         description: tienpm
 *         required: false
 *         type: string
 *         default: 
 *     responses:
 *       200:
 *         description: The fitter data
 *         schema:
 *           type: object
 *           properties:
 *             pageNumber:
 *               type: integer
 *               description: The current page number
 *             pageSize:
 *               type: integer
 *               description: The number of items per page
 *             totalItems:
 *               type: integer
 *               description: The total number of items
 *             totalPages:
 *               type: integer
 *               description: The total number of pages
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   accountName:
 *                     type: string
 *                     description: The account name of the user
 *                   totalScore:
 *                     type: string
 *                     description: The total score of the user
 *                   rank:
 *                     type: integer
 *                     description: The rank of the user
 *           example: {
 *             pageNumber: 1,
 *             pageSize: 6,
 *             totalItems: 1,
 *             totalPages: 1,
 *             data: [
 *               {
 *                 accountName: "tienpm3",
 *                 totalScore: "800",
 *                 rank: 1
 *               }
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: object
 *           example: {
 *              success: false
 *           }
 */
router.route('/summary')
.get(
  isAuthorized(),
  SubmitRequest.sumary
);
router.route('/count-waiting-confirm')
  .get(
    isAuthorized(),
    SubmitRequest.countWaitingConfirmHandler
  );
export default router;
