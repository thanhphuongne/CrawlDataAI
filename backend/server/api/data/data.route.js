import { Router } from 'express';
import * as CrawledDataController from '../../components/ai-chat/crawledData.controller';
import { isAuthorized } from '../../api/auth.middleware';

const router = new Router();

/**
 * @swagger
 * /api/data/{request_id}:
 *   get:
 *     summary: Get crawled data by request ID
 *     tags:
 *       - Data Export
 *     parameters:
 *       - name: request_id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The request ID
 *     responses:
 *       200:
 *         description: Crawled data retrieved successfully
 */
router.route('/:request_id')
  .get(isAuthorized(), CrawledDataController.getCrawledDataByRequest);

/**
 * @swagger
 * /api/data/{request_id}/{format}:
 *   get:
 *     summary: Export crawled data in specified format
 *     tags:
 *       - Data Export
 *     parameters:
 *       - name: request_id
 *         in: path
 *         required: true
 *         type: integer
 *         description: The request ID
 *       - name: format
 *         in: path
 *         required: true
 *         type: string
 *         enum: [json, xlsx, excel]
 *         description: Export format (json, xlsx, or excel)
 *     responses:
 *       200:
 *         description: Data exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Unsupported format
 *       404:
 *         description: No data found
 */
router.route('/:request_id/:format')
  .get(isAuthorized(), CrawledDataController.downloadExport);

// Export routes (when used as /api/exports)
router.route('/')
  .get(isAuthorized(), CrawledDataController.getUserExports)
  .post(isAuthorized(), CrawledDataController.createExport);

export default router;