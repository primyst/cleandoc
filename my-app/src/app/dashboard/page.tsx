'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { generateDocx } from '@/lib/exportDoc'
import { generatePDF } from '@/lib/pdfExport'
import { cleanText } from '@/utils/cleanText'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [rawText, setRawText] = useState('')
  const [cleanedText, setCleanedText] = useState('')
  const [isAIFormat, setIsAIFormat] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) router.push('/')
      else {
        setUser(user)
        // Check user plan (replace this with actual plan check)
        const { data } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
        if (data?.plan) setPlan(data.plan)
      }
    }
    fetchUser()
  }, [router])

  const handleClean = () => {
    const cleaned = cleanText(rawText)
    setCleanedText(cleaned)
  }

  const handleExport = (type: 'pdf' | 'docx') => {
    if (type === 'pdf') generatePDF(cleanedText)
    else generateDocx(cleanedText)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">CleanDoc Dashboard</h1>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Logout
          </button>
        </div>

        {/* Plan Notice */}
        {plan === 'free' && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              You’re using the <strong>Free Plan.</strong> Unlock AI formatting and faster downloads by upgrading to Pro.
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        {/* Text Areas */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Messy Text</h2>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Paste your messy text here..."
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Clean Output</h2>
            <textarea
              value={cleanedText}
              readOnly
              className="w-full h-64 p-3 border border-gray-300 bg-gray-50 rounded-lg focus:outline-none"
              placeholder="Cleaned text will appear here..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={handleClean}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            Clean Text
          </button>

          <button
            onClick={() => handleExport('pdf')}
            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium"
          >
            Export PDF
          </button>

          <button
            onClick={() => handleExport('docx')}
            className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium"
          >
            Export DOCX
          </button>

          {/* Only Pro users can use AI formatting */}
          {plan === 'pro' && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isAIFormat}
                onChange={(e) => setIsAIFormat(e.target.checked)}
                className="w-4 h-4"
              />
              Use AI formatting (Pro)
            </label>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-3">Upgrade to Pro</h2>
            <p className="text-gray-600 mb-6">
              Unlock advanced AI formatting, instant downloads, and priority support.
            </p>

            <button
              onClick={() => alert('🧾 Payment flow coming soon...')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium w-full"
            >
              Proceed to Payment
            </button>

            <button
              onClick={() => setShowUpgradeModal(false)}
              className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}