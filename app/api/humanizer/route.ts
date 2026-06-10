import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

const MAX_TEXT_LENGTH = 8000;

const DICTIONARY = [
  // ======================
  // TRANSISI NATURAL FORMAL
  // ======================
  { type: "phrase", find: "oleh karena itu", replace: "karena itu" },
  { type: "phrase", find: "oleh sebab itu", replace: "sehingga" },
  { type: "phrase", find: "dengan demikian", replace: "maka" },
  { type: "phrase", find: "hal ini menunjukkan bahwa", replace: "ini menunjukkan bahwa" },
  { type: "phrase", find: "hal tersebut menunjukkan bahwa", replace: "ini menandakan bahwa" },

  // ======================
  // REDUKSI GAYA AI AKADEMIK
  // ======================
  { type: "phrase", find: "dapat dikatakan bahwa", replace: "bisa disimpulkan bahwa" },
  { type: "phrase", find: "perlu diketahui bahwa", replace: "penting untuk diketahui" },
  { type: "phrase", find: "secara keseluruhan dapat disimpulkan bahwa", replace: "kesimpulannya" },
  { type: "phrase", find: "berdasarkan hasil analisis", replace: "dari hasil analisis" },
  { type: "phrase", find: "berdasarkan data yang diperoleh", replace: "berdasarkan data yang ada" },
  { type: "phrase", find: "berdasarkan data yang didapat", replace: "berdasarkan data yang ada" },

  // ======================
  // ANALISIS & PROSES
  // ======================
  { type: "phrase", find: "melakukan analisis terhadap", replace: "menganalisis" },
  { type: "phrase", find: "melakukan evaluasi terhadap", replace: "mengevaluasi" },
  { type: "phrase", find: "melakukan pengamatan terhadap", replace: "mengamati" },
  { type: "phrase", find: "melakukan penelitian terhadap", replace: "meneliti" },

  // ======================
  // SIMPLIFIKASI KALIMAT
  // ======================
  { type: "phrase", find: "yang mana", replace: "yang" },
  { type: "phrase", find: "di mana", replace: "yang" },
  { type: "phrase", find: "hal ini menyebabkan", replace: "ini menyebabkan" },
  { type: "phrase", find: "hal ini membuat", replace: "ini membuat" },
  { type: "phrase", find: "hal ini berarti", replace: "ini berarti" },

  // ======================
  // NATURAL CONNECTOR (HUMAN FLOW)
  // ======================
  { type: "phrase", find: "dalam konteks ini", replace: "di kondisi ini" },
  { type: "phrase", find: "sehubungan dengan itu", replace: "karena itu" },
  { type: "phrase", find: "dapat disimpulkan bahwa", replace: "kesimpulannya" },
  { type: "phrase", find: "hal ini berarti bahwa", replace: "artinya" },

  // ======================
  // EFISIENSI BAHASA
  // ======================
  { type: "phrase", find: "dapat meningkatkan", replace: "meningkatkan" },
  { type: "phrase", find: "dapat mengurangi", replace: "mengurangi" },
  { type: "phrase", find: "dapat mempercepat", replace: "mempercepat" },
  { type: "phrase", find: "dapat membantu meningkatkan", replace: "membantu meningkatkan" },
  { type: "phrase", find: "berhasil dalam meningkatkan", replace: "berhasil meningkatkan" },

  // ======================
  // PENYEDERHANAAN UMUM
  // ======================
  { type: "phrase", find: "secara keseluruhan", replace: "secara umum" },
  { type: "phrase", find: "secara umum", replace: "umumnya" },
  { type: "phrase", find: "pada akhirnya", replace: "akhirnya" },

  // ======================
  // WORD LEVEL (HUMAN FORMAL)
  // ======================
  { type: "word", find: "merupakan", replace: "adalah" },
  { type: "word", find: "terdapat", replace: "ada" },
  { type: "word", find: "dikarenakan", replace: "karena" },
  { type: "word", find: "guna", replace: "untuk" },
  { type: "word", find: "yakni", replace: "yaitu" },
  { type: "word", find: "kemudian", replace: "lalu" },
  { type: "word", find: "telah", replace: "sudah" },
  { type: "word", find: "melalui", replace: "dengan" },
  { type: "word", find: "yang mana", replace: "yang" },
  { type: "word", find: "di mana", replace: "yang" },
  { type: "word", find: "hal tersebut", replace: "itu" },
  { type: "word", find: "hal ini", replace: "ini" },
];

/* =========================
   RATE LIMIT (ANTI SPAM BASIC)
========================= */
const ipMap = new Map<string, { count: number; startTime: number }>();

const LIMIT = 5;
const WINDOW = 60 * 1000;

setInterval(() => {
  const now = Date.now();

  for (const [ip, data] of ipMap) {
    if (now - data.startTime > WINDOW) {
      ipMap.delete(ip);
    }
  }
}, 60_000);

function rateLimit(ip: string) {
  const now = Date.now();
  const data = ipMap.get(ip);

  if (!data) {
    ipMap.set(ip, { count: 1, startTime: now });
    return true;
  }

  if (now - data.startTime > WINDOW) {
    ipMap.set(ip, { count: 1, startTime: now });
    return true;
  }

  if (data.count >= LIMIT) return false;

  data.count++;
  return true;
}

/* =========================
   SECURITY HELPERS
========================= */

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// anti script injection basic
function sanitizeInput(text: string) {
  return text
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/javascript:/gi, "")
    .trim();
}

/* =========================
   HUMANIZER
========================= */

function humanizeText(text: string) {
  let result = text;

  for (const rule of DICTIONARY) {
    const escaped = escapeRegex(rule.find);

    const regex =
      rule.type === "word"
        ? new RegExp(`\\b${escaped}\\b`, "gi")
        : new RegExp(escaped, "gi");

    result = result.replace(regex, rule.replace);
  }

  return result;
}

/* =========================
   MAIN API
========================= */
export async function POST(req: NextRequest) {
  try {
    // IP detect
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // RATE LIMIT
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. wait 1 minute." },
        { status: 429 }
      );
    }

    // BODY SAFE PARSE (anti DoS payload)
    const raw = await req.text();

    if (raw.length > 10000) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413 }
      );
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    // VALIDATION
    if (!body?.text || typeof body.text !== "string") {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }

    let text = body.text.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Text required" },
        { status: 400 }
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: "Text too large" },
        { status: 413 }
      );
    }

    // SANITIZE
    text = sanitizeInput(text);

    // PROCESS
    const humanized = humanizeText(text);

    return NextResponse.json({
      success: true,
      originalLength: text.length,
      resultLength: humanized.length,
      result: humanized,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}