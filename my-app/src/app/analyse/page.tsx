"use client"

import React, { useState } from "react"
import { Upload, FileText, Loader2, Sparkles } from "lucide-react"

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) setFile(selectedFile)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setIsAnalyzing(true)
    // TODO: connect to OCR/LLM API
    setTimeout(() => {
      setIsAnalyzing(false)
      alert("Analysis complete (mock). We'll detect headers soon 😎")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900/60 backdrop-blur-lg border border-slate-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-full">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>

          <h1 className="text-2xl font-semibold text-white">Upload your document</h1>
          <p className="text-slate-400 text-sm">
            CleanDoc will automatically detect headers, sections, and structure.
          </p>

          <label
            htmlFor="file-upload"
            className="mt-4 w-full border-2 border-dashed border-slate-700 hover:border-blue-400 transition-all rounded-xl p-8 cursor-pointer text-slate-300"
          >
            {file ? (
              <div>
                <FileText className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p>{file.name}</p>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm">Click or drag to upload a document</p>
              </div>
            )}
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.jpg,.png"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          <button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="mt-6 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-5 py-2 text-sm font-medium transition-all"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}