import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
  const token = process.env.HUGGINGFACE_TOKEN;

  try {
    const response = await fetch("https://pasdaoiji-bigdata.hf.space/api/trend/trending", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
    });

    // Ambil teks response-nya dulu untuk debugging jika gagal
    if (!response.ok) {
      const errorText = await response.text();
      console.error("FastAPI Error Response:", errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.status}` }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error: unknown) {
    console.error("Fetch API Error:", error);
    return NextResponse.json(
      { error: "Gagal menghubungkan ke backend trending" }, 
      { status: 500 }
    );
  }
}