import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const barcode = searchParams.get("barcode");

  if (!barcode) {
    return NextResponse.json({ error: "Barcode is required" }, { status: 400 });
  }

  try {
    const response = await axios.get(`${BACKEND_URL}/products/barcode-check?barcode=${barcode}`, {
        withCredentials: true,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response?.status === 404) {
        return NextResponse.json({ isUnique: true });
    }
    return NextResponse.json({ isUnique: true });
  }
}
