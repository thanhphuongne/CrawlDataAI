import * as CrawledDataService from './crawledData.service';
import ExcelJS from 'exceljs';

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

    const crawledData = data[0].data;

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="crawled_data_${request_id}.json"`);
      return res.json(crawledData);
    }

    if (format === 'xlsx' || format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Crawled Data');

      // If data is an array of objects, create headers from keys
      if (Array.isArray(crawledData) && crawledData.length > 0) {
        // Get all unique keys from all objects
        const allKeys = new Set();
        crawledData.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            Object.keys(item).forEach(key => allKeys.add(key));
          }
        });

        const headers = Array.from(allKeys);
        worksheet.addRow(headers);

        // Add data rows
        crawledData.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            const row = headers.map(header => {
              const value = item[header];
              // Handle different data types
              if (typeof value === 'object') {
                return JSON.stringify(value);
              }
              return value || '';
            });
            worksheet.addRow(row);
          }
        });
      } else if (typeof crawledData === 'object' && crawledData !== null) {
        // If it's a single object, convert to key-value pairs
        worksheet.addRow(['Key', 'Value']);
        Object.entries(crawledData).forEach(([key, value]) => {
          worksheet.addRow([key, typeof value === 'object' ? JSON.stringify(value) : value]);
        });
      } else {
        // If it's a primitive value
        worksheet.addRow(['Data']);
        worksheet.addRow([crawledData]);
      }

      // Set response headers for Excel download
      res.setHeader('Content-Disposition', `attachment; filename="crawled_data_${request_id}.xlsx"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

      // Write Excel file to response
      await workbook.xlsx.write(res);
      res.end();
      return;
    }

    // TODO: Implement CSV and PDF
    return res.status(400).json({ error: 'Format not supported. Supported formats: json, xlsx' });
  } catch (error) {
    return next(error);
  }
}