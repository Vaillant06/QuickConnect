from google import genai
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def classify_need(description: str):
    response = client.models.generate_content(
        model="gemini-flash-lite-latest",
        contents=f"""
        Return JSON only:

        category: food | medical | shelter | rescue
        urgency: low | medium | high

        Text: {description}
        """
    )

    text = response.text.strip().replace("```json", "").replace("```", "")

    try:
        parsed = json.loads(text)
        return parsed
    except:
        return {
            "category": "general",
            "urgency": "medium"
        }