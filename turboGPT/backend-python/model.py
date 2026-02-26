



import json
import os
import re
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.document_loaders import PyPDFLoader





def get_llm():
    api_key = os.environ.get("GOOGLE_API_KEY")

    if not api_key:
        raise RuntimeError("Gemini API key not found in environment variables")

    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=api_key,
        temperature=0.4,
        max_output_tokens=4096,
    )



# ---------- CHAT ----------
def chat_ai(message: str) -> str:
    llm = get_llm()
    response = llm.invoke(message)
    content = response.content

    # NORMALIZE GEMINI OUTPUT
    if isinstance(content, list):
        return "".join(
            block.get("text", "")
            for block in content
            if isinstance(block, dict)
        )

    return str(content)


# ---------- PDF PROCESS ----------
def process_pdf_ai(file_path: str):
    llm = get_llm()

    loader = PyPDFLoader(file_path)
    pages = loader.load()
    full_text = " ".join(p.page_content for p in pages)[:30000] # Increased limit for better breadth

    # ---------- SUMMARY (KEEP AS IS) ----------
    summary_resp = llm.invoke(
        f"""Provide a comprehensive and detailed summary of these notes for a student. 
        The summary should be organized into logical sections with clear headings and bullet points. 
        It must be very detailed, covering all key concepts.
        Minimum length: 20 lines. Maximum length: 100 lines.
        
        NOTES CONTENT:\n{full_text}"""
    )

    summary_content = summary_resp.content
    if isinstance(summary_content, list):
        summary = "".join(
            block.get("text", "")
            for block in summary_content
            if isinstance(block, dict)
        )
    else:
        summary = str(summary_content)

    # ---------- QUIZ (FIXED & RELIABLE) ----------
    quiz_prompt = f"""
You are an examiner.

Create EXACTLY 10 multiple-choice questions from the content below. Make sure they cover different aspects of the text.

RULES:
- Respond ONLY with valid JSON
- No markdown
- No explanation text
- No extra keys

FORMAT:
{{
  "quiz": [
    {{
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    }}
  ]
}}

CONTENT:
{full_text}
"""

    quiz_resp = llm.invoke(quiz_prompt)
    quiz_content = quiz_resp.content

    if isinstance(quiz_content, list):
        quiz_raw = "".join(
            block.get("text", "")
            for block in quiz_content
            if isinstance(block, dict)
        )
    else:
        quiz_raw = str(quiz_content)

    # ---------- SAFE JSON EXTRACTION ----------
    try:
        match = re.search(r"\{[\s\S]*\}", quiz_raw)
        quiz_json = json.loads(match.group())
        quiz = quiz_json.get("quiz", [])
    except Exception as e:
        print("❌ QUIZ PARSE ERROR:", e)
        print("RAW QUIZ OUTPUT:", quiz_raw)
        quiz = []  # NEVER break PDF flow

    return summary, quiz
