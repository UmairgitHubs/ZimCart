/**
 * SKU Auto-generator Utility
 * Format: [CATEGORY_CODE]-[BRAND_CODE]-[VARIANT_INITIALS]-[RANDOM_4]
 * Example: BVRG-COKE-1KG-X7F2
 */
export const generateSKU = (
  category: string,
  brand: string,
  variantName: string
): string => {
  const categoryPart = (category || "GENR").slice(0, 4).toUpperCase();
  const brandPart = (brand || "ZIM").slice(0, 4).toUpperCase();
  
  // First letter of each word in variant name
  const variantInitials = (variantName || "VAR")
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 4);

  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `${categoryPart}-${brandPart}-${variantInitials}-${randomPart}`;
};
