"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

/* =========================
   TYPE (TETAP)
========================= */
interface SentimentItem {
  text: string;
  label: "Positive" | "Negative" | "Neutral" | string;
  score: number;
}

interface TopicItem {
  word: string;
  score: number;
}

interface TopWordItem {
  word: string;
  count?: number;
  score?: number;
}

interface SentimentResult {
  query: string;
  source?: string;

  metadata?: {
    articles?: number;
    videos?: number;
    analyzed?: number;
    comments_analyzed?: number;
    comments_raw?: number;
  };

  sentiment_distribution?: {
    Positive: number;
    Negative: number;
    Neutral: number;
  };

  sentiment_percentage: {
    Positive: number;
    Negative: number;
    Neutral: number;
  };

  average_score?: number;
  average_sentiment_score?: number;

  dominant_sentiment?: string;

  top_words?: TopWordItem[];
  topics?: TopicItem[];

  sentiment_details_sample?: SentimentItem[];
  ["20 sample"]?: SentimentItem[];
}

/* =========================
   MAIN PAGE
========================= */
export default function BigDataPage() {
  const [mode, setMode] = useState<"news" | "Media Sosial">("news");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dominant =
    result?.dominant_sentiment ||
    (result
      ? (() => {
          const dist = result.sentiment_distribution;
          if (!dist) return "Unknown";

          const entries = Object.entries(dist) as [
            "Positive" | "Negative" | "Neutral",
            number,
          ][];

          const max = entries.reduce((a, b) => (b[1] > a[1] ? b : a));

          return max[0];
        })()
      : "Unknown");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);

    const endpoint = mode === "news" ? "/api/news_data" : "/api/yt_data";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: input }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal mengambil data");

      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const metadata = result?.metadata;

  const samples =
    result?.["20 sample"] || result?.sentiment_details_sample || [];

  const avgScore =
    result?.average_sentiment_score ?? result?.average_score ?? 0;

  /* =========================
     PIE DATA
  ========================= */
  const pieData = result
    ? [
        {
          name: "Positive",
          value: result.sentiment_distribution?.Positive || 0,
        },
        { name: "Neutral", value: result.sentiment_distribution?.Neutral || 0 },
        {
          name: "Negative",
          value: result.sentiment_distribution?.Negative || 0,
        },
      ]
    : [];

  const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

  /* =========================
     UI
  ========================= */
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f1117,#111827,#0a0f1c)",
        color: "white",
        padding: 20,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "auto" }}>
        {/* TITLE */}
        <h1 style={{ fontSize: "2rem", marginBottom: 20 }}>
          📊 Analisis Data Real Time
        </h1>

        {/* MODE */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          <button
            onClick={() => setMode("news")}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              background: mode === "news" ? "#3b82f6" : "#1f2937",
              color: "white",
              cursor: "pointer",
            }}
          >
            Artikel Berita
          </button>

          <button
            onClick={() => setMode("Media Sosial")}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              background: mode === "Media Sosial" ? "#ef4444" : "#1f2937",
              color: "white",
              cursor: "pointer",
            }}
          >
            Tanggapan Publik
          </button>
        </div>

        {/* INPUT */}
        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Masukkan keyword..."
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              background: "#111827",
              border: "1px solid #374151",
              color: "white",
              marginBottom: 10,
            }}
          />
<button
  type="submit"
  disabled={loading}
  style={{
    width: "100%",
    padding: 14,
    borderRadius: 12,
    // Jika loading, warna jadi lebih gelap (grayish), kalau tidak tetap hijau
    background: loading ? "#374151" : "#10b981",
    border: "none",
    cursor: loading ? "not-allowed" : "pointer",
    // Tambahkan flex agar spinner dan teks sejajar
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    color: "white",
    fontWeight: "bold",
    transition: "background 0.3s ease",
  }}
>
  {loading ? (
    <>
      <div className="spinner"></div>
      <span>Menganalisis ratusan data harap tunggu...</span>
    </>
  ) : (
    "Analisis Data"
  )}
</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* RESULT */}
        {result && (
          <>
            {/* QUERY */}
            <div style={cardStyle}>
              <h2>🔍 {result.query}</h2>
              <p style={{ color: "#9ca3af" }}>
                Source: {result.source ?? mode}
              </p>
            </div>

            {/* PIE + PERCENT BAR */}
            <div
  style={{
    display: "grid",
    // Menggunakan auto-fit agar otomatis pindah baris jika layar sempit
    // minmax(300px, 1fr) artinya: tiap kartu minimal 300px, jika layar lebih kecil, 
    // dia akan otomatis mengambil sisa ruang (1fr) dan menumpuk ke bawah.
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
    marginTop: 20,
  }}
>
  {/* PIE CHART */}
  <div style={cardStyle}>
    <h3>Sentiment Chart</h3>
    <div style={{ width: "100%", height: 300, display: "flex", justifyContent: "center" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            outerRadius={80}
            label // Label akan membantu menjaga chart tetap informatif
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* BAR */}
  <div style={cardStyle}>
    <h3>📈 Percentage</h3>
    <div style={{ marginTop: 10 }}>
      <SentimentBar
        label="Positive"
        value={result.sentiment_percentage.Positive}
        color="#22c55e"
      />
      <SentimentBar
        label="Neutral"
        value={result.sentiment_percentage.Neutral}
        color="#3b82f6"
      />
      <SentimentBar
        label="Negative"
        value={result.sentiment_percentage.Negative}
        color="#ef4444"
      />
    </div>
  </div>
</div>

            {/* 🔥 TOP WORDS (TAMBAHAN BARU) */}
            {result.top_words && result.top_words.length > 0 && (
              <div style={cardStyle}>
                <h3>🔥 Top Words</h3>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    marginTop: 10,
                  }}
                >
                  {result.top_words.map((w, i) => (
                    <span
                      key={i}
                      style={{
                        background: "#1f2937",
                        padding: "8px 12px",
                        borderRadius: 999,
                        border: "1px solid #374151",
                        fontSize: 13,
                      }}
                    >
                      {w.word} ({w.count ?? w.score ?? 0})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* METADATA (TETAP) */}
            <div style={gridStyle}>
              {metadata?.comments_analyzed !== undefined && (
                <StatCard
                  title="Comments Processed"
                  value={`${metadata.comments_analyzed} / ${metadata.comments_raw}`}
                />
              )}
              {metadata?.articles !== undefined && (
                <StatCard title="Articles" value={metadata.articles} />
              )}
              {metadata?.analyzed !== undefined && (
                <StatCard title="Analyzed" value={metadata.analyzed} />
              )}
            </div>

            {/* INSIGHT */}
            <div style={cardStyle}>
              <h3>🧠 Insight</h3>
              <p>
                Dominant: <b>{dominant}</b>
              </p>
              <p>Avg Score: {avgScore.toFixed(4)}</p>
            </div>

            {/* SAMPLE */}
            <div style={cardStyle}>
              <h3>📰 Sample Data</h3>

              {samples.slice(0, 10).map((item, i) => (
                <div key={i} style={sampleBox}>
                  <p>{item.text}</p>
                  <b>
                    {item.label} ({(item.score * 100).toFixed(1)}%)
                  </b>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================
   STYLES (biar rapi & konsisten)
========================= */
const cardStyle = {
  background: "#111827",
  padding: 20,
  borderRadius: 16,
  marginTop: 20,
  border: "1px solid #1f2937",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: 15,
  marginTop: 20,
};

const sampleBox = {
  background: "#1f2937",
  padding: 12,
  borderRadius: 10,
  marginBottom: 10,
};

/* =========================
   COMPONENTS
========================= */
function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={cardStyle}>
      <div style={{ color: "#9ca3af" }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: "bold" }}>{value}</div>
    </div>
  );
}

function SentimentBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div style={{ height: 8, background: "#374151", borderRadius: 999 }}>
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}
