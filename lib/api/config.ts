import { Platform } from 'react-native';

// Your machine's local IP (for physical devices on the same WiFi)
const LAN_IP = '172.20.73.254';

// Android emulator uses 10.0.2.2 to reach host localhost
// iOS simulator uses localhost directly
// Physical devices use LAN IP
const HOST = Platform.select({
  android: __DEV__ ? LAN_IP : LAN_IP,
  ios: __DEV__ ? LAN_IP : LAN_IP,
  default: 'localhost',
});

export const API_BASE_URL = `http://${HOST}:8000`;

// HMAC API secret — must match backend HMAC_API_SECRET
// In production, load from secure config / env
export const HMAC_API_SECRET = process.env.EXPO_PUBLIC_HMAC_API_SECRET || 'dev-hmac-secret-2026-inpt-sec-web-mobile-raouf-max-michel';
