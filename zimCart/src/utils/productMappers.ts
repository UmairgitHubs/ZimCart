export function mapProductToDealCard(product: {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  discountPercentage?: number;
  images?: string[];
  store?: { name?: string; deliveryTime?: string };
}) {
  const price = product.discountPrice ?? product.price;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  return {
    id: product.id,
    name: product.name,
    mart: product.store?.name || 'ZimCart',
    price: `Rs. ${price}`,
    oldPrice: hasDiscount ? `Rs. ${product.price}` : '',
    discount: product.discountPercentage ? `${product.discountPercentage}% OFF` : 'DEAL',
    image:
      product.images?.[0] ||
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop',
    time: product.store?.deliveryTime || '30-45 min',
  };
}

export function mapProductToOfferCard(product: {
  id: string;
  name: string;
  price: number;
  discountPrice?: number | null;
  discountPercentage?: number;
  images?: string[];
  store?: { name?: string };
}) {
  const deal = mapProductToDealCard(product);
  return {
    ...deal,
    discount: product.discountPercentage ? `${product.discountPercentage}% OFF` : 'Special',
  };
}
