import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    let { url } = await req.json();
    if (!url)
      return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // 1. NORMALISASI & FILTER KARAKTER
    url = url.trim().toLowerCase();

    if (
      url.includes("<") ||
      url.includes(">") ||
      url.includes('"') ||
      url.includes(" ")
    ) {
      return NextResponse.json(
        {
          error: "Input mengandung karakter terlarang atau spasi!",
          finalStatus: "BAHAYA",
        },
        { status: 400 },
      );
    }

    if (!url.startsWith("http")) url = "https://" + url;

    // 2. VALIDASI STRUKTUR URL
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      return NextResponse.json(
        {
          error: "Format URL hancur / tidak valid",
          finalStatus: "BAHAYA",
        },
        { status: 400 },
      );
    }

    // 3. AMBIL DOMAIN
    const domain = urlObj.hostname.replace("www.", "");
    const parts = domain.split(".");
    const rootDomain =
      domain.endsWith(".co.id") || domain.endsWith(".net.id")
        ? parts.slice(-3).join(".")
        : parts.slice(-2).join(".");

    const whitelist = [
      // --- KOMUNIKASI & MEDSOS (Hanya Domain Induk Resmi) ---
      "whatsapp.com",
      "facebook.com",
      "instagram.com",
      "x.com",
      "twitter.com",
      "telegram.org",

      // --- INFRASTRUKTUR DIGITAL GLOBAL ---
      "google.com",
      "apple.com",
      "microsoft.com",
      "android.com",
      "cloudflare.com",
      "visa.com",
      "mastercard.com",
      "paypal.com",

      // --- PEMERINTAH & PENDIDIKAN (Paling Aman / Zero Trust) ---
      "go.id",
      "ac.id",
      "sch.id",
      "mil.id",
      "gov",
      "edu",

      // --- PERBANKAN INDONESIA (Resmi Terdaftar OJK) ---
      "bca.co.id",
      "klikbca.com", // BCA
      "bankmandiri.co.id", // Mandiri
      "bri.co.id", // BRI
      "bni.co.id", // BNI
      "btn.co.id", // BTN
      "banksyariahindonesia.co.id", // BSI
      "bpddiy.co.id",
      "bankdki.co.id",
      "bankjateng.co.id",
      "bankjatim.co.id",
      "cimbniaga.co.id",
      "danamon.co.id",
      "maybank.co.id",
      "permatabank.com",
      "bi.go.id",
      "ojk.go.id",

      // --- EKOSISTEM DIGITAL & DOMPET RESMI ---
      "tokopedia.com",
      "gojek.com",
      "traveloka.com",
      "shopee.co.id",
      "dana.id",
      "ovo.id",
      "gopay.co.id",

      // --- BUMN & LAYANAN VITAL ---
      "kai.id",
      "pertamina.com",
      "pln.co.id",
      "telkom.co.id",
      "telkomsel.com",
      "posindonesia.co.id",
      "garuda-indonesia.com",
    ];
    const hostingGratis = [
      "sites.google.com",
      "vercel.app",
      "github.io",
      "firebaseapp.com",
      "web.app",
      "pantheonsite.io",
      "000webhostapp.com",
      "pages.dev",
      "render.com",
      "glitch.me",
      "blogspot.com",
      "netlify.app",
      "wordpress.com",
      "linktr.ee",
      "bit.ly",
      "tinyurl.com",
      "form.gle",
      "forms.gle",
      "t.me",
      "drive.google.com",
      "dropbox.com",
      "s.id",
      "rebrand.ly",
    ];
    const sensitiveKeywords = [
      // --- PERBANKAN & KEUANGAN (Target Utama) ---
      "bca",
      "bri",
      "mandiri",
      "bni",
      "bank",
      "bpjs",
      "pajak",
      "dana",
      "ovo",
      "gopay",
      "shopeepay",
      "billing",
      "tagihan",
      "pembayaran",
      "finance",
      "investasi",
      "saham",
      "crypto",

      // --- AKSI PENCURIAN (Action Hooks) ---
      "login",
      "verifikasi",
      "akun",
      "account",
      "portal",
      "update",
      "confirm",
      "secure",
      "registrasi",
      "daftar",
      "aktivasi",
      "password",
      "otp",
      "pin",
      "masuk",

      // --- UMPAN SCAM (Social Engineering) ---
      "undian",
      "hadiah",
      "menang",
      "subsidi",
      "bantuan",
      "bansos",
      "rejeki",
      "promo",
      "voucher",
      "diskon",
      "kuota",
      "gratis",
      "survei",
      "kuesioner",
      "survey",
      "blt",
      "prakerja",
      "kompensasi",
      "thr",
      "angpao",
      "jackpot",
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
