"use client"

import React from "react"

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-slate-200">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4 text-slate-400">
        Welcome to CleanDoc. By using our website and services, you agree to these Terms of Service.
        Please read them carefully before continuing.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of Service</h2>
      <p className="text-slate-400 mb-4">
        CleanDoc is a tool designed to clean and format messy text or scanned content into readable, shareable documents.
        You agree to use this service only for lawful purposes and in a way that does not infringe the rights of others.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. User Accounts</h2>
      <p className="text-slate-400 mb-4">
        To access certain features, you may need to sign in with your Google account.
        You are responsible for maintaining the confidentiality of your login information
        and any activity that occurs under your account.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. User Content</h2>
      <p className="text-slate-400 mb-4">
        You retain full ownership of any text or files you upload. CleanDoc does not claim any rights over your content.
        Uploaded data is processed temporarily and not stored permanently unless required for service functionality.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Service Availability</h2>
      <p className="text-slate-400 mb-4">
        We aim to provide uninterrupted access to CleanDoc, but we cannot guarantee continuous uptime.
        Maintenance, updates, or technical issues may cause temporary disruptions.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Limitation of Liability</h2>
      <p className="text-slate-400 mb-4">
        CleanDoc is provided “as is” without warranties of any kind.
        We are not responsible for any data loss, errors, or damages resulting from the use of our service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Changes to Terms</h2>
      <p className="text-slate-400 mb-4">
        We may update these Terms occasionally. Continued use of the service after changes take effect means
        you agree to the revised terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Contact</h2>
      <p className="text-slate-400">
        For questions about these Terms, contact us at{" "}
        <a
          href="mailto:abdullateefqudusleeq@gmail.com"
          className="text-blue-400 underline"
        >
          abdullateefqudusleeq@gmail.com
        </a>.
      </p>

      <p className="text-sm text-slate-500 mt-12">Last updated: October 2025</p>
    </main>
  )
}