import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const startTime = Date.now();
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
      "id",
      "ac.id",
      "sch.id",
      "or.id",
      "bca.co.id",
      "bankmandiri.co.id",
      "bni.co.id",
      "bri.co.id",
      "btn.co.id",
      "banksyariahindonesia.co.id",
      "cimbniaga.co.id",
      "danamon.co.id",
      "permatabank.com",
      "bpddiy.co.id",
      "bankdki.co.id",
      "bankjateng.co.id",
      "instagram.com",
      "bankjatim.co.id",
      "traveloka.com",
      "go.id",
      "pajak.go.id",
      "bi.go.id",
      "ojk.go.id",
      "polri.go.id",
      "indonesia.go.id",
      "kpu.go.id",
      "bpjs-kesehatan.go.id",
      "bpjsketenagakerjaan.go.id",
      "mahkamahagung.go.id",
    ];
    const hostingGratis = [
      "sites.google.com",
      "vercel.app",
      "github.io",
      "firebaseapp.com",
      "web.app",
      "pantheonsite.io",
      "000webhostapp.com",
    ];
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
    const isManipulated =
      whitelist.some((w) => domain.includes(w)) && !isWhitelisted;

    console.log(`\n--- START SCAN: ${url} ---`);

    // 2. FUNGSI VIRUSTOTAL DENGAN DEBUG LENGKAP
    const getVirusTotalData = async (targetUrl: string) => {
      const urlId = Buffer.from(targetUrl)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
      const headers = { "x-apikey": process.env.VIRUSTOTAL_API_KEY as string };

      try {
        console.log(`[VT] Mengecek data untuk ID: ${urlId}`);
        let res = await fetch(
          `https://www.virustotal.com/api/v3/urls/${urlId}`,
          { headers },
        );
        let data = await res.json();

        if (res.status === 404 || !data.data?.attributes?.last_analysis_stats) {
          console.log(
            `[VT] Data TIDAK ditemukan (404). Mencoba mengirim URL ke VT...`,
          );

          const postRes = await fetch(
            `https://www.virustotal.com/api/v3/urls`,
            {
              method: "POST",
              headers: {
                ...headers,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({ url: targetUrl }),
            },
          );

          if (!postRes.ok) {
            const errorText = await postRes.text();
            console.error(
              `[VT] GAGAL POST URL BARU: ${postRes.status} - ${errorText}`,
            );
            return null;
          }

          console.log(`[VT] Berhasil POST URL. Memulai Polling (Sabar ya)...`);

          for (let attempt = 1; attempt <= 3; attempt++) {
            console.log(
              `[VT] Polling percobaan ${attempt}/3... (Menunggu 5 detik)`,
            );
            await new Promise((r) => setTimeout(r, 5000));

            const retryRes = await fetch(
              `https://www.virustotal.com/api/v3/urls/${urlId}`,
              { headers },
            );
            data = await retryRes.json();

            if (data.data?.attributes?.last_analysis_stats) {
              console.log(
                `[VT] Data berhasil didapatkan pada percobaan ke-${attempt}!`,
              );
              break;
            }
          }
        } else {
          console.log(`[VT] Data ditemukan di database VT.`);
        }
        return data;
      } catch (e) {
        console.error("[VT] EXCEPTION ERROR:", e);
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

    // --- 4. ANALISIS GOOGLE (MURNI HASIL API) ---
    // Di sini Google hanya punya 2 kondisi: AMAN atau BAHAYA.
    let googleStatus = "AMAN";
    if (googleData && googleData.matches && googleData.matches.length > 0) {
      googleStatus = "BAHAYA";
    }
    // Tidak ada lagi perubahan variabel googleStatus setelah ini.

    // --- 5. ANALISIS VIRUSTOTAL ---
    const vtStats = vtData?.data?.attributes?.last_analysis_stats;
    console.log(
      `[VT] STATS: Malicious=${vtStats?.malicious || 0}, Suspicious=${vtStats?.suspicious || 0}`,
    );

    let vtStatus = "AMAN";
    if (vtStats) {
      if (vtStats.malicious >= 1 || vtStats.suspicious >= 2) {
        vtStatus = "BAHAYA";
      }
    } else {
      vtStatus = "TIDAK ADA DATA";
    }

    // --- 6. ARTUP HEURISTIC (LOGIKA INTERNAL UNTUK CELAH) ---
    let artupHeuristic = "AMAN";
 
    if (googleStatus === "BAHAYA" || vtStatus === "BAHAYA" || isManipulated) {
      artupHeuristic = "BAHAYA";
    } else if (isPublicHosting) {
      const fullPath = urlObj.href.toLowerCase();
      const hasSensitiveWord = sensitiveKeywords.some((word) =>
        fullPath.includes(word),
      );
      artupHeuristic = hasSensitiveWord ? "BAHAYA" : "ADA CELAH";
    } else if (!isWhitelisted) {
      // Di sinilah status "ADA CELAH" sebenarnya berasal
      artupHeuristic = "ADA CELAH";
    }

    // --- 7. FINAL STATUS SINKRONISASI ---
    let finalStatus = "AMAN";

    // Prioritas 1: Jika ada yang terdeteksi BAHAYA
    if (
      googleStatus === "BAHAYA" ||
      vtStatus === "BAHAYA" ||
      artupHeuristic === "BAHAYA"
    ) {
      finalStatus = "BAHAYA";
    }
    // Prioritas 2: Jika tidak bahaya tapi ada celah keamanan atau data kurang
    else if (vtStatus === "TIDAK ADA DATA" || artupHeuristic === "ADA CELAH") {
      finalStatus = "ADA CELAH";
    }
    // Prioritas 3: Semua mesin setuju aman & terdaftar di whitelist
    else {
      finalStatus = "AMAN";
    }

    console.log(
      `--- SCAN SELESAI (${Date.now() - startTime}ms) -> FINAL: ${finalStatus} ---\n`,
    );

    return NextResponse.json({
      googleStatus, // Akan selalu AMAN jika tidak ada malware di database Google
      virusTotal: vtStatus,
      vtDetails: vtStats,
      artupHeuristic, // Penentu apakah statusnya Kuning (Ada Celah)
      finalStatus,
      details: { domain, rootDomain, isWhitelisted, isPublicHosting },
    });
  } catch (error: any) {
    console.error("CRITICAL ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", msg: error.message },
      { status: 500 },
    );
  }
}
