'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { generateDocx } from '@/utils/exportDoc'
import { cleanText } from '@/utils/cleanText'
import { uploadFile } from '@/lib/supabaseStorage'
import { getUserDocuments } from '@/lib/documentHistory'
import { marked } from 'marked'

export default function Dashboard() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [rawText, setRawText] = useState('')
  const [cleanTextResult, setCleanTextResult] = useState('')
  const [isAIFormat, setIsAIFormat] = useState(false)
  const [docs, setDocs] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPremium, setIsPremium] = useState(true) // temporary Pro access for testing

  // ✅ Proper session check (avoids stuck "checking session" state)
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        if (data.session) {
          setUser(data.session.user)
          await loadHistory(data.session.user.id)
        } else {
          router.push('/')
          return
        }
      } catch (err) {
        console.error('Session check error:', err)
        router.push('/')
      } finally {
        setIsChecking(false)
      }
    }

    checkSession()
  }, [router])

  const loadHistory = async (userId: string) => {
    const userDocs = await getUserDocuments(userId)
    setDocs(userDocs)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

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

    setCleanTextResult(result)
    setIsLoading(false)
  }

  const handleDownloadDocx = async () => {
    if (!cleanTextResult) return
    setIsGenerating(true)
    const blob = await generateDocx(cleanTextResult)

    if (user) {
      await uploadFile(blob, `docx-${Date.now()}.docx`, user.id)
      await loadHistory(user.id)
    }

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CleanDoc.docx'
    a.click()
    window.URL.revokeObjectURL(url)
    setIsGenerating(false)
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <p className="text-stone-600 font-light tracking-wide">Checking session...</p>
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
          className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg"
        >
          Logout
        </button>
      </header>

      {/* Text cleaner */}
      <section className="mb-12 space-y-4">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste messy text here..."
          className="w-full h-40 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isAIFormat}
              onChange={(e) => setIsAIFormat(e.target.checked)}
            />
            Use AI Formatting
            {!isPremium && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md">
                Coming soon (Pro)
              </span>
            )}
          </label>

          <button
            onClick={handleClean}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isLoading ? 'Cleaning...' : 'Clean Text'}
          </button>

          {cleanTextResult && (
            <button
              onClick={handleDownloadDocx}
              disabled={isGenerating}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {isGenerating ? 'Generating...' : 'Download DOCX'}
            </button>
          )}
        </div>

        {cleanTextResult && (
          <div
            className="mt-4 p-6 bg-white rounded-lg border prose prose-stone max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(cleanTextResult) }}
          />
        )}
      </section>

      {/* Document history */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        {docs.length === 0 ? (
          <p className="text-stone-500">No documents yet.</p>
        ) : (
          docs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <span>{doc.filename}</span>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download
              </a>
            </div>
          ))
        )}
      </section>
    </div>
  )
}