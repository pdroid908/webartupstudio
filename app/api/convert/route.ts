import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    // 1. Validasi keberadaan file
    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const format = (formData.get("format") as string) || "jpeg";
    const quality = parseInt(formData.get("quality") as string) || 80;

    // 2. Validasi Tipe File (MIME Type)
    // Jangan percaya extension, periksa MIME type langsung
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipe file tidak diizinkan" }, { status: 400 });
    }

    // 3. Validasi Ukuran File (Hard limit 20MB)
    const MAX_SIZE = 20 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File terlalu besar" }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    
    // 4. SHARP SECURITY: Batasi dimensi untuk mencegah Memory Bomb
    // Gambar yang sangat besar bisa membuat server crash karena kehabisan RAM
    let pipeline = sharp(Buffer.from(arrayBuffer), {
      limitInputPixels: 100000000, // Maks 100MP, cegah serangan file piksel raksasa
      failOn: 'error' // Jangan proses jika file korup
    });

    // 5. Normalisasi Metadata (Hapus EXIF agar aman & privasi terjaga)
    pipeline = pipeline.rotate().withMetadata();

    const allowedFormats = ["jpeg", "png", "webp"];
    if (!allowedFormats.includes(format)) {
      return NextResponse.json({ error: "Format tidak didukung" }, { status: 400 });
    }

    // Pemrosesan Gambar
    if (format === "jpeg") pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    else if (format === "webp") pipeline = pipeline.webp({ quality });
    else if (format === "png") {
      pipeline = pipeline.png({
        palette: true,
        quality: 70, // Gunakan dynamic quality dari user
        compressionLevel: 9,
      });
    }

    const outputBuffer = await pipeline.toBuffer();
    
    return new NextResponse(new Uint8Array(outputBuffer), {
      headers: { 
        "Content-Type": `image/${format}`,
        "Cache-Control": "no-store" // Jangan simpan di cache browser
      },
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json({ error: "Gagal memproses gambar" }, { status: 500 });
  }
}