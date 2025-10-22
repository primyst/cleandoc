import * as React from 'react'

interface EmailTemplateProps {
  firstName: string
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, color: '#111' }}>
      <h1>Welcome to <span style={{ color: '#2B2F36' }}>CleanDoc</span>, {firstName} 👋</h1>
      <p>
        We’re excited to have you! 🎉  
        You can now clean up messy text, fix formatting, and export beautiful documents instantly.
      </p>
      <p>Start cleaning your first document → <a href="https://cleandoc-ai.vercel.app/dashboard">Go to Dashboard</a></p>
      <p style={{ color: '#555', fontSize: 13 }}>– The CleanDoc Team</p>
    </div>
  )
}