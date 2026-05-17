export function parseDeliveryAddress(raw: string): { address: string; detail?: string; instructions?: string } {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.address) {
      return {
        address: String(parsed.address),
        detail: parsed.detail ? String(parsed.detail) : undefined,
        instructions: parsed.instructions ? String(parsed.instructions) : undefined,
      };
    }
  } catch {
    // plain text
  }
  return { address: raw };
}
