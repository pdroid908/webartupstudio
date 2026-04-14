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
    // 2. FUNGSI VIRUSTOTAL (DIPERBAIKI)
    const getVirusTotalData = async (targetUrl: string) => {
      // Gunakan URL yang sudah bersih dari spasi/titik untuk ID
      const cleanUrl = targetUrl.trim().replace(/\s/g, "").replace(/\.+$/, "");
      const urlId = Buffer.from(cleanUrl)
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
        let data = await res.json();

        // Jika 404 atau data lama (hasilnya 0), kita paksa scan ulang agar akurat
        if (
          res.status === 404 ||
          data.data?.attributes?.last_analysis_stats?.malicious === 0
        ) {
          console.log(
            `[VT] Data tidak ada atau mungkin outdate. Mengirim scan fresh...`,
          );

          const postRes = await fetch(
            `https://www.virustotal.com/api/v3/urls`,
            {
              method: "POST",
              headers: {
                ...headers,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({ url: cleanUrl }),
            },
          );

          if (postRes.ok) {
            console.log(
              `[VT] Berhasil antre scan. Memulai Polling lebih lama...`,
            );
            // Polling 3 kali, tiap kali menunggu 10 detik (Total 30 detik max)
            for (let attempt = 1; attempt <= 3; attempt++) {
              await new Promise((r) => setTimeout(r, 10000)); // Tunggu 10 detik
              const retryRes = await fetch(
                `https://www.virustotal.com/api/v3/urls/${urlId}`,
                { headers },
              );
              data = await retryRes.json();

              const stats = data.data?.attributes?.last_analysis_stats;
              // Berhenti polling JIKA sudah ada deteksi malicious
              if (stats && stats.malicious > 0) {
                console.log(
                  `[VT] Deteksi ditemukan pada percobaan ke-${attempt}!`,
                );
                break;
              }
              console.log(
                `[VT] Polling ${attempt}: Masih menunggu hasil vendor...`,
              );
            }
          }
        }
        return data;
      } catch (e) {
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
    if (googleData && googleData.matches && googleData.matches.length > 0) {
      googleStatus = "BAHAYA"; // MERAH + DATA
    } else if (!isWhitelisted) {
      googleStatus = "ADA CELAH"; // LAMPU MERAH / NO DATA (Sesuai Transparency Report)
    } else {
      googleStatus = "AMAN"; // HIJAU (Terverifikasi di Whitelist)
    }

    // --- 5. ANALISIS VIRUSTOTAL ---
    const vtStats = vtData?.data?.attributes?.last_analysis_stats;
    let vtStatus = "AMAN";
    if (vtStats) {
      // Jika malicious >= 1, dia mutlak BAHAYA
      if (vtStats.malicious >= 1) {
        vtStatus = "BAHAYA";
      } else if (vtStats.suspicious >= 2) {
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

    // --- 7. FINAL SINKRONISASI (LOGIKA PRIORITAS) ---
    let finalStatus = "AMAN";

    // Jika ada satu saja yang bilang BAHAYA, hasil akhir wajib BAHAYA
    if (
      googleStatus === "BAHAYA" ||
      vtStatus === "BAHAYA" ||
      artupHeuristic === "BAHAYA"
    ) {
      finalStatus = "BAHAYA";
    }
    // Jika tidak bahaya tapi ada indikasi celah/asing
    else if (
      googleStatus === "ADA CELAH" ||
      vtStatus === "TIDAK ADA DATA" ||
      artupHeuristic === "ADA CELAH"
    ) {
      finalStatus = "ADA CELAH";
    }
    // Semua bersih
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
