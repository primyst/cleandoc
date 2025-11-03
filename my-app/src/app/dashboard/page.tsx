'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import cleanTextPro from '@/utils/cleanTextPro' // ✅ Default import
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, LogOut } from 'lucide-react'

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

  // ✅ Handle Clean
  const handleClean = () => {
    setLoading(true)
    setTimeout(() => {
      const result = cleanTextPro(inputText, false)
      setCleanedText(result)
      setLoading(false)
    }, 300)
  }

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white/70 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                onClick={() => setShowUpgrade(true)}
                className="bg-gradient-to-r from-black to-gray-800 text-white shadow-sm hover:from-gray-900 hover:to-gray-700 transition-all"
              >
                Upgrade to Pro
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-gray-100 transition-all"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Input */}
        <Card className="shadow-sm hover:shadow-md transition-all duration-200">
          <CardContent className="p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">📝 Enter Your Text</h2>
            <textarea
              className="w-full h-48 md:h-64 p-4 border rounded-lg bg-white focus:ring-2 focus:ring-black focus:outline-none text-gray-700 placeholder:text-gray-400 resize-none"
              placeholder="Paste your messy text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleClean}
                disabled={loading || !inputText}
                className="px-6 py-2 bg-black text-white hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={16} />}
                Clean Text
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        {cleanedText && (
          <Card className="shadow-sm border border-gray-200">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">🧾 Cleaned Text</h2>
              <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {cleanedText.split('\n\n').map((line, idx) => (
                  <p key={idx} className={line.startsWith('**') ? 'font-bold' : ''}>
                    {line.replace(/\*\*/g, '')}
                  </p>
                ))}
              </div>

              {plan === 'free' && (
                <div className="text-center text-sm text-gray-500 border-t pt-3">
                  You’re on the Free Plan — unlock <b>AI Formatting</b>, <b>Smart Headers</b>, and
                  <b> Unlimited Text Cleaning</b> by upgrading to Pro.
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-lg animate-in fade-in scale-in duration-200">
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
            <Button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-900 transition-all">
              Continue to Payment
            </Button>
            <button
              onClick={() => setShowUpgrade(false)}
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