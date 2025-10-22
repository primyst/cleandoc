'use client'

import { useState } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Send file to /analyse route
  const handleAnalyse = async () => {
    if (!file) return alert('Please upload a file first.')
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/analyse', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      setResult(data.text || 'No readable text found.')
    } catch (err) {
      console.error(err)
      alert('Error analyzing document.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
          <FileText className="w-8 h-8 text-blue-500" />
          CleanDoc Analyzer
        </h1>

        {/* Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-4">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="cursor-pointer text-blue-600 flex flex-col items-center gap-2"
          >
            <Upload className="w-6 h-6" />
            {file ? (
              <span className="font-medium">{file.name}</span>
            ) : (
              <span className="font-medium">Click to upload a document</span>
            )}
          </label>
        </div>

        {/* Analyse Button */}
        <button
          onClick={handleAnalyse}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
            </>
          ) : (
            'Analyze Document'
          )}
        </button>

        {/* Result Section */}
        {result && (
          <div className="mt-8 text-left bg-gray-100 p-4 rounded-xl max-h-80 overflow-y-auto">
            <h2 className="font-semibold text-gray-700 mb-2">Extracted Text:</h2>
            <pre className="whitespace-pre-wrap text-sm text-gray-800">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}