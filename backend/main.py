
from fastapi.middleware.cors import CORSMiddleware

from fastapi import APIRouter, UploadFile, File, Form,FastAPI
from PyPDF2 import PdfReader
from docx import Document
from dotenv import load_dotenv
from openai import OpenAI
import json

import os
import io
app = FastAPI()

# ✅ CORS (React/JS connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 sab allow (dev ke liye)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 🔑 Load env variables
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter()

@app.post("/analyze")
async def analyze(file: UploadFile = File(None), text: str = Form(None)):
    textToBeSend = ''
    if file:
        filename = file.filename
        ext = filename.split(".")[-1]
        content = await file.read()
        if ext == 'pdf': 
            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                textToBeSend += page.extract_text() or ""
        else:
            
            doc = Document(io.BytesIO(content))
            textToBeSend = "\n".join([para.text for para in doc.paragraphs])
    elif text:
       textToBeSend = text
    else:
     return {"error": "No input provided"}
    data = summarize_resume(textToBeSend)
    return data
       
def summarize_resume(text):
    try:
     # 🔥 safety limit (LLM token control)
        text = text[:6000]

        # 🚀 GPT CALL
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert resume analyzer."
                },
                {
                    "role": "user",
                    "content": f"""
Analyze this resume and return JSON ONLY:

{{
  "score": number (0-100),
  "summary": ["point1", "point2","point3"],
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "suggestions": ["point1", "point2"]
}}
Guidelines:
- Score the resume based on relevance, clarity, structure, and professional quality.
- Identify presence of key sections such as: projects, work experience, skills, education.
- If these sections or relevant professional content are missing, treat the resume as low quality.

Special Rules:
- If the resume is incoherent, irrelevant, or lacks meaningful professional content:
  - Set "score" to 0
  - Return ONLY "summary" and "suggestions"
  - Set "strengths" and "weaknesses" as empty arrays []

- Keep all points:
  - Short, crisp, and non-repetitive
  - Actionable where possible

- Do NOT include any text outside the JSON.
- Do NOT add explanations.

Resume:
{text}
"""
                }
            ],
             response_format={"type": "json_object"}
        )

        result = json.loads(response.choices[0].message.content)
        print(result)
        return {
            "success": True,
            "data": result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.post("/rewrite")
async def rewrite(file: UploadFile = File(None), text: str = Form(None) , weaknesses: str = Form(None)):
    weaknesses_list = []
    if weaknesses:
     weaknesses_list = json.loads(weaknesses)
     weakness_text = "\n".join([f"- {w}" for w in weaknesses_list])
    textToBeSend = ''
    if file:
        filename = file.filename
        ext = filename.split(".")[-1]
        content = await file.read()
        if ext == 'pdf': 
            reader = PdfReader(io.BytesIO(content))
            for page in reader.pages:
                textToBeSend += page.extract_text() or ""
        else:
            
            doc = Document(io.BytesIO(content))
            textToBeSend = "\n".join([para.text for para in doc.paragraphs])
    elif text:
       textToBeSend = text
    else:
     return {"error": "No input provided"}
    data = rewrite_resume(textToBeSend,weakness_text)
    return data

def rewrite_resume(text,weakness_text):
    print(weakness_text)
    try:
     # 🔥 safety limit (LLM token control)
        text = text[:6000]

        # 🚀 GPT CALL
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert resume analyzer."
                },
                {
                    "role": "user",
                    "content": f"""
Rewrite the following resume to make it highly professional, ATS-optimized, and impactful.
Rewrite this resume based on the following weaknesses:
{weakness_text}

Rules:
- Fix these issues specifically
- Improve impact and clarity
- Do not add fake experience
- Use strong action verbs
- Add measurable impact (numbers, %, results) where possible
- Keep it concise and structured
- Improve clarity and readability
- make summary crisp and point to point
- Also add points you changed or corrected in the changed key of the JSON

Return STRICT JSON ONLY in this format:

{{
  "summary": ["point1", "point2","point3"],
  "experience": ["point1", "point2","point3"],
  "projects": ["point1", "point2","point3"],
  "skills": ["skill1", "skill2",'"skill3"],
  "changed": ""
}}

Resume:
{text}
"""
                }
            ],
             response_format={"type": "json_object"}
        )

        result = json.loads(response.choices[0].message.content)
        print(result)
        return {
            "success": True,
            "data": result
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

