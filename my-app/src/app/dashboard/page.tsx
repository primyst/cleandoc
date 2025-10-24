'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { supabase } from '@/lib/supabaseClient'
import { cleanText } from '@/utils/cleanText'
import { generateDocx } from '@/utils/exportDoc'
import { generatePDF } from '@/lib/pdfExport'
import { uploadFile } from '@/lib/supabaseStorage'
import { getUserDocuments } from '@/lib/documentHistory'

export default function Dashboard() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [rawText, setRawText] = useState('')
  const [cleanedText, setCleanedText] = useState('')
  const [isAIFormat, setIsAIFormat] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [docs, setDocs] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isPremium, setIsPremium] = useState(true) // temporary Pro access

  // ✅ Check user session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setUser(data.session.user)
        await loadHistory(data.session.user.id)
      } else {
        router.push('/')
      }
      setIsChecking(false)
    }
    checkSession()
  }, [router])

  // ✅ Load user document history
  const loadHistory = async (userId: string) => {
    const userDocs = await getUserDocuments(userId)
    setDocs(userDocs)
  }

  // ✅ Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // ✅ Clean text (AI or normal)
  const handleClean = async () => {
    if (!rawText.trim()) return
    setIsLoading(true)

    let result = rawText
    if (isAIFormat && isPremium) {
      const res = await fetch('/api/ai-format', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: rawText }),
      })
      const data = await res.json()
      result = data.text || rawText
    } else {
      result = cleanText(rawText)
    }

    setCleanedText(result)
    setIsLoading(false)
  }

  // ✅ Generate DOCX
  const handleDownloadDocx = async () => {
    if (!cleanedText) return
    setIsGenerating(true)
    const blob = await generateDocx(cleanedText)

    if (user) {
      await uploadFile(blob, `docx-${Date.now()}.docx`, user.id)
      await loadHistory(user.id)
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CleanDoc.docx'
    a.click()
    URL.revokeObjectURL(url)
    setIsGenerating(false)
  }

  // ✅ Generate PDF
  const handleDownloadPDF = async () => {
    if (!cleanedText) return
    setIsGenerating(true)
    const blob = await generatePDF(cleanedText)

    if (user) {
      await uploadFile(blob, `pdf-${Date.now()}.pdf`, user.id)
      await loadHistory(user.id)
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CleanDoc.pdf'
    a.click()
    URL.revokeObjectURL(url)
    setIsGenerating(false)
  }

  // ✅ Smooth loading session screen
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <div className="text-center animate-pulse">
          <div className="w-10 h-10 border-4 border-stone-400 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-stone-600 tracking-wide text-sm">Verifying your session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 px-8 py-12 max-w-5xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-semibold">CleanDoc Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg transition"
        >
          Logout
        </button>
      </header>

      {/* Cleaner Section */}
      <section className="mb-12 space-y-4">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste your messy text here..."
          className="w-full h-40 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-stone-700">
            <input
              type="checkbox"
              checked={isAIFormat}
              onChange={(e) => setIsAIFormat(e.target.checked)}
              disabled={!isPremium}
            />
            Use AI formatting (Pro)
          </label>

          <button
            onClick={handleClean}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isLoading ? 'Cleaning...' : 'Clean Text'}
          </button>

          {cleanedText && (
            <>
              <button
                onClick={handleDownloadDocx}
                disabled={isGenerating}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {isGenerating ? 'Generating...' : 'Download DOCX'}
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
            </>
          )}
        </div>

        {/* Formatted Preview */}
        {cleanedText && (
          <div className="mt-6 p-6 bg-white rounded-lg shadow-sm prose max-w-none">
            <ReactMarkdown>{cleanedText}</ReactMarkdown>
          </div>
        )}
      </section>

      {/* User Document History */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        {docs.length === 0 && <p className="text-stone-500">No documents yet.</p>}

        {docs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 border rounded-lg flex justify-between items-center bg-white hover:bg-stone-100 transition"
          >
            <span className="truncate">{doc.filename}</span>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Download
            </a>
          </div>
        ))}
      </section>
    </div>
  )
}