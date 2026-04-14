import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let { url } = await req.json();
    if (!url)
      return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // 1. NORMALISASI & EKSTRAKSI DOMAIN
    url = url.trim().toLowerCase();
    if (!url.startsWith("http")) url = "https://" + url;

    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace("www.", "");
    const parts = domain.split(".");

    const rootDomain =
      domain.endsWith(".co.id") || domain.endsWith(".net.id")
        ? parts.slice(-3).join(".")
        : parts.slice(-2).join(".");

    // DATABASE WHITELIST (Domain yang 100% kita percaya)
   const whitelist = [
     // --- GLOBAL & TECH (RAKSASA TEKNOLOGI) ---
     "google.com",
     "facebook.com",
     "github.com",
     "vercel.app",
     "github.io",
     "openai.com",
     "youtube.com",
     "microsoft.com",
     "apple.com",
     "instagram.com",
     "twitter.com",
     "x.com",
     "linkedin.com",
     "whatsapp.com",
     "discord.com",
     "telegram.org",

     // --- PERBANKAN INDONESIA (UTAMA) ---
     "bca.co.id",
     "bankmandiri.co.id",
     "bri.co.id",
     "bni.co.id",
     "bankbsi.co.id",
     "btn.co.id",
     "cimbniaga.com",
     "danamon.co.id",
     "bankpermata.com",
     "ocbc.id",
     "panin.co.id",

     // --- BANK DAERAH (KHUSUS JOGJA & SEKITARNYA) ---
     "bpddiy.co.id",
     "bankjogja.com",
     "banksleman.co.id",
     "bankbantul.co.id",

     // --- FINTECH & DOMPET DIGITAL INDONESIA ---
     "dana.id",
     "ovo.id",
     "linkaja.id",
     "gopay.co.id",
     "shopeepay.co.id",
     "flip.id",
     "bibit.id",
     "pluang.com",
     "ajaib.co.id",
     "midtrans.com",

     // --- PEMERINTAHAN (INSTITUSI NEGARA) ---
     "go.id",
     "pajak.go.id",
     "bpjs-kesehatan.go.id",
     "bpjsketenagakerjaan.go.id",
     "indonesia.go.id",
     "kemkes.go.id",
     "polri.go.id",
     "kemenkeu.go.id",
     "kominfo.go.id",
     "bi.go.id",
     "ojk.go.id",

     // --- E-COMMERCE & LAYANAN POPULER INDONESIA ---
     "tokopedia.com",
     "shopee.co.id",
     "bukalapak.com",
     "blibli.com",
     "lazada.co.id",
     "gojek.com",
     "grab.com",
     "traveloka.com",
     "tiket.com",
   ];

    const publicSubdomains = [
      "sites",
      "forms",
      "docs",
      "storage",
      "firebaseapp",
      "vercel",
      "github",
      "pages",
    ];

    // 2. FUNGSI VIRUSTOTAL (Disederhanakan untuk efisiensi)
    const getVirusTotalData = async (targetUrl: string) => {
      const urlId = Buffer.from(targetUrl)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
      const headers = { "x-apikey": process.env.VIRUSTOTAL_API_KEY as string };
      try {
        let res = await fetch(
          `https://www.virustotal.com/api/v3/urls/${urlId}`,
          { headers },
        );
        return res.json();
      } catch (e) {
        return null;
      }
    };

    // 3. EKSEKUSI PARALEL
    const [googleRes, vtData] = await Promise.all([
      fetch(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({
            client: { clientId: "artup-security", clientVersion: "1.0.0" },
            threatInfo: {
              threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
              platformTypes: ["ANY_PLATFORM"],
              threatEntryTypes: ["URL"],
              threatEntries: [{ url }],
            },
          }),
        },
      ),
      getVirusTotalData(url),
    ]);

    const googleData = await googleRes.json();
    const vtStats = vtData?.data?.attributes?.last_analysis_stats || null;

    // ---------------------------------------------------------
    // 4. ANALISIS STATUS GOOGLE (MENANGKAP LAMPU MERAH)
    // ---------------------------------------------------------
    let googleStatus = "AMAN";
    const isWhitelisted = whitelist.includes(rootDomain);

    // STATUS 1: BAHAYA (Google Resmi mem-Blacklist)
    if (googleData.matches && googleData.matches.length > 0) {
      googleStatus = "BAHAYA";
    }
    // STATUS 2: ADA CELAH (Menangkap "Lampu Merah" di foto kamu)
    // Jika Google "No Data" TAPI domain bukan whitelist (misal .cfd), anggap ADA CELAH
    else if (!isWhitelisted) {
      googleStatus = "ADA CELAH";
    }
    // STATUS 3: AMAN (Hanya untuk domain di Whitelist)
    else {
      googleStatus = "AMAN";
    }

    // 5. STATUS VIRUSTOTAL
    let vtStatus = "AMAN";
    const hasVTRecord =
      vtStats && vtStats.malicious + vtStats.harmless + vtStats.suspicious > 0;
    if (vtStats && (vtStats.malicious > 0 || vtStats.suspicious > 0)) {
      vtStatus = "BAHAYA";
    } else if (!hasVTRecord) {
      vtStatus = "TIDAK ADA DATA";
    }

    // 6. ARTUP LOGIC (HEURISTIC)
    let artupHeuristic = "AMAN";
    const isManipulated =
      whitelist.some((w) => domain.includes(w)) && !isWhitelisted;

    if (googleStatus === "BAHAYA" || vtStatus === "BAHAYA" || isManipulated) {
      artupHeuristic = "BAHAYA";
    } else if (isWhitelisted) {
      const subdomain = parts[0];
      if (publicSubdomains.includes(subdomain) && rootDomain !== domain) {
        artupHeuristic = "ADA CELAH";
      }
    } else {
      artupHeuristic = "ADA CELAH";
    }

    // ---------------------------------------------------------
    // FINAL STATUS (SINKRONISASI TOTAL)
    // ---------------------------------------------------------
    let finalStatus = "AMAN";
    if (artupHeuristic === "BAHAYA" || googleStatus === "BAHAYA") {
      finalStatus = "BAHAYA";
    } else if (
      artupHeuristic === "ADA CELAH" ||
      googleStatus === "ADA CELAH" ||
      vtStatus === "TIDAK ADA DATA"
    ) {
      finalStatus = "ADA CELAH";
    }

    return NextResponse.json({
      googleStatus,
      virusTotal: vtStatus,
      vtDetails: vtStats,
      artupHeuristic,
      finalStatus,
      details: { domain, rootDomain, isWhitelisted },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
