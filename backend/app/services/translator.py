from openai import OpenAI
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def translate_feedback(input_text: str) -> list:
    """
    Translate vague client feedback into actionable design tasks using OpenAI.
    
    Returns a list of dictionaries with 'task' keys containing specific design instructions.
    """
    system_prompt = """You are an expert Art Director translating vague client feedback for a junior designer. 
You will receive a phrase or paragraph of client feedback. Your job is to convert vague, subjective language 
into specific, actionable design tasks that a designer can execute.

Guidelines:
- Each task must be specific and measurable (e.g., "increase logo size by 15%" not "make logo bigger")
- Use precise design terminology (contrast, padding, font weight, color values, etc.)
- Reference specific UI elements when possible (headline, CTA button, hero section, etc.)
- Break down complex requests into separate, focused tasks
- If feedback is already specific, keep it as-is but ensure clarity
- Focus on visual design changes, not conceptual or strategic changes

Respond ONLY in valid JSON format. The response must be an array of objects, where each object has a 'task' key.

Example input: "make the logo bigger and add pizzazz"
Example output: [
  {"task": "Increase logo size by 15% on the hero section."},
  {"task": "Evaluate 3 new high-contrast color palettes for the CTA buttons (test #FF5733, #4A90E2, #F5A623)."},
  {"task": "Replace the default sans-serif headline font with a more dynamic display font (suggest Montserrat Black or Bebas Neue)."}
]

Example input: "the page feels empty"
Example output: [
  {"task": "Increase whitespace between sections by 40px."},
  {"task": "Add subtle background pattern or gradient to hero section (opacity: 0.05)."},
  {"task": "Increase font size of body text from 16px to 18px for better presence."},
  {"task": "Add 3-5 relevant icons or illustrations to break up text blocks."}
]

Now translate the following feedback:"""

    try:
        response = client.chat.completions.create(
            model="gpt-4",  # Can fallback to "gpt-3.5-turbo" if needed
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": input_text}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content.strip()
        
        # Try to parse JSON from the response
        # Sometimes GPT wraps JSON in markdown code blocks
        if content.startswith("```"):
            # Extract JSON from code block
            lines = content.split("\n")
            json_lines = [line for line in lines if not line.strip().startswith("```")]
            content = "\n".join(json_lines)
        
        tasks_data = json.loads(content)
        
        # Ensure it's a list
        if isinstance(tasks_data, dict):
            tasks_data = [tasks_data]
        
        # Ensure each item has a 'task' key
        formatted_tasks = []
        for item in tasks_data:
            if isinstance(item, dict) and "task" in item:
                formatted_tasks.append({"task": item["task"]})
            elif isinstance(item, str):
                formatted_tasks.append({"task": item})
        
        return formatted_tasks if formatted_tasks else [{"task": "Unable to parse feedback. Please try rephrasing."}]
        
    except json.JSONDecodeError as e:
        # Fallback: return a single task with the raw response
        return [{"task": f"Translation error: {content[:200]}"}]
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")
