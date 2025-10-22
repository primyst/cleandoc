'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push('/') // redirect to landing if no session
      } else {
        setUser(data.session.user)
      }
      setIsLoading(false)
    }

    getUser()

    // Optional: listen to auth changes (sign out from another tab)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-slate-900">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
        >
          Sign Out
        </button>
      </header>

      <main>
        <p>Welcome, {user?.email}!</p>
        {/* Your dashboard content goes here */}
      </main>
    </div>
  )
}
