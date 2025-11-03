'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { cleanTextByPlan } from '@/utils/cleanTextByPlan'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle2, Lock } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [inputText, setInputText] = useState('')
  const [cleanedText, setCleanedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  // ✅ Fetch user info and plan
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push('/')
        return
      }

      setUser(data.user)

      // Fetch user plan (from profiles table ideally)
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', data.user.id)
        .single()

      setPlan(profile?.plan === 'pro' ? 'pro' : 'free')
    }

    getUser()
  }, [router])

  // 🧹 Clean text action
  const handleClean = () => {
    setLoading(true)
    setTimeout(() => {
      const result = cleanTextByPlan(inputText, plan)
      setCleanedText(result)
      setLoading(false)
    }, 300)
  }

  // 💳 Fake Upgrade Modal (for now)
  const handleUpgrade = () => {
    setShowUpgrade(true)
  }

  const closeUpgradeModal = () => setShowUpgrade(false)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 🧭 Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Hi, {user?.user_metadata?.full_name || 'User'} 👋
            </h1>
            <p className="text-sm text-gray-500">
              You’re on the <span className="font-semibold">{plan.toUpperCase()}</span> Plan
            </p>
          </div>

          {plan === 'free' && (
            <Button onClick={handleUpgrade} className="bg-black text-white">
              Upgrade to Pro
            </Button>
          )}
        </div>

        {/* ✍️ Input Section */}
        <Card>
          <CardContent className="p-4">
            <textarea
              className="w-full h-40 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Paste your messy text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="mt-3 flex justify-end">
              <Button onClick={handleClean} disabled={loading || !inputText}>
                {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                Clean Text
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ✨ Cleaned Output */}
        {cleanedText && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">🧾 Cleaned Text</h2>
              <pre className="bg-gray-100 p-3 rounded-md text-sm whitespace-pre-wrap">
                {cleanedText}
              </pre>
              {plan === 'free' && (
                <div className="text-center text-sm text-gray-500 border-t pt-3">
                  You’re on the Free Plan — unlock <b>AI Formatting</b>, <b>Smart Headers</b>, and
                  <b> Long Text Support</b> by upgrading to Pro.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 💎 Plan Benefits */}
        <Card className="mt-10 border-2 border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">✨ Plan Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <div className="border rounded-lg p-4 bg-white">
                <h4 className="font-semibold text-lg mb-3">🆓 Free Plan</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Basic text cleaning</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Removes emojis & symbols</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Capitalizes sentences</li>
                  <li className="flex items-center gap-2"><Lock size={16} /> Limited to 300 words</li>
                  <li className="flex items-center gap-2"><Lock size={16} /> No AI formatting</li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div className="border rounded-lg p-4 bg-gradient-to-br from-gray-900 to-gray-700 text-white">
                <h4 className="font-semibold text-lg mb-3">🚀 Pro Plan</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Smart paragraph and header detection</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Expands contractions & fixes grammar</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Highlights keywords & emails</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Removes duplicates & cleans deeply</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={16} /> No word limit</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 💳 Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full text-center space-y-4">
            <h2 className="text-xl font-bold">Upgrade to CleanDoc Pro ✨</h2>
            <p className="text-sm text-gray-600">
              Unlock AI-powered formatting, longer text support, and professional polish for all your documents.
            </p>
            <div className="border rounded-lg p-4 bg-gray-50 text-sm text-gray-700 space-y-1">
              <p>✅ AI Formatting</p>
              <p>✅ Unlimited text cleaning</p>
              <p>✅ Smart header & bullet detection</p>
              <p>✅ Keyword highlighting</p>
              <p>✅ Priority support</p>
            </div>
            <Button className="w-full bg-black text-white py-2 rounded-md">
              Continue to Payment
            </Button>
            <button onClick={closeUpgradeModal} className="text-gray-500 text-sm underline">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}