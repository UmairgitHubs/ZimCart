import { resolveMartImage } from '@/utils/martImages';

export const normalizeProduct = (passedProduct: any) => {
  if (!passedProduct) return null;
  
  return {
    id: passedProduct.id,
    name: passedProduct.name || 'ZimCart Product',
    price: passedProduct.price 
      ? (typeof passedProduct.price === 'string' ? passedProduct.price : `Rs. ${passedProduct.price}`) 
      : 'Rs. 0',
    images:
      passedProduct.images?.length > 0
        ? passedProduct.images
        : [
            passedProduct.image ||
              'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
          ],
    image:
      passedProduct.images?.[0] ||
      passedProduct.image ||
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
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

  const tags = passedMart.tags || [];
  const deliveryTime = passedMart.deliveryTime || '20-30 min';
  const deliveryFee = passedMart.deliveryFee || 'Rs. 0';
  const image = resolveMartImage({
    id: passedMart.id,
    name: passedMart.name,
    image: passedMart.image,
    tags,
  });

  return {
    id: passedMart.id,
    name: passedMart.name || 'ZimCart Mart',
    image,
    rating: passedMart.rating || 4.8,
    deliveryTime,
    tags,
    deliveryFee,
    minOrder: passedMart.minOrder || 'Rs. 0',
    time: deliveryTime,
    delivery: deliveryFee,
    ratingCount: passedMart.ratingCount || '(250+)',
  };
};
