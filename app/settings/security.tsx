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

  const toggleBiometrics = async (value: boolean) => {
    if (!profile) return;

    if (value) {
      const success = await authenticateWithBiometrics();
      if (!success) return;
    }

    const updated = { ...profile, biometricsEnabled: value };
    await saveUserProfile(updated);
    setProfile(updated);
    Alert.alert(
      value ? 'Biometrics Enabled' : 'Biometrics Disabled',
      value
        ? 'You can now log in using your device biometrics.'
        : 'You will need to use your password to log in.',
    );
  };

  if (!profile) return null;

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Security Settings" />
      <View className="flex-1 px-6 pt-6">
        <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Authentication</Text>

        <View className="bg-primary/5 rounded-2xl border border-primary/10 overflow-hidden">
          {/* 2FA - Always enforced by backend */}
          <View className="flex-row items-center justify-between p-4 border-b border-primary/10">
            <View className="flex-row items-center gap-3">
              <View className="size-10 rounded-full bg-primary/10 items-center justify-center">
                <MaterialCommunityIcons name="cellphone-key" size={20} color="#2edc6b" />
              </View>
              <View>
                <Text className="text-white text-sm font-manrope-bold">Two-Factor Auth</Text>
                <Text className="text-slate-400 text-xs font-manrope">Always active for your security</Text>
              </View>
            </View>
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <Text className="text-primary text-xs font-manrope-bold">Always On</Text>
            </View>
          </View>

          {/* Biometrics */}
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

        {/* Security Info */}
        <View className="mt-6 bg-primary/5 rounded-xl p-4 border border-primary/10 flex-row items-start gap-3">
          <MaterialCommunityIcons name="shield-check" size={20} color="rgba(46, 220, 107, 0.5)" />
          <Text className="text-slate-400 text-xs font-manrope flex-1 leading-relaxed">
            Your account is protected by two-factor authentication. Every login requires an OTP code sent to your email address.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
