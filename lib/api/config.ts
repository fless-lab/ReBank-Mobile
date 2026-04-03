// API base URL — set via EXPO_PUBLIC_API_URL in .env
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// HMAC API secret — must match backend HMAC_API_SECRET
export const HMAC_API_SECRET = process.env.EXPO_PUBLIC_HMAC_API_SECRET || 'dev-hmac-secret-2026-inpt-sec-web-mobile-raouf-max-michel';
