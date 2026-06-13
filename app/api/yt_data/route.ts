import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Tangkap keyword dari body yang dikirim frontend
    const { keyword } = await req.json();
    
    if (!keyword) {
      return NextResponse.json({ error: "Keyword diperlukan" }, { status: 400 });
    }

    const token = process.env.HUGGINGFACE_TOKEN;
    
    // Pastikan URL tujuan persis seperti yang di Python: /analyze/youtube?keyword=...
    const targetUrl = `https://pasdaoiji-bigdata.hf.space/api/youtube/analyze/youtube?keyword=${encodeURIComponent(keyword)}`;

    const response = await fetch(targetUrl, {
      method: 'GET', // Sesuai dengan @router.get di Python
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: "Gagal memanggil API YouTube" }, { status: 500 });
  }
}