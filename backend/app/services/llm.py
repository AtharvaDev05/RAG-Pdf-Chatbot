from dotenv import load_dotenv
from google import genai
import os

# Load environment variables
load_dotenv()

# Read the Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

# Read the Gemini API key
model = os.getenv("GEMINI_MODEL")

# Create the Gemini client
client = genai.Client(api_key=api_key)

def generate_answer(context: str, question: str) -> str:
    """
    Generate an answer using Gemini based on the retrieved context.
    """

    prompt = f"""
    You are an AI assistant that answers questions based ONLY on uploaded PDF documents.

    Your task is to answer the user's question using the retrieved document context.

    Rules:
    - Use ONLY the information provided in the context.
    - Do NOT use outside knowledge.
    - Do NOT make up facts or assumptions.
    - If the answer cannot be found in the context, reply:
    "I couldn't find that information in the uploaded documents."
    - If the context is incomplete, clearly mention that.

    ===== DOCUMENT CONTEXT =====

    {context}

    ===== USER QUESTION =====

    {question}

    ===== ANSWER =====
    """

    response = client.models.generate_content(
        model = model,
        contents = prompt
    )

    return response.text