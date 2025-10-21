"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowRight,
  FileText,
  Share2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCleaned, setShowCleaned] = useState(false);

  // 🔐 Auth logic
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
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

  // ✨ Toggle demo effect
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

  const features = [
    {
      icon: FileText,
      title: "Fix Line Breaks",
      description: "Transform messy OCR text into clean, readable paragraphs.",
    },
    {
      icon: CheckCircle2,
      title: "Correct OCR Errors",
      description:
        "Smartly remove weird characters, duplicate spaces, and formatting errors.",
    },
    {
      icon: Share2,
      title: "Export Anywhere",
      description: "Copy, download, or share cleaned text instantly.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-6 px-6 sm:px-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-200 to-blue-100 bg-clip-text text-transparent">
                CleanDoc
              </span>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Dashboard
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 sm:px-8 py-20 sm:py-32 text-center max-w-4xl mx-auto space-y-8 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm text-blue-200">
            <Sparkles className="w-4 h-4" /> AI-Powered Text Cleaning
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            Turn <span className="text-blue-300">Messy OCR</span> Into
            <span className="block bg-gradient-to-r from-blue-200 via-blue-300 to-blue-100 bg-clip-text text-transparent mt-2">
              Polished Text Instantly
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CleanDoc takes your messy copied or scanned text and transforms it
            into clean, readable, perfectly formatted content — no manual edits
            needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-xl shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Try CleanDoc
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <button
              onClick={() => router.push("/docs")}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-semibold text-lg rounded-xl transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              Learn More
            </button>
          </div>

          {/* Animated Demo */}
          <div className="max-w-4xl mx-auto mt-24 grid md:grid-cols-2 gap-8 text-left relative">
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
        </section>

        {/* Features Section */}
        <section className="max-w-5xl mx-auto mt-24">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="group p-6 sm:p-8 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 hover:border-blue-500/50 rounded-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700/50 mt-24 py-12 px-6 sm:px-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} CleanDoc. All rights reserved.
            </p>
            <p className="text-slate-500 text-sm mt-4 sm:mt-0">
              Built with ✨ by Abdulqudus
            </p>
          </div>
        </footer>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
}