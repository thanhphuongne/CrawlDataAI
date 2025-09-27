import { Router } from 'express';
import * as CrawledDataController from './crawledData.controller';

const router = new Router();

/**
 * @swagger
 * /ai-crawled-data:
 *   post:
 *     summary: Create crawled data
 *     tags:
 *       - AI Crawled Data
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             request_id:
 *               type: integer
 *             url:
 *               type: string
 *             data:
 *               type: array
 *               items:
 *                 type: object
 *             validated:
 *               type: boolean
 *           example: {
 *             "request_id": 1,
 *             "url": "https://nytimes.com",
 *             "data": [{"title": "AI News", "date": "2023-01-01"}],
 *             "validated": false
 *           }
 *     responses:
 *       200:
 *         description: Crawled data created
 */
router.route('/')
  .post(CrawledDataController.createCrawledData);

/**
 * @swagger
 * /ai-crawled-data/request/{request_id}:
 *   get:
 *     summary: Get crawled data by request ID
 *     tags:
 *       - AI Crawled Data
 *     parameters:
 *       - name: request_id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: List of crawled data
 */
router.route('/request/:request_id')
  .get(CrawledDataController.getCrawledDataByRequest);

/**
 * @swagger
 * /ai-crawled-data/{id}/validate:
 *   put:
 *     summary: Update validation status
 *     tags:
 *       - AI Crawled Data
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
 *             validated:
 *               type: boolean
 *     responses:
 *       200:
 *         description: Validation updated
 */
router.route('/:id/validate')
  .put(CrawledDataController.updateValidation);

export default router;