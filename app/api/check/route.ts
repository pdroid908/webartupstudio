import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let { url } = await req.json();
    if (!url)
      return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // 1. NORMALISASI
    url = url.trim().toLowerCase();
    if (!url.startsWith("http")) url = "https://" + url;

    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;
    const fullUrl = urlObj.href;

    // --- 2. DATABASE RADAR ARTUP ---
    const whitelist = [
      "google.com",
      "facebook.com",
      "instagram.com",
      "github.com",
      "artup-studio.vercel.app",
      "vercel.com",
      "nextjs.org",
      "bca.co.id",
      "bankmandiri.co.id",
      "bri.co.id",
      "bni.co.id",
      "shopee.co.id",
      "xaman.app",
    ];

    const officialBrands = [
      "bca",
      "mandiri",
      "bri",
      "bni",
      "dana",
      "ovo",
      "shopee",
      "paypal",
      "microsoft",
      "google",
      "viva",
      "pln",
    ];
    // Tambahkan kata pancingan spesifik dari temuanmu (race, speed, cobranca)
    const baitKeywords = [
      "login",
      "verify",
      "update",
      "account",
      "banking",
      "secure",
      "confirm",
      "office",
      "docs",
      "view",
      "race",
      "speed",
      "cobranca",
    ];
    const suspiciousPaths = [
      "/docs/",
      "/view/",
      "/share/",
      "/edible/",
      "/secure/",
      "/p%c3%a1gina-inicial",
    ];

    // --- 3. ANALISIS HEURISTIK MENDALAM ---
    const isBaseWhitelisted = whitelist.some(
      (w) => domain === w || domain.endsWith("." + w),
    );
    const hasBaitInUrl = baitKeywords.some((word) => fullUrl.includes(word));
    const hasSuspiciousFolder = suspiciousPaths.some((p) => path.includes(p));
    const isImpersonating =
      officialBrands.some((brand) => fullUrl.includes(brand)) &&
      !isBaseWhitelisted;

    // Deteksi Karakter Acak (Entropy) untuk menangkap link seperti manalmoe
    const hasHighEntropy =
      (domain.match(/[0-9]/g) || []).length > 3 ||
      (path.match(/[0-9a-z]{15,}/g) || []).length > 0;

    // --- 4. INTEGRASI ENGINE GLOBAL ---
    const urlId = Buffer.from(url)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const vtRes = await fetch(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      {
        headers: { "x-apikey": process.env.VIRUSTOTAL_API_KEY as string },
      },
    );
    const vtData = await vtRes.json();
    const vtStats = vtData?.data?.attributes?.last_analysis_stats || null;

    const googleRes = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({
          client: { clientId: "artup-security", clientVersion: "1.0.0" },
          threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
          },
        }),
      },
    );
    const googleData = await googleRes.json();

    // --- 5. LOGIKA SINKRONISASI ENGINE (PENTING!) ---
    const isGoogleBad = googleData.matches && googleData.matches.length > 0;
    const isVTBad =
      vtStats && (vtStats.malicious > 0 || vtStats.suspicious > 0);

    // Cek apakah database benar-benar punya data tentang link ini
    const hasGlobalRecord =
      vtStats && vtStats.malicious + vtStats.suspicious + vtStats.harmless > 0;

    let artupHeuristic = "AMAN";

    // Walaupun Google Sites (Whitelisted), jika ada path mencurigakan/kata pancingan, statusnya BUKAN AMAN
    if (isBaseWhitelisted) {
      if (hasBaitInUrl || hasSuspiciousFolder) {
        artupHeuristic = "ADA CELAH"; // Menurunkan level kepercayaan Google Sites palsu
      }
    } else {
      if (isImpersonating || (hasHighEntropy && hasBaitInUrl)) {
        artupHeuristic = "BAHAYA";
      } else if (hasBaitInUrl || hasSuspiciousFolder || path.length > 30) {
        artupHeuristic = "ADA CELAH";
      }
    }

    // Penentuan Status Global Engine untuk UI agar tidak menipu
    let globalStatusUI = "CLEAN";
    if (isGoogleBad || isVTBad) {
      globalStatusUI = "BAHAYA"; // Merah & Valid
    } else if (!hasGlobalRecord && !isGoogleBad) {
      globalStatusUI = "TIDAK ADA DATA"; // Orange/Kuning (Bukan Hijau!)
    }

    // --- 6. FINAL DECISION (RADAR ARTUP) ---
    let finalStatus = "AMAN";

    // Jika salah satu engine bilang BAHAYA, atau Heuristik kita bilang BAHAYA, maka MERAH
    if (globalStatusUI === "BAHAYA" || artupHeuristic === "BAHAYA") {
      finalStatus = "BAHAYA";
    }
    // Jika tidak ada data global atau Heuristik kita menemukan celah, maka ORANGE
    else if (
      globalStatusUI === "TIDAK ADA DATA" ||
      artupHeuristic === "ADA CELAH"
    ) {
      finalStatus = "ADA CELAH";
    }

    return NextResponse.json({
      googleStatus: globalStatusUI, // Akan sinkron: BAHAYA (Merah), CLEAN (Hijau), atau TIDAK ADA DATA (Orange)
      virusTotal: vtStats,
      artupHeuristic,
      finalStatus,
      details: {
        isBaseWhitelisted,
        hasBaitInUrl,
        hasSuspiciousFolder,
        hasGlobalRecord,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
