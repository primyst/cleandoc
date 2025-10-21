"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowRight,
  FileText,
  Share2,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCleaned, setShowCleaned] = useState(false);

  // ✅ Auth logic
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (session) {
        router.push("/dashboard");
      } else {
        setIsChecking(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Login error:", error.message);
      setIsLoading(false);
    }
  };

  // 🔄 Toggle demo every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCleaned((prev) => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-300 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center px-6 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4 font-[Inter]">
          Clean messy text. <span className="text-blue-400">Instantly.</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          Paste OCR, scanned, or copied text — CleanDoc fixes spacing,
          punctuation, and formatting in seconds.
        </p>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-60 mx-auto"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              Try CleanDoc
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl">
        {[
          {
            icon: <FileText className="w-6 h-6 text-blue-400" />,
            title: "Fix Line Breaks",
            desc: "Turn messy copied text into clean, readable paragraphs.",
          },
          {
            icon: <CheckCircle2 className="w-6 h-6 text-blue-400" />,
            title: "Correct OCR Errors",
            desc: "Smartly remove weird characters and spacing from scans.",
          },
          {
            icon: <Share2 className="w-6 h-6 text-blue-400" />,
            title: "Export Anywhere",
            desc: "Copy, download, or share cleaned text instantly.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-blue-500/40 transition-all"
          >
            <div className="mb-3">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Demo Section */}
      <section className="mt-20 w-full max-w-4xl text-center">
        <h2 className="text-3xl font-semibold mb-8">See the magic</h2>

        <div className="relative grid md:grid-cols-2 gap-8 text-left transition-all">
          <div
            className={`p-6 rounded-2xl bg-slate-900/60 border ${
              showCleaned
                ? "border-slate-800 opacity-50"
                : "border-blue-500/40 opacity-100"
            } transition-all duration-700`}
          >
            <div className="absolute top-3 right-3 text-xs text-slate-500">
              Before
            </div>
            <p className="text-slate-400 whitespace-pre-line text-sm leading-relaxed">
              {`THIS  IS
A SAMPLE TEXT 
copied from a pdf with 
weird line breaks   and  inconsistent
spacing.`}
            </p>
          </div>

          <div
            className={`p-6 rounded-2xl bg-slate-900/60 border ${
              showCleaned
                ? "border-blue-500/40 opacity-100"
                : "border-slate-800 opacity-50"
            } transition-all duration-700`}
          >
            <div className="absolute top-3 right-3 text-xs text-blue-400">
              After
            </div>
            <p className="text-slate-200 text-sm leading-relaxed">
              This is a sample text copied from a PDF with proper line breaks
              and consistent spacing.
            </p>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="mt-10 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 font-medium mx-auto disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              Try It Now <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-slate-500 text-sm space-y-2">
        <p>
          <a href="/privacy" className="hover:text-blue-400 transition-colors">
            Privacy Policy
          </a>{" "}
          ·{" "}
          <a href="/terms" className="hover:text-blue-400 transition-colors">
            Terms of Service
          </a>
        </p>
        <p>Made with ❤️ by Abdulqudus</p>
      </footer>
    </main>
  );
}