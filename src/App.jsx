import React, { useState, useRef } from "react";
import Loader from "./Loader";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [response, setResponse] = useState({
    score: null,
    summary: "",
    suggestions: [],
    strengths: [],
    weaknesses: [],
  });
  const [fixedResume, setFixedResume] = useState();
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async () => {
    try {
      if (isAdvanced && !text) {
        setError(true);
        return;
      }
      setLoading(true);
      const body = new FormData();

      if (file) {
        body.append("file", file);
      }
      if (text) {
        body.append("text", text);
      }

      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.data); // assume already JSON
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFix = async () => {
    try {
      setFixing(true);
      let body = new FormData();
      if (file) {
        body.append("file", file);
      }
      if (text) {
        body.append("text", text);
      }
      body.append("weaknesses", JSON.stringify(response.weaknesses));
      const rewriteResponse = await fetch("http://localhost:8000/rewrite", {
        method: "POST",
        body: body,
      });
      const data = await rewriteResponse.json();
      console.log(data);
      if (data.success);
      setFixedResume(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📄 AI Resume Analyzer
        </h1>
        <p className="text-gray-600 mt-2">
          Get instant insights to improve your resume 🚀
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition">
          <p className="text-gray-500 mb-3">Drag & drop your resume or</p>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={inputRef}
            onChange={(e) => {
              const selected = e.target.files[0];
              setFile(selected);
              //  setText("");
            }}
            className="hidden"
          />

          <button
            type="button"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => inputRef.current?.click()}
          >
            Upload Resume
          </button>

          {file && (
            <div className="mt-4 flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg">
              <p className="text-sm text-gray-700 truncate">📄 {file.name}</p>

              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="text-red-500 hover:text-red-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-2">Supported: PDF, DOCX</p>
        </div>

        <label className="flex items-start gap-3 cursor-pointer group mt-4 mb-4">
          <input
            type="checkbox"
            checked={isAdvanced}
            onChange={() => {
              setIsAdvanced(!isAdvanced);
              setText("");
            }}
            className="mt-1 w-5 h-5 accent-purple-600 cursor-pointer"
          />

          <div>
            <p className="text-gray-800 font-semibold group-hover:text-purple-600 transition">
              🚀 Advanced Analysis
            </p>
            <p className="text-sm text-gray-500">
              Match your resume with a specific job description and get tailored
              insights & ATS score
            </p>
          </div>
        </label>

        {/* Controlled Textarea */}
        {isAdvanced && (
          <>
            <textarea
              value={text}
              placeholder="Paste your job description here..."
              className={`w-full h-40 p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 resize-none
               ${
                 error
                   ? "border-red-500 focus:ring-2 focus:ring-red-300"
                   : "border-gray-300 focus:ring-2 focus:ring-purple-400"
               }
              `}
              onChange={(e) => {
                setText(e.target.value);
                setError(false);
                // setFile(null);
                //  if (inputRef.current) inputRef.current.value = "";
              }}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">
                ⚠️ Please add a job description to continue
              </p>
            )}
          </>
        )}

        {/* Button */}
        <button
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition font-semibold disabled:opacity-50"
          disabled={(!file && !text.trim()) || loading}
          onClick={handleSubmit}
        >
          Analyze Resume 🚀
        </button>

        {loading && <Loader info="Analyzing Resume..." />}
      </div>
      {!loading && !fixing && !fixedResume && (
        <div>
          {/* Score */}
          {response.score !== null && (
            <div className="w-full max-w-5xl mt-10 text-center">
              <h3 className="font-semibold text-lg">📊 Resume Score</h3>
              <p className="text-4xl font-bold text-blue-600 mt-2">
                {response.score}%
              </p>
            </div>
          )}

          {/* Grid Results */}
          <div className="w-full max-w-5xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summary */}
            {response.summary?.length > 0 && (
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold text-lg">🧾 Summary</h3>
                <ul className="mt-2 text-gray-600 space-y-1">
                  {response.summary.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {response.suggestions?.length > 0 && (
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold text-lg">⚡ Suggestions</h3>
                <ul className="mt-2 text-gray-600 space-y-1">
                  {response.suggestions.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            {response.strengths?.length > 0 && (
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold text-lg">💪 Strengths</h3>
                <ul className="mt-2 text-gray-600 space-y-1">
                  {response.strengths.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {response.weaknesses?.length > 0 && (
              <div className="bg-white p-5 rounded-xl shadow">
                <h3 className="font-semibold text-lg">📉 Weaknesses</h3>
                <ul className="mt-2 text-gray-600 space-y-1">
                  {response.weaknesses.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {response.score !== null && response.score !== 0 && (
            <div className="w-full max-w-5xl flex justify-center">
              <button
                className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-90 transition font-semibold disabled:opacity-50 px-8"
                onClick={handleFix}
                disabled={fixing}
              >
                ✨ Fix My Resume
              </button>
            </div>
          )}
        </div>
      )}
      {fixing && <Loader info="Fixing Resume..." />}
      {!loading && fixedResume && (
        <div className="bg-white p-6 rounded-xl shadow space-y-4 mt-10">
          <h2 className="text-xl font-bold">✨ Improved Resume</h2>

          {/* Summary */}
          <div>
            <h3 className="font-semibold text-gray-800">Summary</h3>
            <p className="text-gray-600">{fixedResume.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h3 className="font-semibold text-gray-800">Experience</h3>
            <ul className="list-disc ml-5 text-gray-600">
              {fixedResume.experience.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="font-semibold text-gray-800">Projects</h3>
            <ul className="list-disc ml-5 text-gray-600">
              {fixedResume.projects.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-gray-800">Skills</h3>
            <p className="text-gray-600">{fixedResume.skills.join(", ")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
