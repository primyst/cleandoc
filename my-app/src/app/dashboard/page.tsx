'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const [cleaned, setCleaned] = useState('')
  const [isAIFormat, setIsAIFormat] = useState(false)
  const [docs, setDocs] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [plan, setPlan] = useState<'free' | 'pro'>('free') // ✅ user plan state

  // ✅ Check user session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setUser(data.session.user)
        setIsChecking(false)
        loadHistory(data.session.user.id)
        fetchUserPlan(data.session.user.id) // ✅ Fetch plan
      } else {
        router.push('/')
      }
    }
    checkSession()
  }, [router])

  // ✅ Load user documents
  const loadHistory = async (userId: string) => {
    const userDocs = await getUserDocuments(userId)
    setDocs(userDocs)
  }

  // ✅ Fetch user’s subscription plan from Supabase
  const fetchUserPlan = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching plan:', error.message)
      setPlan('free')
      return
    }

    setPlan(data?.plan || 'free')
  }

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // ✅ Clean text
  const handleClean = async () => {
    if (!rawText.trim()) return
    setIsLoading(true)

    let result = rawText

    if (isAIFormat && plan === 'pro') {
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

    setCleaned(result)
    setIsLoading(false)
  }

  // ✅ Download DOCX
  const handleDownloadDocx = async () => {
    if (!cleaned) return
    setIsGenerating(true)
    const blob = await generateDocx(cleaned)

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

  // ✅ Download PDF
  const handleDownloadPDF = async () => {
    if (!cleaned) return
    setIsGenerating(true)
    const blob = await generatePDF(cleaned)

    if (user) {
      await uploadFile(blob, `pdf-${Date.now()}.pdf`, user.id)
      await loadHistory(user.id)
    }

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CleanDoc.pdf'
    a.click()
    window.URL.revokeObjectURL(url)
    setIsGenerating(false)
  }

  // ✅ Still checking session
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <p className="text-stone-600 font-light tracking-wide">Checking session...</p>
      </div>
    )
  }

  // ✅ Dashboard UI
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 px-8 py-12 max-w-5xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-2xl font-semibold">CleanDoc Dashboard</h1>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 text-sm rounded-full ${
              plan === 'pro' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {plan === 'pro' ? 'Pro User' : 'Free Plan'}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Upgrade Banner */}
      {plan === 'free' && (
        <div className="p-4 mb-8 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-yellow-800">
            You’re using the <strong>Free Plan</strong>. Unlock AI formatting and faster downloads
            by upgrading to <strong>Pro</strong>.
          </p>
          <button className="mt-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg">
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Text cleaner */}
      <section className="mb-12 space-y-4">
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste messy text here..."
          className="w-full h-40 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAIFormat}
              onChange={(e) => setIsAIFormat(e.target.checked)}
              disabled={plan !== 'pro'}
            />
            Use AI formatting (Pro)
          </label>

          <button
            onClick={handleClean}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {isLoading ? 'Cleaning...' : 'Clean Text'}
          </button>

          {cleaned && (
            <>
              <button
                onClick={handleDownloadDocx}
                disabled={isGenerating}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              >
                {isGenerating && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {isGenerating ? 'Generating...' : 'Download DOCX'}
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                {isGenerating && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </button>
            </>
          )}
        </div>

        {cleaned && (
          <div className="mt-4 p-4 bg-stone-100 rounded-lg font-sans whitespace-pre-wrap leading-relaxed text-stone-800">
            {cleaned}
          </div>
        )}
      </section>

      {/* User documents */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Documents</h2>
        {docs.length === 0 && <p className="text-stone-500">No documents yet.</p>}

        {docs.map((doc) => (
          <div key={doc.id} className="p-4 border rounded-lg flex justify-between items-center">
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
        ))}
      </section>
    </div>
  )
}