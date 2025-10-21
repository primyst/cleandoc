"use client";

import { useState } from "react";
import { Loader2, Copy, Trash2, Sparkles } from "lucide-react";
import { detectStructure, rebuildDocument } from "@/utils/cleanDoc";

export default function Dashboard() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isCleaning, setIsCleaning] = useState(false);

  const handleClean = async () => {
    if (!input.trim()) return;
    setIsCleaning(true);
    await new Promise((r) => setTimeout(r, 300)); // simulate loading

    const structured = detectStructure(input);
    const cleaned = rebuildDocument(structured);
    setOutput(cleaned);

    setIsCleaning(false);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
          Clean Your Document
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="flex flex-col bg-slate-900/60 rounded-xl border border-slate-800 p-4">
            <label className="text-sm text-slate-400 mb-2">
              Raw OCR / Copied Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your messy text here..."
              className="flex-1 bg-transparent text-slate-200 resize-none min-h-[400px] outline-none"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-slate-400 hover:text-red-400 text-sm"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col bg-slate-900/60 rounded-xl border border-slate-800 p-4">
            <label className="text-sm text-slate-400 mb-2">
              Cleaned & Structured Text
            </label>
            <div className="flex-1 bg-transparent text-slate-200 whitespace-pre-wrap overflow-y-auto min-h-[400px] border border-slate-800 rounded-lg p-3">
              {isCleaning ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  Cleaning text...
                </div>
              ) : output ? (
                output
              ) : (
                <p className="text-slate-500 italic text-sm">
                  Output will appear here
                </p>
              )}
            </div>

            {output && (
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-slate-300 hover:text-blue-400 text-sm"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={handleClean}
            disabled={isCleaning}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-semibold text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            {isCleaning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Cleaning...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Clean Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}