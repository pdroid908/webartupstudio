import { NextResponse } from 'next/server';
export const runtime = 'edge';
export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    // Menembak ke Python backend
    const response = await fetch('https://pasdaoiji-chatbot.hf.space/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' ,
        'Authorization': 'Bearer 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' },
      
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ reply: "Maaf, server Artup Studio sedang offline." }, { status: 500 });
  }
}