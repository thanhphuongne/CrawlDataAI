import { Router } from 'express';
import { isAdmin, isAuthorized } from '../../api/auth.middleware';
import * as CategoryController from './category.controller';
import * as CategoryValidator from './category.validator';

const router = new Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get categories
 *     tags:
 *       - Category
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
 *     responses:
 *       200:
 *         description: The categories
 *         schema:
 *           type: object
 *           properties:
 *             success:
 *               type: boolean
 *             payload:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Category'
 *           example: {
 *              success: true,
 *              "payload": {
 *                "data": [
 *                ],
 *              }
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
        CategoryController.getCategories,
    );

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create new category
 *     tags:
 *       - Category
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             score:
 *               type: integer
 *             type:
 *               type: string
 *           example: {
 *             "name":"Tham gia tạo Proposal dự án >2M",
 *             "description": "Tham gia tạo Proposal dự án >2M",
 *             "score":200,
 *             "type":"bizdev"
 *             }
 *     responses:
 *       200:
 *         description: The category created
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
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
 *                 "value": "",
 *                 "msg": "name is invalid",
 *                 "param": "name",
 *                 "location": "body"
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
    .post(
        isAdmin(),
        CategoryValidator.createCategory,
        CategoryController.createCategory,
    );

    /**
 * @swagger
 * /type-categories:
 *   post:
 *     summary: Create new category
 *     tags:
 *       - Category
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             approver:
 *               type: string
 *           example: {
 *             "name":"Tham gia tạo Proposal dự án >2M",
 *             "description": "Tham gia tạo Proposal dự án >2M",
 *             "score":200,
 *             "type":"bizdev"
 *             }
 *     responses:
 *       200:
 *         description: The category created
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
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
 *                 "value": "",
 *                 "msg": "name is invalid",
 *                 "param": "name",
 *                 "location": "body"
 *               },
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

router.route('/type-categories')
.post(
    isAdmin(),
    CategoryValidator.createTypeCategory,
    CategoryController.createTypeCategory,
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update category
 *     tags:
 *       - Category
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the category to retrieve
 *         type: string
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             description:
 *               type: string
 *             score:
 *               type: integer
 *             type:
 *               type: string
 *           example: {
 *             "name":"Tham gia tạo Proposal dự án >2M",
 *             "description": "Tham gia tạo Proposal dự án >2M",
 *             "score":200,
 *             "type":"bizdev"
 *             }
 *     responses:
 *       200:
 *         description: The category updated
 *         schema:
 *           type: object
 *           example: {
 *             success: true,
 *             msg: "Success"
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
 *                 "value": "",
 *                 "msg": "Category id is required",
 *                 "param": "id",
 *                 "location": "param"
 *               },
 *               {
 *                 "value": "",
 *                 "msg": "name is invalid",
 *                 "param": "name",
 *                 "location": "body"
 *               },
 *             ]
 *           }
 *       500:
 *         description: When got server exception
 *         schema:
 *           type: string
 *           example: "Internal server error"
 */

router.route('/:id')
    .put(
        isAdmin(),
        CategoryValidator.updateCategory,
        CategoryController.updateCategory,
    );
export default router;
