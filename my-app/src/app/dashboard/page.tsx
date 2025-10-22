"use client";

import React, { useState } from "react";
import { Upload, Loader2, FileText, LayoutList, Eye } from "lucide-react";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [view, setView] = useState<"structured" | "raw">("structured");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/analyse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-6 py-10">
      <section className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-semibold mb-2">CleanDoc Dashboard</h1>
        <p className="text-slate-400 mb-8">
          Upload your file and let CleanDoc detect structure, headers, and content.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 mb-10">
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="block text-sm text-slate-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-500 file:text-white
              hover:file:bg-blue-600 transition-all"
          />

          <button
            onClick={handleAnalyze}
            disabled={!file || isLoading}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center gap-2 font-medium disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Analyze Document
              </>
            )}
          </button>
        </div>

        {result && (
          <>
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => setView("structured")}
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  view === "structured"
                    ? "bg-blue-600"
                    : "bg-slate-800 hover:bg-slate-700"
                } transition-all`}
              >
                <LayoutList className="w-4 h-4" /> Structured View
              </button>
              <button
                onClick={() => setView("raw")}
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  view === "raw"
                    ? "bg-blue-600"
                    : "bg-slate-800 hover:bg-slate-700"
                } transition-all`}
              >
                <FileText className="w-4 h-4" /> Raw Text
              </button>
            </div>

            {view === "structured" ? (
              <div className="space-y-6 text-left">
                {result.sections.map((section: any, i: number) => (
                  <div
                    key={i}
                    className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/40 transition-all"
                  >
                    <h3 className="text-xl font-semibold text-blue-400 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-left">
                <pre className="text-slate-300 text-sm whitespace-pre-wrap">
                  {result.rawText}
                </pre>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}