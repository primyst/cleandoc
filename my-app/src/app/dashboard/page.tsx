'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { LogOut, Upload, FileText, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (!session) {
        router.push('/')
      } else {
        setUser(session.user)
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          CleanDoc Dashboard
        </h1>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
        >
          {loggingOut ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Signing out...
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" /> Sign out
            </>
          )}
        </button>
      </header>

      {/* Welcome */}
      <section className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-blue-500/10 p-4 rounded-full mb-4">
          <FileText className="w-10 h-10 text-blue-400" />
        </div>

        <h2 className="text-3xl font-bold mb-3">Welcome back 👋</h2>
        <p className="text-slate-400 mb-8">
          {user?.email ? `Logged in as ${user.email}` : 'Fetching user info...'}
        </p>

        <button
          onClick={() => router.push('/analyse')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg transition"
        >
          <Upload className="w-4 h-4" />
          Start Cleaning Documents
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 mt-10">
        &copy; {new Date().getFullYear()} CleanDoc • Secure & Smart Document Processing
      </footer>
    </main>
  )
      }
