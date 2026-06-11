import { NextResponse } from 'next/server';
export const runtime = 'edge';
export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    // Menembak ke Python backend
    const response = await fetch('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ reply: "Maaf, server Artup Studio sedang offline." }, { status: 500 });
  }
}