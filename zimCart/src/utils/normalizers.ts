export const normalizeProduct = (passedProduct: any) => {
  if (!passedProduct) return null;
  
  return {
    id: passedProduct.id,
    name: passedProduct.name || 'ZimCart Product',
    price: passedProduct.price 
      ? (typeof passedProduct.price === 'string' ? passedProduct.price : `Rs. ${passedProduct.price}`) 
      : 'Rs. 0',
    images: passedProduct.images?.length > 0 ? passedProduct.images : [passedProduct.image || 'https://via.placeholder.com/800'],
    image: passedProduct.images?.[0] || passedProduct.image || 'https://via.placeholder.com/800',
    description: passedProduct.description || 'Experience the excellence of ZimCart. Sourced for quality and freshness.',
    mart: passedProduct.mart || passedProduct.store?.name || 'ZimCart Mart',
    rating: passedProduct.rating || '4.8',
    reviews: passedProduct.reviewsCount || '0',
    categoryName: passedProduct.category?.name || passedProduct.subCategory || 'General',
    weight: passedProduct.weight || 'Standard',
    inventory: passedProduct.inventory ?? 0,
    sku: passedProduct.sku || 'N/A',
    brand: passedProduct.brand || 'ZimCart',
    discountPrice: passedProduct.discountPrice,
    variants: passedProduct.variants || [] // Array of { type: string, values: string[] }
  };
};

export const normalizeMart = (passedMart: any) => {
  if (!passedMart) return null;

  return {
    id: passedMart.id,
    name: passedMart.name || 'ZimCart Mart',
    image: passedMart.image || 'https://via.placeholder.com/800',
    rating: passedMart.rating || 4.8,
    deliveryTime: passedMart.deliveryTime || '20-30 min',
    tags: passedMart.tags || [],
    deliveryFee: passedMart.deliveryFee || 'Rs. 0',
    minOrder: passedMart.minOrder || 'Rs. 0'
  };
};
