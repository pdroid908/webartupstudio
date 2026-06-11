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
      setError("Please enter some text first.");
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
        throw new Error(data.message || "Failed to process text");
      }

      setResult(data.result || "");
    } catch (err) {
      console.error(err);
      setError("Tunggu sebentar limit habis.");
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

  function clearAll() {
  setText("");
  setResult("");
  setError("");
  setCopied(false);
}

  return (
    <main className="relative min-h-screen overflow-hidden md:bg-slate-950 bg-slate-800">
      {/* Background Effects */}
      <div className="absolute left-[-150px] top-[-100px] h-[350px] w-[350px] rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute right-[-150px] top-[100px] h-[350px] w-[350px] rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute bottom-[-100px] left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 md:px-6">
        {/* HERO */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur">
            ✨ AI Humanizer Tool
          </div>

          <h1 className="text-4xl font-black text-white md:text-6xl lg:text-7xl">
            Humanize
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI Content
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-slate-400 md:text-lg">
            Convert robotic AI-generated text into natural,
            human-like writing with one click.
          </p>
        </div>

        {/* TOOL */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* INPUT */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-white">
                  Input Text
                </h2>

                <span
                  className={`text-sm ${
                    text.length > MAX_CHARS
                      ? "text-red-400"
                      : "text-slate-400"
                  }`}
                >
                  {text.length}/{MAX_CHARS}
                </span>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your AI generated content here..."
                className="md:h-[350px] h-[250px] w-full resize-none rounded-2xl border border-white/10 bg-slate-950 p-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Progress */}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full transition-all ${
                    text.length > MAX_CHARS
                      ? "bg-red-500"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500"
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
                <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  ⚠️ {error}
                </div>
              )}

              <div className="mt-5 flex gap-3">
  <button
    onClick={handleHumanize}
    disabled={
      loading ||
      !text.trim() ||
      text.length > MAX_CHARS
    }
    className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading ? "⏳ Processing..." : "✨ Humanize Now"}
  </button>

  <button
    onClick={clearAll}
    disabled={!text && !result && !error}
    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-slate-300 hover:bg-white/10 disabled:opacity-40"
  >
    🧹 Clear
  </button>
</div>
            </div>

            {/* OUTPUT */}
<div className="rounded-3xl border border-white/10 bg-slate-900/70 p-4">
  <div className="mb-3 flex items-center justify-between">
    <h2 className="font-semibold text-slate-100">
      Humanized Result
    </h2>

    {result && (
      <button
        onClick={copyResult}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
      >
        {copied ? "✅ Copied" : "📋 Copy"}
      </button>
    )}
  </div>

  <div className="h-[420px] overflow-auto rounded-2xl border border-white/10 bg-slate-800/40 p-6 text-slate-100 shadow-inner">
    {result ? (
      <div className="whitespace-pre-wrap leading-8 text-slate-100">
        {result}
      </div>
    ) : (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="mb-4 text-6xl">📝</div>

        <h3 className="font-semibold text-slate-300">
          No Result Yet / Belum ada hasil
        </h3>

        <p className="mt-2 text-slate-500">
          Humanized text will appear here
        </p>
      </div>
    )}
  </div>
</div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-3 text-3xl">⚡</div>
            <h3 className="font-semibold text-white">
              Fast Processing
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Get humanized content in seconds.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-3 text-3xl">🔒</div>
            <h3 className="font-semibold text-white">
              Secure
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Input validation and safe rendering.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="mb-3 text-3xl">✨</div>
            <h3 className="font-semibold text-white">
              Natural Writing
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Improve readability and human tone.
            </p>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-10 text-center text-sm text-slate-500">
          Maximum input: {MAX_CHARS.toLocaleString()} characters
        </div>
      </div>
    </main>
  );
}