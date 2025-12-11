import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

/**
 * Process user message and determine if it's a data request
 * @param {string} message - User message
 * @returns {Promise<Object>} - { isDataRequest: boolean, formattedRequirement: string, explanation: string }
 */
export async function processUserMessage(message) {
  try {
    // Check if Gemini API key is configured
    if (!GEMINI_API_KEY) {
      console.log('Gemini API key not configured, using fallback');
      return detectDataRequestFallback(message);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `
You are an AI assistant for a data crawling service. Analyze if the user is requesting data collection/crawling.

IMPORTANT: Only mark as data request if the message contains BOTH:
1. A valid URL (http:// or https://)
2. Keywords indicating crawling/scraping intent (crawl, scrape, extract, collect data, etc.)

For general questions, greetings, or messages without URLs, mark as isDataRequest: false.

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "isDataRequest": true/false,
  "formattedRequirement": "Clear description of what data to crawl",
  "explanation": "Brief explanation of why this is/isn't a data request"
}

User message: "${message}"
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up response - remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanText);
    return parsed;
  } catch (error) {
    console.error('Error processing message with Gemini:', error);
    // Fallback to keyword detection
    return detectDataRequestFallback(message);
  }
}

/**
 * Fallback function to detect data requests without AI
 * @param {string} message
 * @returns {Object}
 */
function detectDataRequestFallback(message) {
  const lowerMsg = message.toLowerCase();
  
  // Check for URL in message
  const urlPattern = /https?:\/\/[^\s]+/i;
  const hasUrl = urlPattern.test(message);
  
  // Data crawling keywords
  const dataKeywords = ['crawl', 'scrape', 'collect data', 'get data', 'fetch data', 'extract data', 'download data', 'gather information'];
  const hasDataKeyword = dataKeywords.some(keyword => lowerMsg.includes(keyword));
  
  // Only mark as data request if it has BOTH URL and data keywords
  if (hasUrl && hasDataKeyword) {
    return {
      isDataRequest: true,
      formattedRequirement: message,
      explanation: 'This appears to be a data collection request with URL and crawl intent.'
    };
  }
  
  return {
    isDataRequest: false,
    formattedRequirement: '',
    explanation: 'This is a general conversation message.'
  };
}

/**
 * Generate a response to user message
 * @param {string} message - User message
 * @returns {Promise<string>} - AI response
 */
export async function generateResponse(message) {
  try {
    // Check if Gemini API key is configured
    if (!GEMINI_API_KEY) {
      console.log('Gemini API key not configured, using fallback');
      return generateFallbackResponse(message);
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `You are a helpful and friendly AI assistant for CrawlDataAI, a web data crawling service. 

Your role is to:
- Have natural, engaging conversations with users
- Answer questions about web scraping, data extraction, and the service
- Help users when they want to crawl websites (they need to provide a URL with crawl keywords)
- Be conversational, helpful, and informative

Provide a natural, friendly response to the user's message. Keep your response conversational and under 150 words.

User message: "${message}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    return generateFallbackResponse(message);
  }
}

/**
 * Generate fallback response without AI
 * @param {string} message
 * @returns {string}
 */
function generateFallbackResponse(message) {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return 'Hello! 👋 I\'m your AI assistant for CrawlDataAI. I can help you with general questions or set up web crawling requests. What would you like to know?';
  }
  
  if (lowerMsg.includes('help') || lowerMsg.includes('what can you do')) {
    return 'I can help you in two ways:\n\n1. **General Chat**: Ask me anything about web scraping, data extraction, or our service\n2. **Crawl Websites**: Provide a URL with keywords like "crawl", "scrape", or "extract" and I\'ll help you collect data\n\nWhat would you like to do?';
  }
  
  if (lowerMsg.includes('thank')) {
    return 'You\'re welcome! Feel free to ask me anything else. 😊';
  }
  
  if (lowerMsg.includes('how') || lowerMsg.includes('what') || lowerMsg.includes('why')) {
    return 'That\'s a great question! I\'m here to help with web scraping and data extraction. Could you provide more details about what you\'d like to know?';
  }
  
  return 'I\'m here to chat and help! Feel free to ask me questions, or if you want to crawl a website, just include the URL with keywords like "crawl" or "extract data from".';
}