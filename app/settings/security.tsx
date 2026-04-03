import { ScreenHeader } from '@/components/ui';
import { AuthService } from '@/lib/api/auth';
import { authenticateWithBiometrics } from '@/utils/biometrics';
import { getUserProfile, saveUserProfile, UserProfile } from '@/utils/userStore';
import { Smartphone, Scanner2, ShieldCheck } from '@solar-icons/react-native/BoldDuotone';
import React, { useEffect, useState } from 'react';
import { Switch, Text, View, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SecurityScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading2FA, setLoading2FA] = useState(true);

  useEffect(() => {
    getUserProfile().then(setProfile);
    // Fetch actual 2FA status from backend
    AuthService.getProfile()
      .then((p) => {
        setTwoFactorEnabled(p.two_factor_enabled);
        setLoading2FA(false);
      })
      .catch(() => setLoading2FA(false));
  }, []);

  const toggle2FA = async (value: boolean) => {
    setLoading2FA(true);
    try {
      const result = await AuthService.toggle2FA(value);
      setTwoFactorEnabled(result.two_factor_enabled);
      // Sync to local profile
      if (profile) {
        const updated = { ...profile, is2FAEnabled: result.two_factor_enabled };
        await saveUserProfile(updated);
        setProfile(updated);
      }
      Alert.alert(
        result.two_factor_enabled ? '2FA Activée' : '2FA Désactivée',
        result.message,
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de modifier le 2FA');
    } finally {
      setLoading2FA(false);
    }
  };

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
      value ? 'Biométrie Activée' : 'Biométrie Désactivée',
      value
        ? 'Vous pouvez maintenant vous connecter avec la biométrie de votre appareil.'
        : 'Vous devrez utiliser votre mot de passe pour vous connecter.',
    );
  };

  if (!profile) return null;

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Sécurité" />
      <View className="flex-1 px-6 pt-6">
        <Text className="text-foreground text-lg font-manrope-bold tracking-tight mb-4">Authentification</Text>

        <View className="bg-surface rounded-2xl border border-border overflow-hidden">
          {/* Double Authentification */}
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <View className="flex-row items-center gap-3">
              <View className="size-10 rounded-full bg-surface-hover items-center justify-center">
                <Smartphone size={20} color="#8B6F47" />
              </View>
              <View>
                <Text className="text-foreground text-sm font-manrope-bold">Double Authentification</Text>
                <Text className="text-muted text-xs font-manrope">
                  {twoFactorEnabled ? 'OTP par email à chaque connexion' : 'Désactivée — connexion directe'}
                </Text>
              </View>
            </View>
            {loading2FA ? (
              <ActivityIndicator size="small" color="#8B6F47" />
            ) : (
              <Switch
                value={twoFactorEnabled}
                onValueChange={toggle2FA}
                trackColor={{ false: '#E8E0D8', true: '#8B6F47' }}
                thumbColor="#fff"
              />
            )}
          </View>

          {/* Connexion Biométrique */}
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <View className="size-10 rounded-full bg-surface-hover items-center justify-center">
                <Scanner2 size={20} color="#8B6F47" />
              </View>
              <View>
                <Text className="text-foreground text-sm font-manrope-bold">Connexion Biométrique</Text>
                <Text className="text-muted text-xs font-manrope">Utiliser Face ID / Touch ID</Text>
              </View>
            </View>
            <Switch
              value={profile.biometricsEnabled}
              onValueChange={toggleBiometrics}
              trackColor={{ false: '#E8E0D8', true: '#8B6F47' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Info Sécurité */}
        <View className="mt-6 bg-surface rounded-xl p-4 border border-border flex-row items-start gap-3">
          <ShieldCheck size={20} color="#8C7B6B" />
          <Text className="text-muted text-xs font-manrope flex-1 leading-relaxed">
            {twoFactorEnabled
              ? 'Votre compte est protégé par la double authentification. Chaque connexion nécessite un code OTP envoyé à votre adresse e-mail.'
              : 'Activez la double authentification pour ajouter une couche de sécurité supplémentaire. Un code OTP sera envoyé à votre e-mail à chaque connexion.'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
