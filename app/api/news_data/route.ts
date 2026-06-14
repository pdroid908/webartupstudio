import { NextResponse } from 'next/server';
export const runtime = 'edge';
export async function POST(req: Request) {
  const { keyword } = await req.json();

  // Membaca token dari .env
  const token = process.env.HUGGINGFACE_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "Token tidak ditemukan" }, { status: 500 });
  }

  try {
    const url = `https://pasdaoiji-bigdata.hf.space/api/news/analyze/google-news?keyword=${encodeURIComponent(keyword)}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Menggunakan variabel dari .env
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memanggil API" }, { status: 500 });
  }
}