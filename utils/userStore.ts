import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = '@rebank_user_profile';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUri: string;
  memberSince: string;
  is2FAEnabled: boolean;
  biometricsEnabled: boolean;
}

const AVATAR_STYLES = ['adventurer', 'avataaars', 'bottts', 'fun-emoji', 'lorelei', 'notionists', 'pixel-art'];

function generateRandomAvatar(seed: string): string {
  const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
  return `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(seed)}&size=200`;
}

export function createDefaultProfile(): UserProfile {
  const name = 'Raouf Sterling';
  return {
    name,
    email: 'iam-raouf@rebank.com',
    phone: '+212 (724) 485-3650',
    avatarUri: generateRandomAvatar(name + Date.now()),
    memberSince: '2025',
    is2FAEnabled: false,
    biometricsEnabled: false,
  };
}

export async function getUserProfile(): Promise<UserProfile> {
  try {
    const json = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    console.warn('Failed to load profile:', e);
  }
  // First time: create + save default
  const profile = createDefaultProfile();
  await saveUserProfile(profile);
  return profile;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save profile:', e);
  }
}
