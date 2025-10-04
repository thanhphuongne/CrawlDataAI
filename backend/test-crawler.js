import { testCrawling } from './server/util/crawler.js';

async function test() {
  try {
    console.log('Testing crawler with sample URL...');
    const result = await testCrawling('https://jsonplaceholder.typicode.com/posts/1');
    console.log('Crawling result:', JSON.stringify(result, null, 2));
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

test();