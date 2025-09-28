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
    if (data.length > 0) {
      return res.json({
        url: data[0].url,
        data: data[0].data,
        validated: data[0].validated,
      });
    }
    return res.json({
      url: '',
      data: [],
      validated: false,
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

/**
 * Download exported data
 */
export async function downloadExport(req, res, next) {
  try {
    const { request_id, format } = req.params;
    const data = await CrawledDataService.getCrawledDataByRequestId(request_id);
    if (data.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }
    // Simple implementation: return JSON for now
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="export_${request_id}.json"`);
      return res.json(data[0].data);
    }
    // TODO: Implement CSV and PDF
    return res.status(400).json({ error: 'Format not supported' });
  } catch (error) {
    return next(error);
  }
}