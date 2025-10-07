import openai
from typing import Dict, Any
from ..config import settings

openai.api_key = settings.openai_api_key

async def process_user_message(message: str) -> Dict[str, Any]:
    """
    Process user message and determine if it's a data request
    """
    try:
        prompt = f"""
You are an AI assistant that helps users create data crawling requests. Analyze the user's message and determine if they are requesting data collection/crawling.

If it's a data request, format it into a clear requirement with:
- Data type/subject
- Time period (if mentioned)
- Sources (if mentioned)
- Any specific criteria

Return JSON in this format:
{{
  "isDataRequest": true/false,
  "formattedRequirement": "Clear description of what data to crawl",
  "explanation": "Brief explanation of why this is/isn't a data request"
}}

If not a data request, respond normally as a helpful assistant.

User message: "{message}"
"""

        response = await openai.ChatCompletion.acreate(
            model='gpt-3.5-turbo',
            messages=[{'role': 'user', 'content': prompt}],
            max_tokens=300,
            temperature=0.3,
        )

        result = eval(response.choices[0].message.content.strip())  # Note: In production, use json.loads with proper error handling
        return result
    except Exception as e:
        print(f"Error processing message with AI: {e}")
        return {
            "isDataRequest": False,
            "formattedRequirement": "",
            "explanation": "Sorry, I encountered an error processing your request.",
        }

async def generate_response(message: str) -> str:
    """
    Generate a response to user message
    """
    try:
        response = await openai.ChatCompletion.acreate(
            model='gpt-3.5-turbo',
            messages=[{'role': 'user', 'content': message}],
            max_tokens=150,
            temperature=0.7,
        )

        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error generating AI response: {e}")
        return "Sorry, I encountered an error. Please try again."