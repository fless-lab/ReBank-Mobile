import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader, OtpInput, Button } from '@/components/ui';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(119); // 1:59

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="ReBank" />

      <View className="flex-1 items-center px-6">
        {/* Header */}
        <View className="items-center mt-8 mb-10">
          <View className="p-4 rounded-full bg-primary/10 mb-6">
            <MaterialCommunityIcons name="lock-open" size={36} color="#2edc6b" />
          </View>
          <Text className="text-white text-3xl font-manrope-extrabold tracking-tight mb-3">
            Enter Verification Code
          </Text>
          <Text className="text-slate-400 text-base font-manrope text-center leading-relaxed">
            We sent a 6-digit code to your email{'\n'}
            <Text className="font-manrope-semibold text-white">m****@example.com</Text>
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

        {/* Verify Button */}
        <View className="w-full mb-8">
          <Button
            title="Verify & Continue"
            variant="primary"
            onPress={() => router.push('/set-new-password')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
