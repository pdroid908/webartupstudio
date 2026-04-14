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
    const domain = urlObj.hostname.replace("www.", "");
    const parts = domain.split(".");
    const rootDomain =
      domain.endsWith(".co.id") || domain.endsWith(".net.id")
        ? parts.slice(-3).join(".")
        : parts.slice(-2).join(".");

    const whitelist = [
      // TEKNOLOGI & SOSIAL MEDIA (EXISTING)
      "google.com",
      "facebook.com",
      "github.com",
      "youtube.com",
      "dana.id",
      "whatsapp.com",
      "tokopedia.com",
      "gojek.com",
      "gopay.co.id",
      "ovo.id",

      "id", // Menandakan domain .id (induk)
      "ac.id", // Universitas/Akademik (Butuh SK Pendirian)
      "sch.id", // Sekolah (Butuh surat izin dinas)
      "or.id",

      // PERBANKAN UMUM INDONESIA
      "bca.co.id",
      "bankmandiri.co.id",
      "bni.co.id",
      "bri.co.id",
      "btn.co.id",
      "banksyariahindonesia.co.id", // BSI
      "cimbniaga.co.id",
      "danamon.co.id",
      "permatabank.com",
      "bpddiy.co.id",
      "bankdki.co.id",
      "bankjateng.co.id",
      "instagram.com",
      "bankjatim.co.id",
      "traveloka.com",

      // EKOSISTEM NEGARA & OTORITAS (RESMI)
      "go.id", // Seluruh domain pemerintahan (Kominfo, Kemenkeu, dll)
      "pajak.go.id",
      "bi.go.id", // Bank Indonesia
      "ojk.go.id", // Otoritas Jasa Keuangan
      "polri.go.id",
      "indonesia.go.id",
      "kpu.go.id",
      "bpjs-kesehatan.go.id",
      "bpjsketenagakerjaan.go.id",
      "mahkamahagung.go.id",
      "artup-studio.vercel.app",
    ];

    // DAFTAR SITUS GRATISAN / HOSTING PUBLIK (TAMBAHAN VAR A)
    const hostingGratis = [
      "sites.google.com",
      "vercel.app",
      "github.io",
      "firebaseapp.com",
      "web.app",
      "pantheonsite.io",
      "000webhostapp.com",
    ];

    // KATA KUNCI SENSITIF UNTUK CEK PATH
    const sensitiveKeywords = [
      "bca",
      "bri",
      "mandiri",
      "bni",
      "bank",
      "login",
      "verifikasi",
      "akun",
      "portal",
      "update",
    ];

    const isWhitelisted = whitelist.includes(rootDomain);
    const isPublicHosting = hostingGratis.some((h) => domain.includes(h));

    // 2. FUNGSI VIRUSTOTAL (VAR A)
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
        if (res.status === 404) {
          await fetch(`https://www.virustotal.com/api/v3/urls`, {
            method: "POST",
            headers,
            body: new URLSearchParams({ url: targetUrl }),
          });
          await new Promise((resolve) => setTimeout(resolve, 3000));
          res = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
            headers,
          });
        }
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

    // 4. ANALISIS GOOGLE
    let googleStatus = "AMAN";
    if (googleData.matches && googleData.matches.length > 0) {
      googleStatus = "BAHAYA";
    } else if (!isWhitelisted || isPublicHosting) {
      googleStatus = "ADA CELAH";
    }

    // 5. ANALISIS VIRUSTOTAL
    let vtStatus = "AMAN";
    const malic = vtStats?.malicious || 0;
    if (malic >= 1) {
      vtStatus = "BAHAYA";
    } else if (!vtStats) {
      vtStatus = "TIDAK ADA DATA";
    }

    // 6. ARTUP HEURISTIC (LOGIKA BARU UNTUK SITUS GRATISAN)
    let artupHeuristic = "AMAN";

    if (googleStatus === "BAHAYA" || vtStatus === "BAHAYA") {
      artupHeuristic = "ADA CELAH";
    } else {
      // CEK MANIPULASI DOMAIN
      const isManipulated =
        whitelist.some((w) => domain.includes(w)) && !isWhitelisted;

      if (isManipulated) {
        artupHeuristic = "BAHAYA";
      } else if (isPublicHosting) {
        // LOGIKA BARU: Cek apakah di dalam path URL ada kata-kata bank/login
        const fullPath = urlObj.href.toLowerCase();
        const hasSensitiveWord = sensitiveKeywords.some((word) =>
          fullPath.includes(word),
        );

        if (hasSensitiveWord) {
          // Jika situs gratisan (sites.google) tapi bawa-bawa nama "bank" atau "login"
          artupHeuristic = "BAHAYA";
        } else {
          // Jika situs gratisan biasa (portofolio orang dll)
          artupHeuristic = "ADA CELAH";
        }
      } else if (!isWhitelisted) {
        artupHeuristic = "ADA CELAH";
      }
    }

    // 7. FINAL SINKRONISASI
    let finalStatus = "AMAN";
    if (
      googleStatus === "BAHAYA" ||
      vtStatus === "BAHAYA" ||
      artupHeuristic === "BAHAYA"
    ) {
      finalStatus = "BAHAYA";
    } else if (
      googleStatus === "ADA CELAH" ||
      vtStatus === "TIDAK ADA DATA" ||
      artupHeuristic === "ADA CELAH"
    ) {
      finalStatus = "ADA CELAH";
    }

    return NextResponse.json({
      googleStatus,
      virusTotal: vtStatus,
      vtDetails: vtStats,
      artupHeuristic,
      finalStatus,
      details: { domain, rootDomain, isWhitelisted, isPublicHosting },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
