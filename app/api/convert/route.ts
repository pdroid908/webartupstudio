import { NextResponse } from "next/server";
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    // Cek apakah request ini untuk 'estimasi' atau 'convert'
    const isEstimate = req.url.includes("?type=estimate");
    
    // Sesuaikan URL backend
    const endpoint = isEstimate ? "/estimate" : "/convert";
    const BACKEND_URL = `https://backendconverter-production.up.railway.app${endpoint}`;

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) return NextResponse.json({ error: "Backend error" }, { status: 500 });

    // Jika estimasi, kembalikan JSON
    if (isEstimate) {
      const data = await response.json();
      return NextResponse.json(data);
    } 
    
    // Jika convert, kembalikan File Gambar
    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(new Uint8Array(arrayBuffer), {
      headers: { "Content-Type": response.headers.get("content-type") || "image/jpeg" }
    });

  } catch {
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}