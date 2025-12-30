'use client'

import './globals.css'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Analytics } from '@vercel/analytics/next'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Sync auth changes with Supabase cookies (for SSR consistency)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      await fetch('/api/auth/set-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, session }),
      })
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <html lang="en">
<head>
<meta name="google-site-verification" content="GEhIL5p4eL2t-sYJHEb4OFm_nJKqeq-5WOBt-_vHRpc" />
</head>
      <body className="antialiased bg-white text-gray-900">
        {children}
        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  )
}