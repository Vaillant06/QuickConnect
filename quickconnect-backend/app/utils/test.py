from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="gemini-flash-latest",
    contents="""
    Classify this need into JSON.

    Return ONLY JSON. No explanation.

    Format:
    {
      "category": "food | medical | shelter | rescue",
      "urgency": "low | medium | high"
    }

    Need: Need food for 50 people after flood
    """
)

print(response.text)