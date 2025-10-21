"use client"

import React from "react"

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-slate-200">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4 text-slate-400">
        CleanDoc respects your privacy. We only collect and process data necessary to provide our document-cleaning service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Information We Collect</h2>
      <p className="text-slate-400 mb-4">
        When you sign in with Google, we receive basic account information like your name and email address.
        We never access your files or personal content without your consent.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Your Data</h2>
      <p className="text-slate-400 mb-4">
        Your data is used only for authentication and personalization within CleanDoc.
        We do not sell, share, or store user content processed through the app.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Third-Party Services</h2>
      <p className="text-slate-400 mb-4">
        CleanDoc uses Supabase for authentication and database services. You can review Supabase’s privacy terms at{" "}
        <a
          href="https://supabase.com/privacy"
          target="_blank"
          className="text-blue-400 underline"
        >
          supabase.com/privacy
        </a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">Contact Us</h2>
      <p className="text-slate-400">
        If you have any questions about this policy, contact us at{" "}
        <a
          href="mailto:cleandoc.support@gmail.com"
          className="text-blue-400 underline"
        >
          cleandoc.support@gmail.com
        </a>.
      </p>

      <p className="text-sm text-slate-500 mt-12">Last updated: October 2025</p>
    </main>
  )
}