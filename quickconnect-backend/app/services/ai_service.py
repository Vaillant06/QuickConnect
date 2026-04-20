from app.utils.gemini import classify_need

def get_ai_classification(description: str):
    return classify_need(description)