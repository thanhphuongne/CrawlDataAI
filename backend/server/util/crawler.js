import axios from 'axios';
import * as cheerio from 'cheerio';
import * as CrawledDataService from '../components/ai-chat/crawledData.service';
import * as RequestService from '../components/ai-chat/request.service';

/**
 * Extract data from HTML based on common patterns
 * @param {string} html - HTML content
 * @param {string} url - Source URL
 * @returns {Array} - Extracted data
 */
function extractDataFromHTML(html, url) {
  const $ = cheerio.load(html);
  const data = [];

  // Extract tables
  $('table').each((i, table) => {
    const tableData = [];
    const headers = [];

    // Get headers
    $(table).find('thead th, thead td').each((j, header) => {
      headers.push($(header).text().trim());
    });

    // If no headers, use first row as headers
    if (headers.length === 0) {
      $(table).find('tbody tr:first-child td, tr:first-child td').each((j, cell) => {
        headers.push($(cell).text().trim());
      });
    }

    // Get data rows
    $(table).find('tbody tr, tr').each((j, row) => {
      if (j === 0 && headers.length === 0) return; // Skip header row if already used

      const rowData = {};
      $(row).find('td').each((k, cell) => {
        const header = headers[k] || `column_${k + 1}`;
        rowData[header] = $(cell).text().trim();
      });

      if (Object.keys(rowData).length > 0) {
        tableData.push(rowData);
      }
    });

    if (tableData.length > 0) {
      data.push({
        type: 'table',
        data: tableData,
        source: url
      });
    }
  });

  // Extract lists
  $('ul, ol').each((i, list) => {
    const listItems = [];
    $(list).find('li').each((j, item) => {
      listItems.push($(item).text().trim());
    });

    if (listItems.length > 0) {
      data.push({
        type: 'list',
        data: listItems,
        source: url
      });
    }
  });

  // Extract structured data (JSON-LD)
  $('script[type="application/ld+json"]').each((i, script) => {
    try {
      const jsonData = JSON.parse($(script).html());
      data.push({
        type: 'structured_data',
        data: jsonData,
        source: url
      });
    } catch (e) {
      // Ignore invalid JSON
    }
  });

  // If no structured data found, extract basic text content
  if (data.length === 0) {
    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    data.push({
      type: 'page_content',
      data: {
        title,
        description,
        content: bodyText.substring(0, 10000) // Limit content length
      },
      source: url
    });
  }

  return data;
}

/**
 * Crawl a single URL
 * @param {string} url - URL to crawl
 * @returns {Promise<Array>} - Crawled data
 */
async function crawlURL(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    return extractDataFromHTML(html, url);
  } catch (error) {
    console.error(`Error crawling ${url}:`, error.message);
    throw new Error(`Failed to crawl ${url}: ${error.message}`);
  }
}

/**
 * Generate URLs to crawl based on requirement
 * @param {string} requirement - User requirement
 * @returns {Array<string>} - URLs to crawl
 */
function generateURLsFromRequirement(requirement) {
  // This is a simple implementation - in a real system you'd use AI or more sophisticated logic
  const urls = [];

  // Common data sources based on keywords
  const keywordMappings = {
    'weather': ['https://weather.com', 'https://accuweather.com'],
    'news': ['https://bbc.com/news', 'https://cnn.com', 'https://reuters.com'],
    'finance': ['https://finance.yahoo.com', 'https://bloomberg.com'],
    'sports': ['https://espn.com', 'https://sports.yahoo.com'],
    'technology': ['https://techcrunch.com', 'https://wired.com'],
    'health': ['https://webmd.com', 'https://mayoclinic.org'],
    'shopping': ['https://amazon.com', 'https://ebay.com'],
    'social': ['https://twitter.com/search', 'https://facebook.com/search']
  };

  const lowerReq = requirement.toLowerCase();

  for (const [keyword, sources] of Object.entries(keywordMappings)) {
    if (lowerReq.includes(keyword)) {
      urls.push(...sources);
    }
  }

  // If no specific matches, use a default search approach
  if (urls.length === 0) {
    // For demo purposes, crawl a sample data site
    urls.push('https://jsonplaceholder.typicode.com/posts');
    urls.push('https://jsonplaceholder.typicode.com/users');
  }

  return urls.slice(0, 3); // Limit to 3 URLs for demo
}

/**
 * Execute crawling for a request
 * @param {number} requestId - Request ID
 * @param {string} requirement - User requirement
 * @returns {Promise<void>}
 */
export async function executeCrawling(requestId, requirement) {
  try {
    // Update request status to processing
    await RequestService.updateRequestStatus(requestId, 'processing');

    // Generate URLs to crawl
    const urls = generateURLsFromRequirement(requirement);

    if (urls.length === 0) {
      throw new Error('No URLs generated for crawling');
    }

    // Crawl each URL
    for (const url of urls) {
      try {
        const crawledData = await crawlURL(url);

        // Store crawled data
        await CrawledDataService.createCrawledData(requestId, url, crawledData);

        console.log(`Successfully crawled and stored data from ${url}`);
      } catch (error) {
        console.error(`Failed to crawl ${url}:`, error.message);
        // Continue with other URLs
      }
    }

    // Update request status to completed
    await RequestService.updateRequestStatus(requestId, 'completed');

  } catch (error) {
    console.error(`Error executing crawling for request ${requestId}:`, error.message);
    // Update request status to failed
    await RequestService.updateRequestStatus(requestId, 'failed');
    throw error;
  }
}

/**
 * Test crawling functionality
 * @param {string} url - URL to test
 * @returns {Promise<Array>} - Test results
 */
export async function testCrawling(url) {
  try {
    return await crawlURL(url);
  } catch (error) {
    throw new Error(`Test crawling failed: ${error.message}`);
  }
}