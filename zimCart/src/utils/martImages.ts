import { MART_COVER_IMAGES, MART_IMAGE_POOL } from '@/constants/martImages';

function isValidImageUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.includes('via.placeholder.com')) return false;
  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
}

function pickById(id: string, pool: string[]): string {
  let index = 0;
  for (let i = 0; i < id.length; i += 1) {
    index = (index + id.charCodeAt(i)) % pool.length;
  }
  return pool[index]!;
}

function pickByTags(tags: string[] | undefined, name: string): string {
  const haystack = `${(tags ?? []).join(' ')} ${name}`.toLowerCase();

  if (haystack.includes('tech') || haystack.includes('electronic') || haystack.includes('mobile')) {
    return MART_COVER_IMAGES.tech;
  }
  if (haystack.includes('fashion') || haystack.includes('cloth') || haystack.includes('style')) {
    return MART_COVER_IMAGES.fashion;
  }
  if (haystack.includes('beauty') || haystack.includes('cosmetic')) {
    return MART_COVER_IMAGES.beauty;
  }
  if (haystack.includes('pharmacy') || haystack.includes('medical')) {
    return MART_COVER_IMAGES.pharmacy;
  }
  if (haystack.includes('snack')) {
    return MART_COVER_IMAGES.snacks;
  }
  if (haystack.includes('beverage') || haystack.includes('drink')) {
    return MART_COVER_IMAGES.beverages;
  }
  if (haystack.includes('grocery') || haystack.includes('fresh') || haystack.includes('mart')) {
    return MART_COVER_IMAGES.grocery;
  }

  return MART_COVER_IMAGES.supermarket;
}

export function resolveMartImage(mart: {
  id?: string;
  name?: string;
  image?: string | null;
  tags?: string[];
}): string {
  if (isValidImageUrl(mart.image)) {
    return mart.image.trim();
  }

  const byTag = pickByTags(mart.tags, mart.name ?? '');
  if (mart.id) {
    return pickById(mart.id, [byTag, ...MART_IMAGE_POOL]);
  }
  return byTag;
}
