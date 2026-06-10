"use client";

import { useState } from "react";

const MAX_CHARS = 8000;

export default function HumanizerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleHumanize() {
    setError("");

    if (!text.trim()) {
      setError("Please enter some text.");
      return;
    }

    if (text.length > MAX_CHARS) {
      setError(`Maximum ${MAX_CHARS} characters allowed.`);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/humanizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to process text"
        );
      }

      setResult(data.result || "");
    } catch (error) {
      console.error(error);
      setError("Failed to process text.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResult() {
    if (!result) return;

    await navigator.clipboard.writeText(result);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* HERO */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm bg-white shadow-sm mb-4">
            ✨ AI Humanizer
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Humanize AI Text
          </h1>

          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Transform AI-generated content into more natural,
            readable and human-like writing.
          </p>
        </div>

        {/* TOOL */}
        <div className="bg-white rounded-3xl border shadow-lg p-5 md:p-8">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* INPUT */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">
                  Input Text
                </h2>

                <span
                  className={`text-sm ${
                    text.length > MAX_CHARS
                      ? "text-red-500"
                      : "text-slate-500"
                  }`}
                >
                  {text.length} / {MAX_CHARS}
                </span>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                className="w-full h-[350px] p-4 rounded-2xl border border-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-black"
              />

              {/* Progress Bar */}
              <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    text.length > MAX_CHARS
                      ? "bg-red-500"
                      : "bg-black"
                  }`}
                  style={{
                    width: `${Math.min(
                      (text.length / MAX_CHARS) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleHumanize}
                disabled={
                  loading ||
                  !text.trim() ||
                  text.length > MAX_CHARS
                }
                className="mt-5 w-full bg-black text-white rounded-2xl py-3 font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading
                  ? "Processing..."
                  : "✨ Humanize Text"}
              </button>
            </div>

            {/* OUTPUT */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">
                  Humanized Result
                </h2>

                {result && (
                  <button
                    onClick={copyResult}
                    className="border rounded-xl px-4 py-2 text-sm hover:bg-slate-50"
                  >
                    {copied
                      ? "✅ Copied"
                      : "📋 Copy"}
                  </button>
                )}
              </div>

              <div className="h-[350px] overflow-auto rounded-2xl border border-slate-300 bg-slate-50 p-4">
                {result ? (
                  <div className="whitespace-pre-wrap text-slate-700">
                    {result}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                    <div className="text-5xl mb-3">
                      📝
                    </div>

                    <p>
                      Humanized text will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-2xl border p-5">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold">
              Fast Processing
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Humanize content in seconds.
            </p>
          </div>

          <div className="bg-white rounded-2xl border p-5">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold">
              Secure
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Safe rendering and validation.
            </p>
          </div>

          <div className="bg-white rounded-2xl border p-5">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-semibold">
              Natural Writing
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Improve readability and flow.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}