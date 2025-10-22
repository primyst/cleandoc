'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { cleanText } from '@/utils/cleanText'
import { generateDocx } from '@/utils/exportDoc'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [raw, setRaw] = useState('')
  const [cleaned, setCleaned] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // ✅ Check Auth Session
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push('/') // redirect to landing if not signed in
      } else {
        setUser(data.session.user)
      }
      setIsLoading(false)
    }

    getUser()

    // ✅ Listen for sign out in another tab
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_OUT') router.push('/')
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  // ✅ Handle Sign Out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // ✅ Handle Text Cleaning
  const handleClean = () => {
    const result = cleanText(raw)
    setCleaned(result)
  }

  // ✅ Handle DOCX Download
  const handleDownload = async () => {
    setIsGenerating(true)
    const blob = await generateDocx(cleaned)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CleanDoc.docx'
    a.click()
    window.URL.revokeObjectURL(url)
    setIsGenerating(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-800">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">CleanDoc Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center">
          Paste. Clean. Export.
        </h2>
        <p className="text-center text-gray-500">
          Turn messy copied or scanned text into readable, exportable documents.
        </p>

        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Paste your messy text here..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none bg-white"
        />

        <div className="flex justify-center gap-4">
          <button
            onClick={handleClean}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Clean Text
          </button>

          {cleaned && (
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Download DOCX'}
            </button>
          )}
        </div>

        {cleaned && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg font-mono whitespace-pre-wrap text-sm">
            {cleaned}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        Built with ❤️ by{' '}
        <a
          href="https://aq-portfolio-rose.vercel.app/"
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          Primyst
        </a>
      </footer>
    </div>
  )
}