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
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p>Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to SnapToDoc
      </h1>
      <p className="mb-6 text-center text-slate-300">
        Convert any printed or scanned document into editable files instantly.
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
    </div>
  )
}
