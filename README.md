# 📄 AI Resume Analyzer & Optimizer

**AI-powered web app** that analyzes your resume and generates **actionable suggestions** (plus an optional **ATS-friendly rewrite**) to improve **clarity**, **impact**, and **structure**.

<p>
  <a href="#-getting-started"><img alt="Start" src="https://img.shields.io/badge/Start-Local%20Setup-blue"></a>
  <a href="#-api"><img alt="API" src="https://img.shields.io/badge/API-FastAPI-green"></a>
  <a href="#-tech-stack"><img alt="Frontend" src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-purple"></a>
  <a href="#-tech-stack"><img alt="Styling" src="https://img.shields.io/badge/UI-Tailwind%20CSS-black"></a>
</p>

<img src="screenshot.png" width="800"/>

---

## ✨ Features

- **🔍 Resume analysis**
  - Upload a resume (`.pdf`, `.docx`) **or** paste text
  - Returns **score (0–100)**, summary, strengths, weaknesses, suggestions
- **🛠️ “Fix My Resume” rewrite**
  - Rewrites your resume based on detected **weaknesses**
  - Outputs structured sections: **summary / experience / projects / skills**
- **🎯 Modern UI/UX**
  - Responsive layout (Tailwind)
  - Smooth loading states & conditional rendering

---

## 🧠 Tech stack

- **⚛️ Frontend**: React (Vite), Tailwind CSS
- **⚡ Backend**: FastAPI (Python)
- **🤖 AI**: OpenAI API
- **📎 Parsing**: PyPDF2 (PDF), python-docx (DOCX), python-multipart (uploads)

---

## ⚙️ How it works

1. **Upload** resume / **paste** text
2. Extract & clean content
3. AI analysis → **score + insights**
4. Optional rewrite → **“Fix My Resume”**
5. Show results in the UI

---

## 🗂️ Project structure

```text
.
├─ src/                  # React app
├─ backend/              # FastAPI API
├─ package.json          # Frontend deps/scripts (Vite)
└─ backend/requirements.txt
```

---

## 🚀 Getting started

### ✅ Prerequisites

- **Node.js** (frontend)
- **Python 3.10+** (recommended) (backend)
- **OpenAI API key**

### 1) 📥 Clone

```bash
git clone https://github.com/<your-username>/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2) 🧩 Backend setup (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```bash
OPENAI_API_KEY=your_api_key_here
```

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

### 3) 🎨 Frontend setup (React + Vite)

In a new terminal:

```bash
cd ai-resume-analyzer
npm install
npm run dev
```

Open the app printed by Vite (usually **`http://localhost:5173`**).

---

## 🧪 API

✅ The frontend is currently configured to call:

- **`POST /analyze`**
- **`POST /rewrite`**

When running locally, that maps to:

- **`http://localhost:8000/analyze`**
- **`http://localhost:8000/rewrite`**

### 🔍 `POST /analyze`

Accepts `multipart/form-data` with **either**:

- **`file`**: PDF/DOCX file (optional)
- **`text`**: raw resume text (optional)

Returns:

```json
{
  "success": true,
  "data": {
    "score": 78,
    "summary": ["..."],
    "strengths": ["..."],
    "weaknesses": ["..."],
    "suggestions": ["..."]
  }
}
```

### ✨ `POST /rewrite`

Accepts `multipart/form-data` with:

- **`file`** **or** **`text`**
- **`weaknesses`**: JSON-encoded array of weaknesses (string)

Returns:

```json
{
  "success": true,
  "data": {
    "summary": ["..."],
    "experience": ["..."],
    "projects": ["..."],
    "skills": ["..."],
    "changed": "..."
  }
}
```

---

## 🧯 Troubleshooting

- **❌ CORS / API not reachable**: ensure backend is running on **port `8000`**.
- **❌ 404 on `/*`**: the UI calls `/analyze` + `/rewrite`. If your backend exposes different paths, update backend routes or the `fetch()` URLs in `src/App.jsx`.

---

## 🗺️ Roadmap

- **📄 PDF export** of improved resume
- **🧩 Multiple templates**
- **🪞 Side-by-side comparison** (before vs after)
- **🌍 Production deploy** (Vercel + Render/Fly/etc.)

---

## 🤝 Contributing

Pull requests are welcome. Please open an issue for major changes.

---

## 📜 License

Add a license (MIT/Apache-2.0/etc.) if you plan to distribute this publicly.
