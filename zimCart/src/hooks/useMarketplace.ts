import { useQuery } from '@tanstack/react-query';
import { marketplaceApi } from '@/services/marketplace';
import { normalizeMart } from '@/utils/normalizers';

export const useMarts = () => {
  return useQuery({
    queryKey: ['marts'],
    queryFn: marketplaceApi.getMarts,
    select: (data: any[]) => data.map(normalizeMart).filter(Boolean),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useStoreDetails = (storeId: string, search?: string, category?: string) => {
  return useQuery({
    queryKey: ['store', storeId, search, category],
    queryFn: ({ signal }) => marketplaceApi.getMartDetails(storeId, { q: search, category }, signal),
    enabled: !!storeId,
    placeholderData: (previousData) => previousData, // Maintain UI stability while fetching new search results
    select: (data: any) => ({
      ...data,
      products: data.products?.map((p: any) => ({
        ...p,
        mart: data.name // Pass store name to product
      }))
    }),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
};

export const useProducts = (params: { storeId?: string; categoryId?: string; search?: string }) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => marketplaceApi.getProducts(params),
    staleTime: 1000 * 60 * 5,
  });
};
