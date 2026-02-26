from model import chat_ai, process_pdf_ai
from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from model import chat_ai, process_pdf_ai
import tempfile
import shutil
import os

app = FastAPI()


# ---------- SCHEMAS ----------
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    answer: str


# ---------- CHAT ROUTE ----------
@app.post("/chat", response_model=ChatResponse)
async def chat_route(req: ChatRequest):
    try:
        answer = chat_ai(req.message)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))





@app.post("/process-pdf")
async def process_pdf_route(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_path = tmp.name

        summary, quiz = process_pdf_ai(temp_path)

        os.remove(temp_path)

        return {
            "summary": summary,
            "quiz": quiz
        }

    except Exception as e:
        print("❌ PDF PROCESS ERROR:", str(e))  # <-- IMPORTANT
        raise HTTPException(
            status_code=500,
            detail=f"PDF processing failed: {str(e)}"
        )
