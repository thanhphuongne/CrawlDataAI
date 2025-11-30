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
You are an AI assistant that helps users create data crawling requests. Analyze the user's message and determine if they are requesting data collection/crawling.

If it's a data request, format it into a clear requirement with:
- Data type/subject
- Time period (if mentioned)
- Sources (if mentioned)
- Any specific criteria

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "isDataRequest": true/false,
  "formattedRequirement": "Clear description of what data to crawl",
  "explanation": "Brief explanation of why this is/isn't a data request"
}

If not a data request, respond normally as a helpful assistant.

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
  const dataKeywords = ['crawl', 'scrape', 'collect data', 'get data', 'fetch data', 'extract data', 'download data', 'gather information', 'need data about', 'want data on'];
  
  const isDataRequest = dataKeywords.some(keyword => lowerMsg.includes(keyword));
  
  if (isDataRequest) {
    return {
      isDataRequest: true,
      formattedRequirement: message,
      explanation: 'This appears to be a data collection request based on keywords detected.'
    };
  }
  
  return {
    isDataRequest: false,
    formattedRequirement: '',
    explanation: 'This does not appear to be a data request. How can I help you?'
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
    
    const prompt = `You are a helpful AI assistant for a data crawling service. Provide a brief, friendly response to the user's message. Keep your response under 100 words.

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
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return 'Hello! I\'m here to help you with data crawling requests. What data would you like to collect?';
  }
  
  if (lowerMsg.includes('help')) {
    return 'I can help you create data crawling requests. Just tell me what data you need, like "I need to collect product prices from e-commerce sites" or "Crawl news articles about technology".';
  }
  
  if (lowerMsg.includes('thank')) {
    return 'You\'re welcome! Let me know if you need anything else.';
  }
  
  return 'I understand. To create a data crawling request, please describe what data you need to collect. Include details like the type of data, sources, and any specific requirements.';
}