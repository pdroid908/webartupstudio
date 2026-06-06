
import { NextResponse } from "next/server";
export const runtime = 'edge';
export async function POST(req: Request) {
  try {
    // Ambil form data dari frontend
    const formData = await req.formData();

    // URL backend Railway kamu
    const BACKEND_URL =
      "https://backendconverter-production.up.railway.app/convert";

    // Kirim ke backend converter
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData,
    });

    // Kalau backend error
    if (!response.ok) {
      const errorData = await response.json();

      return NextResponse.json(
        {
          error:
            errorData.error ||
            "Gagal convert gambar",
        },
        {
          status: response.status,
        }
      );
    }

    // Ambil hasil gambar
    const arrayBuffer =
      await response.arrayBuffer();

    // Ambil content type
    const contentType =
      response.headers.get(
        "content-type"
      ) || "image/jpeg";

    // Balikin ke frontend
    return new NextResponse(
      new Uint8Array(arrayBuffer),
      {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "no-store",
        },
      }
    );

  } catch (error) {
    console.error(
      "Proxy convert error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Server gagal memproses request",
      },
      {
        status: 500,
      }
    );
  }
}
