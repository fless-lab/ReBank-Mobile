/**
 * Generate a deterministic avatar color from a seed string (email).
 * Uses a simple hash to pick from a curated palette of warm/earthy tones
 * that match the app's premium aesthetic.
 */

const AVATAR_COLORS = [
  '#8B6F47', // primary brown
  '#5B8C5A', // sage green
  '#6B7FA3', // steel blue
  '#9B6B8A', // mauve
  '#7A8B6B', // olive
  '#A67B5B', // caramel
  '#6B8B8B', // teal
  '#8B7B6B', // taupe
  '#7B6B9B', // lavender
  '#6B8B7B', // seafoam
  '#9B7B6B', // copper
  '#6B7B8B', // slate
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarColor(seed: string): string {
  const hash = hashString(seed.toLowerCase());
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function getAvatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (parts[0]?.[0] || '?').toUpperCase();
}
