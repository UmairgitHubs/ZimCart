import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Barcode is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}`, {
      headers: {
        "User-Agent": "ZimCart - Admin Dashboard - Web - 1.0",
      },
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const data = await response.json();

    if (data.status === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = data.product;

    return NextResponse.json({
      name: product.product_name,
      brand: product.brands,
      description: product.description || product.generic_name,
      category: product.categories_tags?.[0]?.replace("en:", ""),
      image: product.image_url,
    });
  } catch (error) {
    console.error("Barcode lookup error:", error);
    return NextResponse.json({ error: "Failed to connect to barcode database" }, { status: 500 });
  }
}
