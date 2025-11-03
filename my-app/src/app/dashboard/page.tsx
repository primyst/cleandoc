'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { cleanTextByPlan } from '@/utils/cleanText'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, CheckCircle2, Lock, Sparkles, Copy, Check, X } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [inputText, setInputText] = useState('')
  const [cleanedText, setCleanedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [copied, setCopied] = useState(false)

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

  const handleClean = () => {
    setLoading(true)
    setTimeout(() => {
      const result = cleanTextByPlan(inputText, plan)
      setCleanedText(result)
      setLoading(false)
    }, 300)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUpgrade = () => {
    setShowUpgrade(true)
  }

  const closeUpgradeModal = () => setShowUpgrade(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header Bar */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">CleanDoc</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-sm">
              <div className={`w-2 h-2 rounded-full ${plan === 'pro' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span className="font-medium">{plan === 'pro' ? 'Pro' : 'Free'}</span>
            </div>
            {plan === 'free' && (
              <Button 
                onClick={handleUpgrade} 
                className="bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-slate-600">
            Clean and format your text with {plan === 'pro' ? 'AI-powered precision' : 'smart automation'}
          </p>
        </div>

        {/* Main Editor Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Input Section */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b px-6 py-3">
              <h2 className="font-semibold text-slate-900">Input</h2>
            </div>
            <CardContent className="p-6">
              <textarea
                className="w-full h-80 p-4 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none text-sm font-mono transition-all"
                placeholder="Paste your messy text here...&#10;&#10;Try pasting text with:&#10;• Extra spaces and line breaks&#10;• Inconsistent capitalization&#10;• Emojis and special characters&#10;• Formatting issues"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {inputText.length} characters
                </span>
                <Button 
                  onClick={handleClean} 
                  disabled={loading || !inputText}
                  className="bg-slate-900 text-white hover:bg-slate-800 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 w-4 h-4" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Clean Text
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b px-6 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Output</h2>
              {cleanedText && (
                <Button
                  onClick={handleCopy}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-slate-600 hover:text-slate-900"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
            <CardContent className="p-6">
              {cleanedText ? (
                <div className="relative">
                  <pre className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono whitespace-pre-wrap overflow-auto">
                    {cleanedText}
                  </pre>
                  {plan === 'free' && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg text-white text-sm">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold mb-1">Unlock Pro Features</p>
                          <p className="text-slate-200 text-xs">
                            Get AI formatting, smart headers, and unlimited text processing
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-80 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg">
                  <div className="text-center text-slate-400">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Your cleaned text will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Comparison */}
        <Card className="shadow-sm border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b px-6 py-3">
            <h2 className="font-semibold text-slate-900">Plan Comparison</h2>
          </div>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <div className="rounded-xl border-2 border-slate-200 p-6 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <span className="text-lg">🆓</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Free Plan</h3>
                    <p className="text-xs text-slate-500">Perfect for basic cleaning</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Basic text cleaning</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Remove emojis & symbols</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Auto-capitalize sentences</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Lock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-400">Limited to 300 words</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <Lock className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-400">No AI formatting</span>
                  </li>
                </ul>
              </div>

              {/* Pro Plan */}
              <div className="rounded-xl border-2 border-slate-900 p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Pro Plan</h3>
                      <p className="text-xs text-slate-300">Advanced AI-powered features</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Smart paragraph & header detection</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Expand contractions & fix grammar</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Highlight keywords & emails</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Remove duplicates & deep clean</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="font-semibold">Unlimited text processing</span>
                    </li>
                  </ul>
                  {plan === 'free' && (
                    <Button
                      onClick={handleUpgrade}
                      className="w-full mt-6 bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg"
                    >
                      Upgrade Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">Upgrade to Pro</h2>
                </div>
                <button
                  onClick={closeUpgradeModal}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <p className="text-sm text-slate-600">
                Unlock professional-grade text cleaning with AI
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                {[
                  'AI-powered formatting',
                  'Unlimited text cleaning',
                  'Smart header & bullet detection',
                  'Keyword highlighting',
                  'Priority support'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl p-4 text-white">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold">$9</span>
                  <span className="text-slate-300 text-sm">/month</span>
                </div>
                <p className="text-xs text-slate-300">Cancel anytime • 30-day money-back guarantee</p>
              </div>

              <Button className="w-full bg-gradient-to-r from-slate-900 to-slate-700 text-white py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                Continue to Payment
              </Button>

              <button
                onClick={closeUpgradeModal}
                className="w-full text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}