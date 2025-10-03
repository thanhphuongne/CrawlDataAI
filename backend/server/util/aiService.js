import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../config';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * Process user message and determine if it's a data request
 * @param {string} message - User message
 * @returns {Promise<Object>} - { isDataRequest: boolean, formattedRequirement: string, explanation: string }
 */
export async function processUserMessage(message) {
  try {
    const prompt = `
You are an AI assistant that helps users create data crawling requests. Analyze the user's message and determine if they are requesting data collection/crawling.

If it's a data request, format it into a clear requirement with:
- Data type/subject
- Time period (if mentioned)
- Sources (if mentioned)
- Any specific criteria

Return JSON in this format:
{
  "isDataRequest": true/false,
  "formattedRequirement": "Clear description of what data to crawl",
  "explanation": "Brief explanation of why this is/isn't a data request"
}

If not a data request, respond normally as a helpful assistant.

User message: "${message}"
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content.trim());
    return result;
  } catch (error) {
    console.error('Error processing message with AI:', error);
    return {
      isDataRequest: false,
      formattedRequirement: '',
      explanation: 'Sorry, I encountered an error processing your request.',
    };
  }
}

/**
 * Generate a response to user message
 * @param {string} message - User message
 * @returns {Promise<string>} - AI response
 */
export async function generateResponse(message) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}