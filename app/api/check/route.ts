import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const startTime = Date.now();
  try {
    let { url } = await req.json();
    if (!url)
      return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // 1. NORMALISASI & FILTER KARAKTER
    url = url.trim().toLowerCase();
    function isBase64(str: string) {
      try {
        return btoa(atob(str)) === str;
      } catch (err) {
        return false;
      }
    }

    if (isBase64(url)) {
      try {
        const decoded = Buffer.from(url, "base64").toString("utf-8");
        if (decoded.startsWith("http")) {
          url = decoded; // Ganti url acak jadi url asli (misal: google.com)
          console.log(`[DECODER] Berhasil membongkar Base64: ${url}`);
        }
      } catch (e) {
        console.log("[DECODER] Teks bukan Base64 URL valid.");
      }
    }

    // --- PROTEKSI PINTU DEPAN ---
    if (url.length > 2000 || url.includes("@")) {
      return NextResponse.json(
        {
          error: "Deteksi Karakter Terlarang URL Terlalu Panjang!",
          finalStatus: "BAHAYA",
        },
        { status: 400 },
      );
    }

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

    if (!url.startsWith("http")) url = "https://" + url;

    // 2. VALIDASI STRUKTUR URL
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      return NextResponse.json(
        {
          error: "URL / LINK MACAM APA ITU HA ??",
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
    // --- PROTEKSI BIAR SERVER GAK PINGSAN (SELF-SCAN) ---
    if (domain.includes("artup-security.vercel.app")) {
      return NextResponse.json(
        {
          error: "MODE PERTAHANAN DIRI DARI HACKER !!",
          finalStatus: "AMAN",
        },
        { status: 400 },
      );
    }

    const whitelist = [
      // --- KOMUNIKASI & MEDSOS (Official Only) ---
      "whatsapp.com",
      "artup-studio.vercel.app",
      "facebook.com",
      "instagram.com",
      "x.com",
      "twitter.com",
      "telegram.org",
      "t.me", // Shortener resmi Telegram
      "linkedin.com",
      "discord.com",
      "tiktok.com",

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
      "ngrok-free.app", // Sering buat phising lokal
      "trycloudflare.com", // Tunneling hacker
      "surge.sh", // Hosting statis gratis
      "railway.app", // Hosting app gratis
      "firebasestorage.googleapis.com", // Tempat simpan file APK/Virus
      "clerk.accounts.dev", // Sering disalahgunakan buat login palsu
      "supabase.co", // Database yang sering buat simpan data curian
      "app.link", // Deep link yang sering buat bypass scanner
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
      "dapat",
      "dpt",
      "official",
      "officer",
      "admin",
      "cs", // Customer Service palsu
      "giveaway",
      "event",
      "blokir", // Contoh: "Akun Anda akan diblokir"
      "penangguhan", // Contoh: "Penangguhan transaksi"
      "limit", // Contoh: "Naikkan limit kartu kredit"
      "tarif", // Contoh: "Perubahan tarif transaksi bank" (Sangat ramai di WA)
      "kur", // Penipuan pinjaman modal
      "ojk-palsu", // Mengatasnamakan otoritas
      "cakra", // Sering dipakai di penipuan paket/kurir
      "paket", // Penipuan kurir J&T/JNE palsu
      "resi", // Penipuan file APK resi
      "unduh", // Memaksa user download sesuatu
    ];

    // 1. BONGKAR KODE RAHASIA (Contoh: %6c%6f -> lo)
    const decodedUrl = decodeURIComponent(url).toLowerCase();
    const hostname = urlObj.hostname.replace("www.", "");

    // 2. CEK DOMAIN KETAT (Gunakan endsWith agar tidak tertipu bca.co.id.palsu.com)
    const isWhitelisted = whitelist.some(
      (w) => hostname === w || hostname.endsWith("." + w),
    );
    const isPublicHosting = hostingGratis.some(
      (h) => hostname === h || hostname.endsWith("." + h),
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

    // --- 6. ARTUP HEURISTIC (URUTAN PRIORITAS BARU) ---
    let artupHeuristic = "AMAN";

    // A. PRIORITAS 1: Manipulasi Nama Bank (Paling Bahaya)
    if (isManipulated) {
      artupHeuristic = "BAHAYA";
    }
    // B. PRIORITAS 2: Whitelist yang bawa Redirect (Google/FB/YT)
    else if (isWhitelisted && hasRedirectParam) {
      artupHeuristic = "ADA CELAH";
    }
    // C. PRIORITAS 3: Hosting Gratis + Kata Sensitif
    else if (isPublicHosting) {
      // Normalisasi teks (Hapus simbol biar l.o.g.i.n tetep ketauan)
      // Menghapus simbol DAN karakter transparan (Zero Width Space)
      const cleanUrlText = decodedUrl
        .replace(/[^a-z0-9]/g, "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "");
      const hasSensitiveWord = sensitiveKeywords.some(
        (word) => cleanUrlText.includes(word) || decodedUrl.includes(word),
      );
      artupHeuristic = hasSensitiveWord ? "BAHAYA" : "ADA CELAH";
    }
    // D. PRIORITAS 4: Domain Asing (Bukan Whitelist)
    else if (!isWhitelisted) {
      artupHeuristic = "ADA CELAH";
    }

    // --- 7. FINAL SINKRONISASI (LOGIKA PRIORITAS) ---
    let finalStatus = "AMAN";

    // PRIORITAS 1: MERAH (Jika salah satu mesin deteksi bahaya)
    if (
      googleStatus === "BAHAYA" ||
      vtStatus === "BAHAYA" ||
      artupHeuristic === "BAHAYA"
    ) {
      finalStatus = "BAHAYA";
    }
    // PRIORITAS 2: KUNING (Jika ada celah atau tidak ada data)
    else if (
      artupHeuristic === "ADA CELAH" ||
      googleStatus === "ADA CELAH" ||
      vtStatus === "TIDAK ADA DATA"
    ) {
      finalStatus = "ADA CELAH";
    }
    // PRIORITAS 3: HIJAU (Hanya jika benar-benar bersih & Whitelisted)
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
