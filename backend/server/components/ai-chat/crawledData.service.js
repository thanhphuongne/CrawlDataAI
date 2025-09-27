import CrawledData from './crawledData.model';

/**
 * Create crawled data
 * @param {number} requestId
 * @param {string} url
 * @param {Array} data
 * @param {boolean} validated
 * @returns {Promise<CrawledData>}
 */
export async function createCrawledData(requestId, url, data, validated = false) {
  try {
    const crawledData = new CrawledData({
      request_id: requestId,
      url,
      data,
      validated,
    });
    await crawledData.save();
    return crawledData;
  } catch (error) {
    throw new Error(`Error creating crawled data: ${error.message}`);
  }
}

/**
 * Get crawled data by request ID
 * @param {number} requestId
 * @returns {Promise<CrawledData[]>}
 */
export async function getCrawledDataByRequestId(requestId) {
  try {
    const data = await CrawledData.find({ request_id: requestId });
    return data;
  } catch (error) {
    throw new Error(`Error getting crawled data: ${error.message}`);
  }
}

/**
 * Update validation status
 * @param {string} id
 * @param {boolean} validated
 * @returns {Promise<boolean>}
 */
export async function updateValidationStatus(id, validated) {
  try {
    const result = await CrawledData.findByIdAndUpdate(id, { validated });
    return !!result;
  } catch (error) {
    throw new Error(`Error updating validation: ${error.message}`);
  }
}