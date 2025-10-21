"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { ArrowRight, Zap, FileText, Share2, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
        redirectTo: window.location.origin, // 👈 simpler redirect
      },
    });
    if (error) {
      console.error("Login error:", error.message);
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-400 border-t-blue-200 rounded-full animate-spin" />
          <p className="text-slate-300 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
        <h1 className="text-xl font-semibold tracking-tight">CleanDoc</h1>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          {isLoading ? "Connecting..." : "Try for free"}
          <ArrowRight size={18} />
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
            Clean messy documents into <span className="text-blue-400">ready-to-send</span> perfection ✨
          </h1>
          <p className="text-lg text-slate-400 mb-8">
            CleanDoc uses smart formatting to fix spacing, remove noise, and organize your documents — instantly.
          </p>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 mx-auto bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-lg font-medium transition disabled:opacity-50"
          >
            {isLoading ? "Connecting..." : "Start with Google"}
            <ArrowRight size={20} />
          </button>
        </div>
      </main>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-20 max-w-5xl mx-auto">
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <Zap className="text-blue-400 mb-4" size={28} />
          <h3 className="text-xl font-semibold mb-2">Instant Cleanup</h3>
          <p className="text-slate-400">
            Upload your text or document and watch it transform into a clean, well-formatted version in seconds.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <FileText className="text-blue-400 mb-4" size={28} />
          <h3 className="text-xl font-semibold mb-2">Smart Formatting</h3>
          <p className="text-slate-400">
            Automatically adjust headers, paragraphs, and spacing to professional standards.
          </p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <Share2 className="text-blue-400 mb-4" size={28} />
          <h3 className="text-xl font-semibold mb-2">Easy Export</h3>
          <p className="text-slate-400">
            Download your cleaned document or share it instantly with others.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} CleanDoc. Built for clarity and speed.
      </footer>
    </div>
  );
}