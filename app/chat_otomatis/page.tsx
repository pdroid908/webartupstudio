"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
interface ChatMessage {
  user: string;
  ai: string;
}

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;

    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        {
          user: userMessage,
          ai: data.reply || "Tidak ada respons.",
        },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          user: userMessage,
          ai: "Terjadi kesalahan saat menghubungi AI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-500/20 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px]" />

        <div
          className="
        absolute inset-0
        opacity-[0.04]
        bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)]
        bg-[size:40px_40px]
      "
        />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10 mb-10">
          <div className="max-w-5xl mx-auto h-16 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border border-cyan-500/30">
                <Image
                  src="/Mio.webp"
                  alt="Mio"
                  width={44}
                  height={44}
                  className="object-cover"
                  priority
                />
              </div>

              <div>
                <h1 className="font-semibold">Mio</h1>

                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main
          className="
        flex-1
        overflow-y-auto
        scrollbar-thin
        scrollbar-thumb-white/10
      "
        >
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Welcome */}
            {chat.length === 0 && !loading && (
              <div className="h-[70vh] flex flex-col justify-center items-center text-center md:mt-2 mt-10">
                <h2 className="text-2xl md:text-5xl font-bold">
                  Selamat Datang
                </h2>

                <p className="mt-4 text-slate-400 max-w-xl text-sm md:text-lg">
                  Kami menjual jasa pembuatan website, alat otomatisasi, dan
                  project digital lainnya dengan teknologi terbaru. anda bisa
                  mengembangkan ide alat digital dan kami yang memprosesnya.
                </p>

                <div className="grid md:grid-cols-2 gap-3 mt-10 w-full max-w-2xl">
                  {["Jasa", "tentang artup?","siapa kamu?", "penting kontak developer!"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setInput(item)}
                      className="
p-3 md:p-4
text-sm md:text-base
rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    hover:bg-white/10
                    text-left
                    transition
                  "
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-8">
              {chat.map((msg, index) => (
                <div key={index}>
                  {/* USER */}
                  <div className="flex justify-end mb-5">
                    <div
                      className="
  max-w-[85%]
  rounded-3xl
  rounded-br-lg
  px-4 md:px-5
  py-3 md:py-4
  text-sm md:text-base
  bg-gradient-to-r
  from-cyan-500
  via-sky-500
  to-blue-600
"
                    >
                      {msg.user}
                    </div>
                  </div>

                  {/* AI */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <Image
                        src="/Mio.webp"
                        alt="AI"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>

                    <div
                      className="
  flex-1
  rounded-3xl
  rounded-tl-lg
  border
  border-white/10
  bg-gradient-to-br
  from-white/10
  to-white/[0.03]
  backdrop-blur-xl
  p-4 md:p-5
  text-slate-200
  text-sm md:text-base
  leading-6 md:leading-8
  shadow-lg
  shadow-black/20
"
                    >
                      {msg.ai}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading */}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600" />

                  <div
                    className="
                  px-5
                  py-4
                  rounded-3xl
                  bg-white/5
                  border
                  border-white/10
                "
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150" />
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-300" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>
        </main>

        {/* Input */}
        <div className="sticky bottom-0 p-4">
          <div
            className="
          max-w-4xl
          mx-auto
          rounded-3xl
          border
          border-white/10
          bg-black/40
          backdrop-blur-2xl
          p-3
          shadow-2xl
          shadow-black/40
        "
          >
            <div className="flex items-end gap-3">
              <textarea
                rows={1}
                value={input}
                disabled={loading}
                placeholder="Tanyakan apa saja..."
                onChange={(e) => setInput(e.target.value)}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height =
                    e.currentTarget.scrollHeight + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
               className="
flex-1
resize-none
bg-transparent
px-4
py-3
text-sm md:text-base
text-white
outline-none
max-h-[180px]
placeholder:text-slate-500
"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="
              h-12
              px-6
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              font-semibold
              hover:scale-105
              transition
              disabled:opacity-50
            "
              >
                {loading ? "..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
