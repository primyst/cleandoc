'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LandingPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  // Check if user already has a session
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

  // OAuth login
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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700">Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 px-6">
      {/* Hero Section */}
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight">
          CleanDoc
        </h1>
        <p className="text-lg text-gray-700">
          Paste messy text → Get clean, readable, exportable <span className="font-semibold">DOC, PDF, or TXT</span> files instantly.
        </p>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in with Google'
          )}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Developed by <a href="https://aq-portfolio-rose.vercel.app/" className="underline hover:text-blue-600">Primyst</a>
        </p>
      </div>

      {/* Optional Sub-Feature Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl">
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h3 className="font-bold text-lg mb-2">Instant Cleanup</h3>
          <p className="text-gray-600">Paste messy text and get it formatted instantly.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h3 className="font-bold text-lg mb-2">Export Anywhere</h3>
          <p className="text-gray-600">Download as DOC, PDF, or TXT — ready to use anywhere.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md">
          <h3 className="font-bold text-lg mb-2">Universal Source</h3>
          <p className="text-gray-600">Works with PDFs, screenshots, WhatsApp messages, and scanned files.</p>
        </div>
      </div>
    </div>
  )
}