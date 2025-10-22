'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LandingPage(): JSX.Element {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // ✅ 1. Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/dashboard')
      } else {
        setIsChecking(false)
      }
    }
    checkSession()
  }, [router])

  // ✅ 2. Detect new login (OAuth success)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // extract user info
          const email = session.user.email
          const name =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            'there'

          // ✅ call API to send welcome email
          await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name }),
          })
        } catch (err) {
          console.error('Email sending failed:', err)
        }

        router.push('/dashboard')
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [router])

  // ✅ 3. OAuth login handler
  const handleLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Login error:', error.message)
      setIsLoading(false)
    }
  }

  // rest of your component (spinner + hero + footer)
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FBF9F7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#E6E1DD] border-t-[#CFC7BC] rounded-full animate-spin" />
          <p className="text-[#7A766F] font-light tracking-wide">Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FBF9F7] text-neutral-900">
      {/* Import Poppins locally for this component */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
      `}</style>

      {/* Header */}
      <header className="pt-8 pb-6 px-6 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center" style={{ boxShadow: '0 6px 18px rgba(16, 24, 40, 0.06)' }}>
            {/* subtle logo mark */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-neutral-900">
              <rect x="3" y="3" width="18" height="18" rx="3" fill="#F7F5F3" stroke="#D9D6D1" />
              <path d="M7 10.5h10M7 13.5h6" stroke="#7A766F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-lg font-semibold tracking-tight text-[#2F2B28]">CleanDoc</div>
        </div>

        <div>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="px-5 py-2.5 bg-[#2B2F36] hover:bg-[#23272b] text-white text-sm font-medium rounded-lg transition-shadow duration-200 shadow-sm hover:shadow-md disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </header>

      {/* Split Hero */}
      <main className="px-6 py-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        {/* Left: Copy + CTA */}
        <div className="md:col-span-6 lg:col-span-7">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extralight leading-tight text-[#242423]">
              Paste messy text.
              <br />
              <span className="font-semibold">Get clean documents.</span>
            </h1>

            <p className="mt-6 text-lg text-[#6B675F] font-light leading-relaxed">
              Transform copied, scanned, or photographed text into neat, editable documents — DOC, PDF, or TXT — in seconds. No messy line breaks, no manual cleanup.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#2B2F36] hover:bg-[#23272b] text-white text-lg font-medium shadow-lg transition-transform transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>

              <a
                href="#features"
                className="text-sm text-[#6B675F] hover:text-[#2F2B28] font-medium transition-colors"
              >
                Learn how it works →
              </a>
            </div>

            <div className="mt-6 text-sm text-[#8D8984]">
              <span>No credit card • Free to start</span>
            </div>
          </div>
        </div>

        {/* Right: Illustration (clean workspace / subtle 3D) */}
        <div className="md:col-span-6 lg:col-span-5 flex justify-center md:justify-end">
          <div
            aria-hidden
            className="w-[380px] h-[280px] relative rounded-2xl"
            style={{ perspective: 900 }}
          >
            {/* subtle shadow base */}
            <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: '0 30px 60px rgba(16,24,40,0.06)' }} />

            {/* desk card */}
            <div
              className="relative bg-white rounded-2xl p-6 transform -rotate-2 translate-y-1"
              style={{
                width: '380px',
                height: '260px',
                boxShadow: '0 18px 40px rgba(16,24,40,0.08)',
              }}
            >
              {/* small header bar */}
              <div className="h-2 w-20 bg-[#F3EFEA] rounded-full mb-4" />

              {/* mini laptop / paper and coffee layout */}
              <div className="flex items-start gap-4">
                {/* laptop / document */}
                <div className="w-40 h-24 bg-[#FBFAF8] rounded-lg p-3" style={{ boxShadow: 'inset 0 -8px 20px rgba(16,24,40,0.02)' }}>
                  <div className="h-2 bg-[#EDE9E4] rounded w-10/12 mb-2" />
                  <div className="h-2 bg-[#ECE8E2] rounded w-3/4 mb-1.5" />
                  <div className="h-2 bg-[#ECE8E2] rounded w-2/3" />
                </div>

                {/* vertical small notepad */}
                <div className="flex flex-col justify-between">
                  <div className="w-20 h-12 bg-[#FBFAF8] rounded-md p-2" />
                  <div className="w-10 h-10 bg-[#F7E9D9] rounded-full flex items-center justify-center text-xs font-semibold text-[#7A5C2D]">
                    ☕
                  </div>
                </div>
              </div>

              {/* small decorative sticky note */}
              <div className="absolute top-6 right-6 w-16 h-12 bg-[#FFF4E6] rounded-md" style={{ transform: 'rotate(6deg)', boxShadow: '0 6px 18px rgba(16,24,40,0.06)' }} />
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h4 className="text-lg font-semibold text-[#2F2B28]">Instant Cleanup</h4>
            <p className="mt-2 text-[#6B675F] text-sm leading-relaxed font-light">
              Paste messy text and get beautifully formatted documents without manual editing.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h4 className="text-lg font-semibold text-[#2F2B28]">Export Anywhere</h4>
            <p className="mt-2 text-[#6B675F] text-sm leading-relaxed font-light">
              Export to DOC, PDF, or TXT — compatible with all editors and platforms.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h4 className="text-lg font-semibold text-[#2F2B28]">Multiple Sources</h4>
            <p className="mt-2 text-[#6B675F] text-sm leading-relaxed font-light">
              Works with PDFs, screenshots, WhatsApp messages, OCR output and scanned documents.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-[#E9E6E2]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-[#8D8984]">© {new Date().getFullYear()} CleanDoc. All rights reserved.</div>
          <div className="text-sm text-[#8D8984]">
            Developed by{' '}
            <a
              href="https://aq-portfolio-rose.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2F2B28] font-medium hover:underline"
            >
              primyst
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}