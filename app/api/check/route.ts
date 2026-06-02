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
  "chatgpt.com",
  "gemini.google.com",

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
  "hadiah",
  "win",
  "suprise",
  "reward",
];

function validateInput(url: string) {
  if (url.length > 700 || /[<>"'@\s]/.test(url)) return false;
  return true;
}
interface VTStats {
  malicious: number;
  // Tambahkan properti lain yang ada di vtStats jika perlu
}
function calculateTrustScore(
  googleStatus: string,
  vtStats: VTStats,
  isWhitelisted: boolean,
  hasRedirect: boolean,
  isManipulated: boolean,
  hasSensitiveWord: boolean
) {
  let score = 100;
  const flags: string[] = [];

  if (googleStatus === "BAHAYA") score -= 50;
  
  if (vtStats) {
    if (vtStats.malicious >= 3) score -= 50;
    else if (vtStats.malicious === 2) score -= 20;
    else if (vtStats.malicious === 1) score -= 10;
  }

  if (!isWhitelisted) {
    score -= 10;
    flags.push("Domain belum terverifikasi");
  }
  if (hasRedirect) {
    score -= 10;
    flags.push("Mengandung parameter redirect");
  }
  if (isManipulated) {
    score -= 30;
    flags.push("Meniru brand terkenal");
  }
  if (hasSensitiveWord && !isWhitelisted) {
    score -= 15;
    flags.push("Mengandung kata pancingan");
  }

  return { score: Math.max(0, score), flags };
}

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
          .replace(/[=+/]/g, (match) => {
            switch (match) {
              case "=":
                return "";
              case "+":
                return "-";
              case "/":
                return "_";
              default:
                return match;
            }
          });

        const existingRes = await fetch(
          `https://www.virustotal.com/api/v3/urls/${urlId}`,
          { headers },
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

        const scanRes = await fetch("https://www.virustotal.com/api/v3/urls", {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            url: cleanUrl,
          }),
        });

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

        for (let attempt = 1; attempt <= 2; attempt++) {
          const analysisRes = await fetch(
            `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
            { headers },
          );

          if (!analysisRes.ok) {
            break;
          }

          const analysisData = await analysisRes.json();

          const status = analysisData?.data?.attributes?.status;

          console.log(`[VT] Polling ${attempt}/20 | Status: ${status}`);

          if (status === "completed") {
            completed = true;
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 7000));
        }

        if (!completed) {
          console.warn(
            "[VT] Analysis belum selesai, mengambil hasil sementara",
          );
        }

        // ====================================================
        // AMBIL HASIL FINAL
        // ====================================================

        const finalRes = await fetch(
          `https://www.virustotal.com/api/v3/urls/${urlId}`,
          { headers },
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
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          console.error("[GOOGLE] TIMEOUT: Koneksi ke Google terlalu lama.");
        } else {
          console.error(
            "[GOOGLE] ERROR:",
            err instanceof Error ? err.message : "Unknown error",
          );
        }
        return { matches: [] };
      }
    };

export async function POST(req: Request) {
  try {
    const { url: inputUrl } = await req.json();
    if (!inputUrl) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    let url = inputUrl.trim();

    // Decoding Base64 (disederhanakan)
    const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
    if (base64Regex.test(url) && url.length > 20) {
      try {
        const decoded = atob(url);
        if (decoded.startsWith("http")) url = decoded;
      } catch { /* Error diabaikan */ }
    }

    if (!validateInput(url)) return NextResponse.json({ error: "Invalid URL", finalStatus: "BAHAYA" }, { status: 400 });
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace("www.", "");
    
    // Scan Paralel
    const [googleData, vtData] = await Promise.all([
      fetchGoogleWithTimeout(url),
      getVirusTotalData(url),
    ]);

    // Analisis Hasil
    const googleStatus = googleData?.matches?.length > 0 ? "BAHAYA" : "AMAN";
    const vtStats = vtData?.data?.attributes?.last_analysis_stats;
    
    const isWhitelisted = whitelist.some((w) => hostname === w || hostname.endsWith("." + w));
    const hasRedirect = Array.from(urlObj.searchParams.values()).some((v) => v.includes("http"));
    const isManipulated = !isWhitelisted && whitelist.some((w) => hostname.includes(w.split(".")[0]));
    
    const decodedUrl = decodeURIComponent(url).toLowerCase();
    const hasSensitiveWord = sensitiveKeywords.some((w) => decodedUrl.includes(w));

    const { score, flags } = calculateTrustScore(googleStatus, vtStats, isWhitelisted, hasRedirect, isManipulated, hasSensitiveWord);

    // Penentuan Status Akhir
    let finalStatus = "AMAN";
if (score < 50) {
  finalStatus = "BAHAYA";
} else if (score < 90) {
  finalStatus = "HATI-HATI";
}
    return NextResponse.json({
      trustScore: score,
      googleStatus,
      finalStatus,
      heuristicFlags: flags,
      details: { domain: hostname, isWhitelisted }
    });

  } catch (error) {
    console.error("[CRITICAL ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
