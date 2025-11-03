'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { cleanTextByPlan } from '@/utils/cleanText'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle2, Lock, LogOut } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [inputText, setInputText] = useState('')
  const [cleanedText, setCleanedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  // ✅ Fetch user info
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push('/')
        return
      }

      setUser(data.user)
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', data.user.id)
        .single()

      setPlan(profile?.plan === 'pro' ? 'pro' : 'free')
    }
    getUser()
  }, [router])

  // 🧹 Handle clean
  const handleClean = () => {
    setLoading(true)
    setTimeout(() => {
      const result = cleanTextByPlan(inputText, plan)
      setCleanedText(result)
      setLoading(false)
    }, 300)
  }

  // 💳 Upgrade
  const handleUpgrade = () => setShowUpgrade(true)
  const closeUpgradeModal = () => setShowUpgrade(false)

  // 🚪 Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Hi, {user?.user_metadata?.full_name || 'User'} 👋
            </h1>
            <p className="text-sm text-gray-500">
              You’re on the <span className="font-semibold">{plan.toUpperCase()}</span> plan
            </p>
          </div>

          <div className="flex items-center gap-3">
            {plan === 'free' && (
              <Button
                onClick={handleUpgrade}
                className="bg-gradient-to-r from-black to-gray-800 text-white shadow-sm"
              >
                Upgrade to Pro
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* Input */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">📝 Enter Your Text</h2>
            <textarea
              className="w-full h-48 p-4 border rounded-lg bg-white focus:ring-2 focus:ring-black focus:outline-none text-gray-700 placeholder:text-gray-400"
              placeholder="Paste your messy text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleClean}
                disabled={loading || !inputText}
                className="px-6 py-2 bg-black text-white hover:bg-gray-900 transition-all"
              >
                {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                Clean Text
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        {cleanedText && (
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">🧾 Cleaned Text</h2>
              </div>
              <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {cleanedText}
              </pre>

              {plan === 'free' && (
                <div className="text-center text-sm text-gray-500 border-t pt-3">
                  You’re on the Free Plan — unlock <b>AI Formatting</b>, <b>Smart Headers</b>, and
                  <b> Unlimited Text Cleaning</b> by upgrading to Pro.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Plan comparison */}
        <section>
          <h3 className="text-2xl font-bold mb-5 text-gray-800">💎 Plan Comparison</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition">
              <h4 className="font-semibold text-lg mb-4">🆓 Free Plan</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Basic text cleaning</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Removes emojis & symbols</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Capitalizes sentences</li>
                <li className="flex items-center gap-2 text-gray-400"><Lock size={16} /> Limited to 300 words</li>
                <li className="flex items-center gap-2 text-gray-400"><Lock size={16} /> No AI formatting</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="rounded-xl p-6 bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-md hover:shadow-lg transition">
              <h4 className="font-semibold text-lg mb-4">🚀 Pro Plan</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Smart paragraph & header detection</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Expands contractions & fixes grammar</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Highlights keywords & emails</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Removes duplicates & cleans deeply</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> No word limit</li>
              </ul>
              <div className="mt-6 text-center">
                <Button
                  onClick={handleUpgrade}
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 transition"
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-lg animate-in fade-in duration-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              Upgrade to CleanDoc Pro ✨
            </h2>
            <p className="text-sm text-gray-600 text-center">
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
            <button
              onClick={closeUpgradeModal}
              className="block mx-auto text-gray-500 text-sm underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}