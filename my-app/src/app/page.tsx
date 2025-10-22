'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LandingPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

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

  const handleLogin = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      console.error('Login error:', error.message)
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
          <p className="text-stone-600 font-light tracking-wide">Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* Header */}
      <header className="pt-8 pb-4 px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-semibold tracking-tight text-stone-800">CleanDoc</div>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="px-6 py-2.5 bg-stone-800 hover:bg-stone-900 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </header>

      {/* Hero Section */}
      <main className="px-8 py-20 max-w-5xl mx-auto">
        <div className="text-center space-y-12">
          {/* Unique 3D Document Visual */}
          <div className="relative h-64 flex items-center justify-center mb-16">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Background scattered papers */}
              <div className="absolute w-48 h-56 bg-stone-200 rounded-lg transform -rotate-12 translate-x-16 translate-y-4 opacity-40" 
                   style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }} />
              <div className="absolute w-48 h-56 bg-stone-200 rounded-lg transform rotate-6 -translate-x-20 translate-y-8 opacity-40"
                   style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }} />
              
              {/* Main clean document */}
              <div className="relative w-56 h-64 bg-white rounded-xl transform transition-transform duration-300 hover:scale-105"
                   style={{ 
                     boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)',
                   }}>
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-stone-800 rounded w-3/4" />
                  <div className="h-2 bg-stone-300 rounded w-full" />
                  <div className="h-2 bg-stone-300 rounded w-5/6" />
                  <div className="h-2 bg-stone-300 rounded w-full" />
                  <div className="h-2 bg-stone-300 rounded w-4/5" />
                  <div className="pt-4 h-2 bg-stone-300 rounded w-3/4" />
                  <div className="h-2 bg-stone-300 rounded w-full" />
                  <div className="h-2 bg-stone-300 rounded w-2/3" />
                </div>
                {/* Subtle corner fold */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-stone-100 transform origin-top-right"
                     style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight leading-tight text-stone-900">
              Paste messy text.
              <br />
              <span className="font-semibold">Get clean documents.</span>
            </h1>
            
            <p className="text-xl text-stone-600 font-light leading-relaxed max-w-2xl mx-auto">
              Transform unformatted text into professional, exportable documents — DOC, PDF, or TXT — in seconds.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group px-10 py-4 bg-stone-800 hover:bg-stone-900 text-white text-lg font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
            <p className="text-sm text-stone-500 mt-4 font-light">
              No credit card required • Free to start
            </p>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-stone-200 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-900">Instant Cleanup</h3>
            <p className="text-stone-600 font-light leading-relaxed">
              Paste messy text from any source and watch it transform into beautifully formatted documents.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-stone-200 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-900">Export Anywhere</h3>
            <p className="text-stone-600 font-light leading-relaxed">
              Download as DOC, PDF, or TXT. Compatible with all major platforms and document editors.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-12 h-12 bg-stone-200 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-stone-900">Universal Source</h3>
            <p className="text-stone-600 font-light leading-relaxed">
              Works with PDFs, screenshots, WhatsApp messages, and even scanned documents.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-stone-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-stone-500 font-light">
            © 2025 CleanDoc. All rights reserved.
          </div>
          <div className="text-sm text-stone-500 font-light">
            Developed by{' '}
            <a 
              href="https://aq-portfolio-rose.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
            >
              primyst
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}