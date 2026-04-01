import { Platform } from 'react-native';

// Your machine's local IP (for physical devices on the same WiFi)
const LAN_IP = '192.168.58.36';

// Android emulator uses 10.0.2.2 to reach host localhost
// iOS simulator uses localhost directly
// Physical devices use LAN IP
const HOST = Platform.select({
  android: __DEV__ ? LAN_IP : LAN_IP,
  ios: __DEV__ ? LAN_IP : LAN_IP,
  default: 'localhost',
});

export const API_BASE_URL = `http://${HOST}:8000`;
