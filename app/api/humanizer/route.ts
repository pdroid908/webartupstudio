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
]as const;

/* =========================
   RATE LIMIT (EDGE SAFE)
========================= */
type RateData = {
  count: number;
  startTime: number;
};

const ipMap = new Map<string, RateData>();

const LIMIT = 5;
const WINDOW = 60 * 1000;

function cleanRateLimit(): void {
  const now = Date.now();

  for (const [ip, data] of ipMap.entries()) {
    if (now - data.startTime > WINDOW) {
      ipMap.delete(ip);
    }
  }
}

function rateLimit(ip: string): boolean {
  cleanRateLimit();

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

  ipMap.set(ip, {
    count: data.count + 1,
    startTime: data.startTime
  });

  return true;
}

/* =========================
   SECURITY
========================= */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sanitizeInput(text: string): string {
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
function humanizeText(text: string): string {
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
type RequestBody = {
  text?: string;
};

type ApiSuccess = {
  success: true;
  originalLength: number;
  resultLength: number;
  result: string;
};

type ApiError = {
  error: string;
  detail?: string;
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const ip: string =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(ip)) {
      const res: ApiError = {
        error: "Too many requests. wait 1 minute."
      };

      return NextResponse.json(res, { status: 429 });
    }

    let body: RequestBody;

    try {
      body = (await req.json()) as RequestBody;
    } catch {
      const res: ApiError = {
        error: "Invalid JSON"
      };

      return NextResponse.json(res, { status: 400 });
    }

    if (!body.text || typeof body.text !== "string") {
      const res: ApiError = {
        error: "Invalid input"
      };

      return NextResponse.json(res, { status: 400 });
    }

    let text: string = body.text.trim();

    if (!text) {
      const res: ApiError = {
        error: "Text required"
      };

      return NextResponse.json(res, { status: 400 });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      const res: ApiError = {
        error: "Text too large"
      };

      return NextResponse.json(res, { status: 413 });
    }

    text = sanitizeInput(text);

    const result: string = humanizeText(text);

    const response: ApiSuccess = {
      success: true,
      originalLength: text.length,
      resultLength: result.length,
      result
    };

    return NextResponse.json(response);
  } catch {
    const res: ApiError = {
      error: "Server error"
    };

    return NextResponse.json(res, { status: 500 });
  }
}