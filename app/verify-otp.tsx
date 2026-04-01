import { Button, OtpInput, ScreenHeader } from '@/components/ui';
import { AuthService } from '@/lib/api/auth';
import { VerifyOtpInput, verifyOtpSchema } from '@/lib/validations/auth';
import { Smartphone, ShieldCheck, LockKeyholeUnlocked } from '@solar-icons/react-native/BoldDuotone';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type OtpMode = 'account-verify' | '2fa-login' | 'password-reset';

const CONFIG = {
  '2fa-login': {
    headerTitle: 'Authentification',
    icon: Smartphone,
    title: 'Double Authentification',
    description: 'Entrez le code à 6 chiffres envoyé à',
    buttonText: 'Vérifier & Se Connecter',
  },
  'account-verify': {
    headerTitle: 'Vérification',
    icon: ShieldCheck,
    title: 'Vérifiez Votre Email',
    description: 'Entrez le code à 6 chiffres envoyé à',
    buttonText: 'Vérifier le Compte',
  },
  'password-reset': {
    headerTitle: 'Réinitialisation',
    icon: LockKeyholeUnlocked,
    title: 'Vérifier l\'Identité',
    description: 'Entrez le code à 6 chiffres envoyé à',
    buttonText: 'Vérifier le Code',
  },
};

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    mode?: string;
    email?: string;
    id_token?: string;
    otp_exp?: string;
  }>();

  const mode: OtpMode = (params.mode as OtpMode) || '2fa-login';
  const email = params.email || '';
  const idToken = params.id_token || '';
  const otpExp = parseFloat(params.otp_exp || '0');
  const config = CONFIG[mode];

  // Calculate initial seconds from OTP expiry (6 min from backend)
  const getInitialSeconds = () => {
    if (otpExp > 0) {
      const remaining = Math.floor(otpExp - Date.now() / 1000);
      return Math.max(0, Math.min(remaining, 360));
    }
    return 360;
  };

  const [seconds, setSeconds] = useState(getInitialSeconds);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<VerifyOtpInput>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: '' },
  });

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  // Mask email for display
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    : '***@***.com';

  const onSubmit = async (data: VerifyOtpInput) => {
    try {
      setIsLoading(true);

      if (mode === 'account-verify') {
        // Registration OTP verification
        const response = await AuthService.verifyRegistrationOtp(
          idToken, data.code, otpExp, email,
        );
        Alert.alert(
          'Compte Vérifié',
          response.message || 'Votre compte a été vérifié. Vous pouvez maintenant vous connecter.',
          [{ text: 'Se Connecter', onPress: () => router.replace('/') }],
        );
      } else if (mode === 'password-reset') {
        // Reset password OTP verification → get reset_token → go to set-new-password
        const response = await AuthService.verifyResetOtp(idToken, data.code, otpExp, email);
        router.replace({
          pathname: '/set-new-password',
          params: {
            email,
            reset_token: response.reset_token,
            reset_exp: String(response.reset_exp),
          },
        });
      } else {
        // Login OTP verification
        await AuthService.verifyLoginOtp(idToken, data.code, otpExp, email);
        router.replace('/(main)/home');
      }
    } catch (error: any) {
      Alert.alert('Vérification Echouée', error.message || 'Code OTP invalide ou expiré.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    Alert.alert(
      'Renvoyer le Code',
      'Veuillez revenir en arrière et réessayer pour recevoir un nouveau code OTP.',
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title={config.headerTitle} />

      <View className="flex-1 items-center px-6">
        {/* Header */}
        <View className="items-center mt-8 mb-10">
          <View className="p-4 rounded-full bg-surface-hover mb-6">
            <config.icon size={36} color="#8B6F47" />
          </View>
          <Text className="text-foreground text-3xl font-manrope-extrabold tracking-tight mb-3 text-center">
            {config.title}
          </Text>
          <Text className="text-muted text-base font-manrope text-center leading-relaxed">
            {config.description}{'\n'}
            <Text className="font-manrope-semibold text-foreground">{maskedEmail}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View className="w-full mb-10">
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange }, fieldState: { error } }) => (
              <View className="items-center">
                <OtpInput
                  length={6}
                  onChange={onChange}
                  error={!!error}
                />
                {error && (
                  <Text className="text-red-400 text-xs font-manrope mt-2">{error.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Timer */}
        <View className="items-center gap-4 mb-12">
          <View className="flex-row items-center gap-6 bg-surface border border-border px-6 py-3 rounded-2xl">
            <View className="items-center">
              <Text className="text-primary text-xl font-manrope-bold">{mins}</Text>
              <Text className="text-[10px] uppercase tracking-widest text-muted font-manrope-bold">Min</Text>
            </View>
            <View className="w-px h-8 bg-border" />
            <View className="items-center">
              <Text className="text-primary text-xl font-manrope-bold">{secs}</Text>
              <Text className="text-[10px] uppercase tracking-widest text-muted font-manrope-bold">Sec</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Text className="text-muted text-sm font-manrope">Code non reçu ? </Text>
            <Pressable onPress={handleResend} disabled={isLoading}>
              <Text className="text-primary font-manrope-bold text-sm">Renvoyer</Text>
            </Pressable>
          </View>
        </View>

        {/* Action Button */}
        <View className="w-full gap-3 mb-8">
          <Button
            title={config.buttonText}
            variant="primary"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
