"""
THE CORE MAGIC: AI-powered feedback translator
This service translates vague client feedback into actionable design tasks
"""
import openai
import json
import logging
from typing import List, Dict

from app.core.config import settings

logger = logging.getLogger(__name__)

# Configure OpenAI
openai.api_key = settings.OPENAI_API_KEY


class TranslatorService:
    """
    Service for translating vague feedback into actionable tasks
    """
    
    SYSTEM_PROMPT = """You are an expert Art Director and Senior Designer with 15+ years of experience. Your job is to translate vague, unclear client feedback into specific, actionable design tasks for junior designers.

When you receive feedback, you should:
1. Identify the core intent behind the vague language
2. Break it down into 2-5 specific, actionable tasks
3. Use precise design terminology
4. Include specific measurements or percentages when relevant
5. Reference concrete design elements (colors, typography, spacing, etc.)

You MUST respond ONLY in valid JSON format with this exact structure:
{
  "tasks": [
    {
      "task": "Specific actionable task description",
      "estimated_time_minutes": 15,
      "difficulty_level": "easy"
    }
  ]
}

Difficulty levels: "easy", "medium", "hard"
Time estimates: realistic minutes (5-120)

Example:
Input: "make it pop"
Output:
{
  "tasks": [
    {
      "task": "Increase contrast ratio on the main headline from 4.5:1 to at least 7:1 for better readability",
      "estimated_time_minutes": 10,
      "difficulty_level": "easy"
    },
    {
      "task": "Replace the current muted blue (#94A3B8) with a more vibrant color like electric blue (#3B82F6)",
      "estimated_time_minutes": 15,
      "difficulty_level": "easy"
    },
    {
      "task": "Add a subtle drop shadow (0px 4px 6px rgba(0, 0, 0, 0.1)) to the primary CTA button",
      "estimated_time_minutes": 5,
      "difficulty_level": "easy"
    }
  ]
}"""
    
    async def translate_feedback(self, feedback_text: str) -> List[Dict]:
        """
        Translate vague feedback into actionable tasks using OpenAI
        
        Args:
            feedback_text: The vague client feedback
            
        Returns:
            List of task dictionaries with task description, time, and difficulty
        """
        try:
            # Call OpenAI API
            response = await self._call_openai(feedback_text)
            
            # Parse JSON response
            tasks_data = json.loads(response)
            
            if "tasks" not in tasks_data:
                raise ValueError("Invalid response format from AI")
            
            return tasks_data["tasks"]
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response: {e}")
            logger.error(f"Response was: {response}")
            # Fallback: return a generic task
            return self._fallback_tasks(feedback_text)
        except Exception as e:
            logger.error(f"Error translating feedback: {e}")
            return self._fallback_tasks(feedback_text)
    
    async def _call_openai(self, feedback_text: str) -> str:
        """
        Call OpenAI API with retry logic
        """
        try:
            # Try with primary model (GPT-4)
            response = openai.ChatCompletion.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": feedback_text}
                ],
                temperature=0.7,
                max_tokens=1000,
                response_format={"type": "json_object"}
            )
            
            return response.choices[0].message.content
            
        except openai.error.RateLimitError:
            # Try fallback model if rate limited
            logger.warning("Rate limited on primary model, trying fallback")
            response = openai.ChatCompletion.create(
                model=settings.OPENAI_FALLBACK_MODEL,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": feedback_text}
                ],
                temperature=0.7,
                max_tokens=1000,
                response_format={"type": "json_object"}
            )
            
            return response.choices[0].message.content
    
    def _fallback_tasks(self, feedback_text: str) -> List[Dict]:
        """
        Generate fallback tasks if AI fails
        """
        return [
            {
                "task": f"Review and interpret the following feedback: '{feedback_text[:100]}'",
                "estimated_time_minutes": 30,
                "difficulty_level": "medium"
            },
            {
                "task": "Create 3 design variations exploring different interpretations of the feedback",
                "estimated_time_minutes": 60,
                "difficulty_level": "medium"
            },
            {
                "task": "Schedule a 15-minute call with the client to clarify their requirements",
                "estimated_time_minutes": 15,
                "difficulty_level": "easy"
            }
        ]
