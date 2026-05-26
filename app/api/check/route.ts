import { NextResponse } from "next/server";
export const runtime = "edge";

const whitelist = [
  // --- KOMUNIKASI & MEDSOS (Official Only) ---
  "whatsapp.com",
  "facebook.com",
  "instagram.com",
  "x.com",
  "twitter.com",
  "telegram.org",
  "t.me", // Shortener resmi Telegram
  "linkedin.com",
  "discord.com",
  "tiktok.com",
  "stackblitz.com", // Editor kode online
  "codesandbox.io", // Editor kode online
  "w3schools.com", // Edukasi teknis
  "stackoverflow.com", // Edukasi teknis
  "elevenia.co.id",
  "jd.id",
  "bhinneka.com",
  "zalora.co.id",
  "sociolla.com",
  "halodoc.com", // Layanan kesehatan resmi
  "alodokter.com",
  "kemdikbud.go.id",
  "prakerja.go.id",
  "layanan.go.id",
  "sso.go.id",

  // --- INFRASTRUKTUR & SEARCH ENGINE ---
  "google.com",
  "g.co", // Shortener resmi Google
  "google.co.id",
  "bing.com",
  "yahoo.com",
  "apple.com",
  "icloud.com",
  "microsoft.com",
  "android.com",
  "cloudflare.com",
  "github.com", // Penting untuk developer

  // --- PEMERINTAH, PENDIDIKAN & MILITER (Induk TLD) ---
  "go.id",
  "ac.id",
  "sch.id",
  "mil.id",
  "gov",
  "edu",
  "ristekdikti.go.id",

  // --- PERBANKAN INDONESIA (Resmi Terdaftar OJK) ---
  "bca.co.id",
  "klikbca.com",
  "bankmandiri.co.id",
  "bri.co.id",
  "bni.co.id",
  "btn.co.id",
  "banksyariahindonesia.co.id",
  "bpddiy.co.id",
  "bankdki.co.id",
  "bankjateng.co.id",
  "bankjatim.co.id",
  "cimbniaga.co.id",
  "danamon.co.id",
  "maybank.co.id",
  "permatabank.com",
  "jenius.com",
  "bi.go.id",
  "ojk.go.id",

  // --- EKOSISTEM DIGITAL, DOMPET & FINTECH ---
  "tokopedia.com",
  "gojek.com",
  "gopay.co.id",
  "shopee.co.id",
  "shopeepay.co.id",
  "traveloka.com",
  "dana.id",
  "ovo.id",
  "linkaja.id",
  "midtrans.com",
  "xendit.co",
  "grab.com",
  "bukalapak.com",
  "blibli.com",
  "lazada.co.id",
  "tiket.com",

  // --- BUMN & LAYANAN VITAL ---
  "kai.id",
  "pertamina.com",
  "pln.co.id",
  "telkom.co.id",
  "telkomsel.com",
  "posindonesia.co.id",
  "garuda-indonesia.com",
  "bpjs-kesehatan.go.id",
  "bpjsketenagakerjaan.go.id",

  // --- HIBURAN & STREAMING RESMI ---
  "netflix.com",
  "googleusercontent.com",
  "youtube.com",
  "youtu.be",
  "disneyplus.com",
  "hotstar.com",

  // --- STORE & UPDATE RESMI ---
  "play.google.com",
  "appstore.com",
  "microsoft.com",
  "steamcommunity.com",
  "steampowered.com",

  // --- PAYMENT GLOBAL ---
  "visa.com",
  "mastercard.com",
  "paypal.com",
  "stripe.com",
];

const sensitiveKeywords = [
  "login",
  "signin",
  "password",
  "otp",
  "pin",
  "verifikasi",
  "akun",
  "banking",
];

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    const { url: inputUrl } = await req.json();
    if (!inputUrl)
      return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // 1. Normalisasi & Decoder
    let url = inputUrl.trim();

    const base64Regex =
      /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
    if (base64Regex.test(url) && url.length > 20) {
      try {
        const decoded = atob(url);
        if (decoded.startsWith("http")) url = decoded;
      } catch (e) {
        /* ignore */
      }
    }

    // --- PROTEKSI PINTU DEPAN ---
    if (url.length > 700 || /[<>"'@\s]/.test(url)) {
      return NextResponse.json(
        { error: "Invalid URL format", finalStatus: "BAHAYA" },
        { status: 400 },
      );
    }

    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    if (
      url.includes("<") ||
      url.includes(">") ||
      url.includes('"') ||
      url.includes(" ")
    ) {
      return NextResponse.json(
        {
          error: "Nice Try Diddy >_<",
          finalStatus: "BAHAYA",
        },
        { status: 400 },
      );
    }

    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, "");

    if (domain === "webartupstudio.pages.dev") {
      return NextResponse.json(
        { error: "Self-scan detected", finalStatus: "AMAN" },
        { status: 400 },
      );
    }

    // 3. AMBIL DOMAIN

    const parts = domain.split(".");
    const rootDomain =
      domain.endsWith(".co.id") || domain.endsWith(".net.id")
        ? parts.slice(-3).join(".")
        : parts.slice(-2).join(".");

    // 1. BONGKAR KODE RAHASIA (Contoh: %6c%6f -> lo)
    const decodedUrl = decodeURIComponent(url).toLowerCase();
    const hostname = urlObj.hostname.replace("www.", "");
    const cleanUrlText = decodedUrl
      .replace(/[^a-z0-9]/g, "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "");

    // 2. CEK DOMAIN KETAT (Gunakan endsWith agar tidak tertipu bca.co.id.palsu.com)
    const isWhitelisted = whitelist.some(
      (w) => hostname === w || hostname.endsWith("." + w),
    );

    // 3. DETEKSI REDIRECT (Cek semua parameter, jika ada 'http' di dalamnya = Redirect)
    const hasRedirectParam = Array.from(urlObj.searchParams.values()).some(
      (val) => val.includes("http://") || val.includes("https://"),
    );

    // 4. DETEKSI MANIPULASI (Jika ada nama bank di domain asing)
    const isManipulated =
      !isWhitelisted &&
      whitelist.some((w) => hostname.includes(w.split(".")[0]));

    console.log(`\n--- START SCAN: ${url} ---`);

    // 2. FUNGSI VIRUSTOTAL (DIPERBAIKI)
    const getVirusTotalData = async (targetUrl: string) => {
  const cleanUrl = targetUrl.trim();

  const headers = {
    "x-apikey": process.env.VIRUSTOTAL_API_KEY as string,
  };

  try {
    // ====================================================
    // CEK HASIL YANG SUDAH ADA DULU
    // ====================================================

    const urlId = Buffer.from(cleanUrl)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const existingRes = await fetch(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      { headers }
    );

    if (existingRes.ok) {
      const existingData = await existingRes.json();

      if (existingData?.data?.attributes?.last_analysis_stats) {
        console.log("[VT] Menggunakan hasil yang sudah tersedia");
        return existingData;
      }
    }

    // ====================================================
    // BELUM ADA DATA → KIRIM SCAN BARU
    // ====================================================

    console.log("[VT] Mengirim scan baru...");

    const scanRes = await fetch(
      "https://www.virustotal.com/api/v3/urls",
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          url: cleanUrl,
        }),
      }
    );

    if (!scanRes.ok) {
      console.error("[VT] Gagal submit scan");
      return null;
    }

    const scanData = await scanRes.json();

    const analysisId = scanData?.data?.id;

    if (!analysisId) {
      console.error("[VT] Analysis ID tidak ditemukan");
      return null;
    }

    console.log(`[VT] Analysis ID: ${analysisId}`);

    // ====================================================
    // TUNGGU SAMPAI COMPLETED
    // ====================================================

    let completed = false;

    for (let attempt = 1; attempt <= 20; attempt++) {
      const analysisRes = await fetch(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        { headers }
      );

      if (!analysisRes.ok) {
        break;
      }

      const analysisData = await analysisRes.json();

      const status =
        analysisData?.data?.attributes?.status;

      console.log(
        `[VT] Polling ${attempt}/20 | Status: ${status}`
      );

      if (status === "completed") {
        completed = true;
        break;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );
    }

    if (!completed) {
      console.warn(
        "[VT] Analysis belum selesai, mengambil hasil sementara"
      );
    }

    // ====================================================
    // AMBIL HASIL FINAL
    // ====================================================

    const finalRes = await fetch(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      { headers }
    );

    if (!finalRes.ok) {
      return null;
    }

    return await finalRes.json();
  } catch (error) {
    console.error("[VT ERROR]", error);
    return null;
  }
};

    // 3. FUNGSI GOOGLE DENGAN DEBUG LENGKAP
    const fetchGoogleWithTimeout = async (targetUrl: string) => {
      console.log(`[GOOGLE] Memulai pengecekan Safe Browsing...`);
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 7000); // 7 detik biar lebih lega

      try {
        const res = await fetch(
          `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              client: { clientId: "artup-security", clientVersion: "1.0.0" },
              threatInfo: {
                threatTypes: [
                  "MALWARE",
                  "SOCIAL_ENGINEERING",
                  "UNWANTED_SOFTWARE",
                  "POTENTIALLY_HARMFUL_APPLICATION",
                ],
                platformTypes: ["ANY_PLATFORM"],
                threatEntryTypes: ["URL"],
                threatEntries: [{ url: targetUrl }],
              },
            }),
          },
        );
        clearTimeout(id);
        const data = await res.json();

        if (data.matches && data.matches.length > 0) {
          console.log(
            `[GOOGLE] HASIL: 🚩 BAHAYA! Ditemukan ${data.matches.length} ancaman.`,
          );
        } else {
          console.log(
            `[GOOGLE] HASIL: ✅ AMAN (Tidak ada ancaman terdeteksi).`,
          );
        }
        return data;
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.error("[GOOGLE] TIMEOUT: Koneksi ke Google terlalu lama.");
        } else {
          console.error("[GOOGLE] ERROR:", err.message);
        }
        return { matches: [] };
      }
    };

    // EKSEKUSI PARALEL
    const [googleData, vtData] = await Promise.all([
      fetchGoogleWithTimeout(url),
      getVirusTotalData(url),
    ]);

    // --- 4. ANALISIS GOOGLE (SINKRONISASI 3 STATUS) ---
    let googleStatus = "AMAN";
    if (googleData?.matches?.length > 0) {
      googleStatus = "BAHAYA";
    }

    // --- 5. ANALISIS VIRUSTOTAL ---
    const vtStats = vtData?.data?.attributes?.last_analysis_stats;
    let vtStatus = "AMAN";

    if (!vtStats) {
      vtStatus = "TIDAK ADA DATA";
    } else if (vtStats.malicious >= 3) {
      vtStatus = "BAHAYA";
    } else if (vtStats.malicious === 2) {
      vtStatus = "MENCURIGAKAN";
    } else if (vtStats.malicious === 1) {
      vtStatus = "PERLU PERHATIAN";
    }

    let trustScore = 100;

    if (googleStatus === "BAHAYA") {
      trustScore -= 50;
    }

    if (vtStats) {
      if (vtStats.malicious >= 3) {
        trustScore -= 50;
      } else if (vtStats.malicious === 2) {
        trustScore -= 20;
      } else if (vtStats.malicious === 1) {
        trustScore -= 10;
      }
    }

    // --- 6. ARTUP HEURISTIC (URUTAN PRIORITAS BARU) ---
    let artupHeuristic = [];

    if (!isWhitelisted) {
      trustScore -= 10;
      artupHeuristic.push("Domain belum masuk daftar terpercaya");
    }

    if (hasRedirectParam) {
      trustScore -= 10;
      artupHeuristic.push("Mengandung parameter redirect");
    }

    if (isManipulated) {
      trustScore -= 30;
      artupHeuristic.push("Kemungkinan meniru brand terkenal");
    }

    const hasSensitiveWord = sensitiveKeywords.some(
      (word) => cleanUrlText.includes(word) || decodedUrl.includes(word),
    );

    if (hasSensitiveWord && !isWhitelisted) {
      trustScore -= 15;
      artupHeuristic.push("Mengandung kata pancingan");
    }

    trustScore = Math.max(0, trustScore);

    let finalStatus = "";
    let userMessage = "";

    if (googleStatus === "BAHAYA" || trustScore < 50) {
      finalStatus = "BAHAYA";

      userMessage = "Terdapat indikasi phishing, malware, atau reputasi buruk.";
    } else if (trustScore < 90) {
      finalStatus = "HATI-HATI";

      userMessage =
        "Tidak ditemukan malware, namun jangan memasukkan password, OTP, PIN, atau data sensitif sebelum memastikan identitas situs.";
    } else if (trustScore < 100) {
      finalStatus = "AMAN";

      userMessage = "Website terlihat aman, tetap gunakan kewaspadaan standar.";
    } else {
      finalStatus = "AMAN TERVERIFIKASI";

      userMessage = "Tidak ditemukan indikasi malware atau phishing.";
    }

    return NextResponse.json({
      trustScore,
      googleStatus,
      virusTotal: vtStatus,
      vtDetails: vtStats,
      finalStatus,
      userMessage,

      details: {
        domain,
        rootDomain,
        isWhitelisted,
      },

      heuristicFlags: artupHeuristic,
    });
  } catch (error: any) {
    console.error("CRITICAL ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", msg: error.message },
      { status: 500 },
    );
  }
}
