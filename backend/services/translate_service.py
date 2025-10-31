"""
AI-powered feedback translation service
Translates vague client feedback into actionable design tasks
"""

from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

TRANSLATION_SYSTEM_PROMPT = """You are an expert Art Director translating vague client feedback for a junior designer. 

Your role is to take ambiguous client comments and break them down into specific, actionable design tasks using precise design terminology and measurable instructions.

Rules:
1. Each task must be specific and actionable
2. Use design terminology (contrast, padding, typography, color palette, etc.)
3. Include measurable values when possible (percentages, pixel values, etc.)
4. Break vague requests into multiple specific tasks
5. Focus on visual design improvements

Response Format: JSON array of objects with a single "task" key.
Each object in the array represents one actionable design task.

Example input: "make the logo bigger and add pizzazz"
Example output: [
  {"task": "Increase logo size by 15% on the hero section."},
  {"task": "Evaluate 3 new high-contrast color palettes for the CTA buttons."},
  {"task": "Replace the default sans-serif headline font with a more dynamic display font."}
]

Example input: "make it pop"
Example output: [
  {"task": "Increase contrast ratio between background and foreground elements by at least 40%."},
  {"task": "Apply a vibrant color accent to primary call-to-action buttons."},
  {"task": "Add subtle shadow or depth effects to key visual elements."},
  {"task": "Review and enhance typographic hierarchy with bolder weights or larger sizes for headlines."}
]

Example input: "needs more pizzazz"
Example output: [
  {"task": "Introduce animated micro-interactions for hover states on interactive elements."},
  {"task": "Evaluate and apply a more energetic color palette with complementary accent colors."},
  {"task": "Increase visual rhythm through varied spacing and sizing of design elements."},
  {"task": "Consider adding decorative elements or patterns that align with the brand personality."}
]

Now translate the following client feedback into actionable design tasks:"""


async def translate_feedback(feedback_text: str) -> list[str]:
    """
    Translate vague client feedback into actionable design tasks.
    
    Args:
        feedback_text: The raw client feedback string
        
    Returns:
        List of actionable task descriptions
    """
    if not feedback_text or not feedback_text.strip():
        raise ValueError("Feedback text cannot be empty")
    
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": TRANSLATION_SYSTEM_PROMPT},
                {"role": "user", "content": feedback_text.strip()}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content.strip()
        
        # Parse JSON response
        try:
            tasks_data = json.loads(content)
        except json.JSONDecodeError:
            # Sometimes GPT returns markdown-formatted JSON, try to extract it
            if "```json" in content:
                json_start = content.find("```json") + 7
                json_end = content.find("```", json_start)
                content = content[json_start:json_end].strip()
                tasks_data = json.loads(content)
            elif "```" in content:
                json_start = content.find("```") + 3
                json_end = content.find("```", json_start)
                content = content[json_start:json_end].strip()
                tasks_data = json.loads(content)
            else:
                # Fallback: treat as plain text, split by lines
                tasks_data = [{"task": line.strip()} for line in content.split("\n") if line.strip()]
        
        # Extract task strings from the response
        if isinstance(tasks_data, list):
            tasks = [item.get("task", str(item)) if isinstance(item, dict) else str(item) 
                    for item in tasks_data]
        elif isinstance(tasks_data, dict):
            # Single task
            tasks = [tasks_data.get("task", str(tasks_data))]
        else:
            tasks = [str(tasks_data)]
        
        # Filter out empty tasks
        tasks = [task.strip() for task in tasks if task.strip()]
        
        if not tasks:
            raise ValueError("No tasks generated from feedback")
        
        return tasks
        
    except Exception as e:
        # Fallback: return a basic task if AI fails
        return [f"Review and refine: {feedback_text.strip()}"]
        # In production, you might want to log this error
        # raise Exception(f"Translation service error: {str(e)}")
