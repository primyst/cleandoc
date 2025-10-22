"use client";

import { useState } from "react";
import { extractTextFromPDF } from "@/lib/pdfParser";
import { detectSections } from "@/lib/cleanDocParser";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);

    try {
      let extractedText = "";

      if (file.type === "application/pdf") {
        extractedText = await extractTextFromPDF(file);
      } else {
        extractedText = "Image OCR not implemented yet.";
      }

      const result = detectSections(extractedText);
      console.log("Detected structure:", result);

      alert("Detected " + result.sections.length + " sections ✅");
    } catch (error) {
      console.error(error);
      alert("Failed to analyze document.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-semibold mb-6">Analyze a Document</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleAnalyze}
        disabled={!file || isAnalyzing}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-60"
      >
        {isAnalyzing ? "Analyzing..." : "Start Analysis"}
      </button>
    </main>
  );
}