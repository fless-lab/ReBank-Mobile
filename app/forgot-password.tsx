import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader, Input, Button } from '@/components/ui';

export default function ForgotPasswordScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title="Security" />

        {/* Hero */}
        <View className="px-6 pt-10 pb-6">
          <View className="mb-8 size-20 items-center justify-center rounded-2xl bg-primary/10">
            <MaterialCommunityIcons name="lock-reset" size={36} color="#2edc6b" />
          </View>
          <Text className="text-white tracking-tight text-[32px] font-manrope-extrabold leading-tight mb-3">
            Forgot Password?
          </Text>
          <Text className="text-primary/70 text-base font-manrope leading-relaxed max-w-md">
            Enter the email address associated with your{' '}
            <Text className="text-primary font-manrope-bold">ReBank</Text>{' '}
            account, and we'll send you a code to reset your credentials.
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 py-4 gap-6">
          <Input
            label="Email Address"
            placeholder="e.g. julian@rebank.premium"
            leftIcon="email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View className="gap-4 pt-2">
            <Button
              title="Send Reset Code"
              variant="primary"
              onPress={() => router.push({ pathname: '/verify-otp', params: { mode: 'password-reset' } })}
            />
            <Pressable
              className="flex-row items-center justify-center gap-2 py-2"
              onPress={() => router.back()}
            >
              <MaterialCommunityIcons name="keyboard-backspace" size={18} color="rgba(46, 220, 107, 0.6)" />
              <Text className="text-primary/60 text-sm font-manrope-semibold">Back to login</Text>
            </Pressable>
          </View>
        </View>

        {/* Help Card */}
        <View className="mt-auto px-6 py-8">
          <View className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex-row items-center gap-4">
            <View className="size-10 rounded-full bg-primary/20 items-center justify-center">
              <MaterialCommunityIcons name="face-agent" size={20} color="#2edc6b" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-manrope-bold text-white">Need immediate help?</Text>
              <Text className="text-xs text-primary/60 font-manrope">
                Contact our 24/7 priority concierge.
              </Text>
            </View>
            <Text className="text-primary text-xs font-manrope-bold uppercase tracking-wider">Contact</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
