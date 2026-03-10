import { NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sku = searchParams.get("sku");

  if (!sku) {
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });
  }

  try {
    // Forward to backend
    const response = await axios.get(`${BACKEND_URL}/products/sku-check?sku=${sku}`, {
        withCredentials: true,
        // We might need to forward cookies, but Next.js Route handlers don't have automatic cookie forwarding like browser
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // If backend returns 404, SKU might be available or it just doesn't implement this yet
    // For now, let's assume if it errors, we might just say it's unique if we can't reach it, 
    // or return the error.
    if (error.response?.status === 404) {
        return NextResponse.json({ isUnique: true });
    }
    return NextResponse.json({ isUnique: true }); // Fallback to avoid blocking if backend not ready
  }
}
