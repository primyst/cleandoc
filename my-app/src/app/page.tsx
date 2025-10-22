'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { ArrowRight, LogIn, FileText } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [loading, setLoading] = useState(false)

  // Check session — if logged in, redirect to dashboard
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (session) {
        router.push('/dashboard')
      } else {
        setChecking(false)
      }
    }
    checkSession()
  }, [router])

  // Handle Google login
  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error(error)
      setLoading(false)
    }
  }

  // Loading screen while checking session
  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Checking session...</p>
        </div>
      </div>
    )
  }

  // Main landing
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center px-6">
      <header className="absolute top-6 left-6 text-xl font-semibold">
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          CleanDoc
        </span>
      </header>

      <section className="text-center max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-blue-500/10 p-4 rounded-full mb-2">
            <FileText className="w-8 h-8 text-blue-400" />
          </div>

          <h1 className="text-5xl font-bold mb-3">
            Clean your documents effortlessly
          </h1>
          <p className="text-slate-400 max-w-md">
            Upload, extract, and organize content intelligently — headers, sections,
            and structured text, all in one click.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Continue with Google
                </>
              )}
            </button>

            <button
              onClick={() => router.push('/docs')}
              className="px-8 py-3 border border-slate-700 hover:border-slate-500 rounded-lg font-medium text-slate-300 hover:text-white transition-all"
            >
              Learn More
            </button>
          </div>

          <p className="text-slate-500 text-sm mt-6">
            Free to use • Built with ❤️ by CleanDoc Team
          </p>
        </div>
      </section>

      <footer className="absolute bottom-6 text-xs text-slate-600">
        &copy; {new Date().getFullYear()} CleanDoc. All rights reserved.
      </footer>
    </main>
  )
}
