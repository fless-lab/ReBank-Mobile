import { ScreenHeader } from '@/components/ui';
import { authenticateWithBiometrics } from '@/utils/biometrics';
import { getUserProfile, saveUserProfile, UserProfile } from '@/utils/userStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Switch, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SecurityScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  const toggle2FA = async (value: boolean) => {
    if (!profile) return;
    const updated = { ...profile, is2FAEnabled: value };
    await saveUserProfile(updated);
    setProfile(updated);
  };

  const toggleBiometrics = async (value: boolean) => {
    if (!profile) return;
    
    // Test if we can authenticate first before enabling
    if (value) {
      const success = await authenticateWithBiometrics();
      if (!success) return; // authentication failed, don't enable it
    }

    const updated = { ...profile, biometricsEnabled: value };
    await saveUserProfile(updated);
    setProfile(updated);
    if (!value) {
        Alert.alert('Biometrics Disabled', 'You will need to use your password to log in.');
    } else {
        Alert.alert('Biometrics Enabled', 'You can now log in using your device biometrics.');
    }
  };

  if (!profile) return null;

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Security Settings" />
      <View className="flex-1 px-6 pt-6">
        <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Authentication</Text>

        <View className="bg-primary/5 rounded-2xl border border-primary/10 overflow-hidden">
          <View className="flex-row items-center justify-between p-4 border-b border-primary/10">
            <View className="flex-row items-center gap-3">
              <View className="size-10 rounded-full bg-primary/10 items-center justify-center">
                <MaterialCommunityIcons name="cellphone-key" size={20} color="#2edc6b" />
              </View>
              <View>
                <Text className="text-white text-sm font-manrope-bold">Two-Factor Auth</Text>
                <Text className="text-slate-400 text-xs font-manrope">Require an OTP when logging in</Text>
              </View>
            </View>
            <Switch
              value={profile.is2FAEnabled}
              onValueChange={toggle2FA}
              trackColor={{ false: '#334155', true: '#2edc6b' }}
              thumbColor="#fff"
            />
          </View>

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <View className="size-10 rounded-full bg-primary/10 items-center justify-center">
                <MaterialCommunityIcons name="fingerprint" size={20} color="#2edc6b" />
              </View>
              <View>
                <Text className="text-white text-sm font-manrope-bold">Biometric Login</Text>
                <Text className="text-slate-400 text-xs font-manrope">Use Face ID / Touch ID</Text>
              </View>
            </View>
            <Switch
              value={profile.biometricsEnabled}
              onValueChange={toggleBiometrics}
              trackColor={{ false: '#334155', true: '#2edc6b' }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
