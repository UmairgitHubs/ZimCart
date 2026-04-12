import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { Product } from '@/types/products';

export function useProductQuickSearch(search: string) {
  const trimmed = search.trim();
  const enabled = trimmed.length >= 2;

  return useQuery({
    queryKey: ['product-quick-search', trimmed],
    queryFn: async () => {
      const body = await productService.getProducts({
        page: 1,
        limit: 8,
        search: trimmed,
      });
      const products = (body as { data?: { products?: Product[] } })?.data?.products ?? [];
      return products;
    },
    enabled,
    staleTime: 30_000,
  });
}
