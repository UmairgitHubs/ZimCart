/** Reliable mart cover photos (Unsplash) — work on Expo / physical devices. */
export const MART_COVER_IMAGES = {
  grocery:
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1000&auto=format&fit=crop',
  supermarket:
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1000&auto=format&fit=crop',
  tech:
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1000&auto=format&fit=crop',
  electronics:
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop',
  fashion:
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
  beauty:
    'https://images.unsplash.com/photo-1596462502278-27bf403348ba?q=80&w=1000&auto=format&fit=crop',
  pharmacy:
    'https://images.unsplash.com/photo-1587854692152-cf260aba80f0?q=80&w=1000&auto=format&fit=crop',
  snacks:
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?q=80&w=1000&auto=format&fit=crop',
  beverages:
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?q=80&w=1000&auto=format&fit=crop',
  default:
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1000&auto=format&fit=crop',
} as const;

export const MART_IMAGE_POOL = Object.values(MART_COVER_IMAGES);
