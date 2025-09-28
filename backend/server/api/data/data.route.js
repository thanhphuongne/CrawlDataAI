import { Router } from 'express';
import * as CrawledDataController from '../../components/ai-chat/crawledData.controller';
import { isAuthorized } from '../../api/auth.middleware';

const router = new Router();

router.route('/:request_id')
  .get(isAuthorized(), CrawledDataController.getCrawledDataByRequest);

router.route('/:request_id/:format')
  .get(isAuthorized(), CrawledDataController.downloadExport);

export default router;