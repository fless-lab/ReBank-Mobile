import { Button, OtpInput, ScreenHeader } from '@/components/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type OtpMode = 'password-reset' | 'account-verify';

const CONFIG = {
  'password-reset': {
    headerTitle: 'Security',
    icon: 'lock-reset' as const,
    title: 'Password Reset Code',
    description: 'Enter the 6-digit code we sent to your email to reset your password',
    buttonText: 'Verify & Reset Password',
    canSkip: false,
  },
  'account-verify': {
    headerTitle: 'Verification',
    icon: 'shield-check' as const,
    title: 'Account Verification',
    description: 'We sent a verification code to confirm your email address',
    buttonText: 'Verify Account',
    canSkip: true,
  },
};

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string; email?: string }>();
  const mode: OtpMode = (params.mode as OtpMode) || 'password-reset';
  const email = params.email || 'r****@example.com';
  const config = CONFIG[mode];

  const [seconds, setSeconds] = useState(119);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  const handleVerify = () => {
    if (mode === 'password-reset') {
      router.push('/set-new-password');
    } else {
      router.replace('/(main)/home');
    }
  };

  const handleSkip = () => {
    router.replace('/(main)/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title={config.headerTitle} />

      <View className="flex-1 items-center px-6">
        {/* Header */}
        <View className="items-center mt-8 mb-10">
          <View className="p-4 rounded-full bg-primary/10 mb-6">
            <MaterialCommunityIcons name={config.icon} size={36} color="#2edc6b" />
          </View>
          <Text className="text-white text-3xl font-manrope-extrabold tracking-tight mb-3 text-center">
            {config.title}
          </Text>
          <Text className="text-slate-400 text-base font-manrope text-center leading-relaxed">
            {config.description}{'\n'}
            <Text className="font-manrope-semibold text-white">{email}</Text>
          </Text>
        </View>

        {/* OTP Input */}
        <View className="w-full mb-10">
          <OtpInput
            length={6}
            onComplete={(code) => {
              console.log('OTP:', code);
            }}
          />
        </View>

        {/* Timer */}
        <View className="items-center gap-4 mb-12">
          <View className="flex-row items-center gap-6 bg-primary/5 border border-primary/10 px-6 py-3 rounded-2xl">
            <View className="items-center">
              <Text className="text-primary text-xl font-manrope-bold">{mins}</Text>
              <Text className="text-[10px] uppercase tracking-widest text-primary/60 font-manrope-bold">Min</Text>
            </View>
            <View className="w-px h-8 bg-primary/20" />
            <View className="items-center">
              <Text className="text-primary text-xl font-manrope-bold">{secs}</Text>
              <Text className="text-[10px] uppercase tracking-widest text-primary/60 font-manrope-bold">Sec</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Text className="text-slate-400 text-sm font-manrope">Didn't receive the code? </Text>
            <Pressable onPress={() => setSeconds(119)}>
              <Text className="text-primary font-manrope-bold text-sm">Resend</Text>
            </Pressable>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="w-full gap-3 mb-8">
          <Button
            title={config.buttonText}
            variant="primary"
            onPress={handleVerify}
          />
          {config.canSkip && (
            <Pressable
              className="flex-row items-center justify-center gap-2 py-3"
              onPress={handleSkip}
            >
              <Text className="text-primary/50 text-sm font-manrope-semibold">Skip for now</Text>
              <MaterialCommunityIcons name="arrow-right" size={16} color="rgba(46, 220, 107, 0.5)" />
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
