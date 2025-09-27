import * as CrawledDataService from './crawledData.service';

/**
 * Create crawled data
 */
export async function createCrawledData(req, res, next) {
  try {
    const { request_id, url, data, validated } = req.body;
    const crawledData = await CrawledDataService.createCrawledData(request_id, url, data, validated);
    return res.json({
      success: true,
      data: crawledData,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get crawled data by request ID
 */
export async function getCrawledDataByRequest(req, res, next) {
  try {
    const { request_id } = req.params;
    const data = await CrawledDataService.getCrawledDataByRequestId(request_id);
    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update validation status
 */
export async function updateValidation(req, res, next) {
  try {
    const { id } = req.params;
    const { validated } = req.body;
    const success = await CrawledDataService.updateValidationStatus(id, validated);
    return res.json({
      success,
    });
  } catch (error) {
    return next(error);
  }
}