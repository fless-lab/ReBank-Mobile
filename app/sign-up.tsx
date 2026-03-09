import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader, Input, Button } from '@/components/ui';

export default function SignUpScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title="Sign Up" />

        {/* Hero */}
        <View className="px-6 pt-8 pb-4">
          <View className="bg-primary/10 p-3 rounded-xl self-start mb-6">
            <MaterialCommunityIcons name="wallet" size={28} color="#2edc6b" />
          </View>
          <Text className="text-white tracking-tight text-4xl font-manrope-extrabold leading-tight mb-3">
            Join ReBank
          </Text>
          <Text className="text-slate-400 text-base font-manrope leading-relaxed">
            Experience premium e-banking with emerald-tier security and seamless global transactions.
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 py-4 gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            leftIcon="account"
            autoCapitalize="words"
          />

          <Input
            label="Email Address"
            placeholder="john@example.com"
            leftIcon="email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            leftIcon="phone"
            keyboardType="phone-pad"
          />

          <Input
            label="Password"
            placeholder="••••••••"
            leftIcon="lock"
            secureTextEntry
            rightIcon="password"
          />

          {/* Terms Checkbox */}
          <Pressable
            className="flex-row items-start gap-3 py-2"
            onPress={() => setAgreed(!agreed)}
          >
            <View className={`mt-0.5 size-5 rounded border items-center justify-center ${agreed ? 'bg-primary border-primary' : 'border-primary/30 bg-transparent'}`}>
              {agreed && <MaterialCommunityIcons name="check" size={14} color="#122017" />}
            </View>
            <Text className="text-slate-400 text-sm font-manrope flex-1">
              I agree to the{' '}
              <Text className="text-primary">Terms of Service</Text> and{' '}
              <Text className="text-primary">Privacy Policy</Text>.
            </Text>
          </Pressable>

          {/* Submit */}
          <View className="pt-4">
            <Button title="Create Account" variant="primary" />
          </View>

          {/* Footer */}
          <View className="items-center pt-6 pb-12">
            <Pressable onPress={() => router.back()}>
              <Text className="text-slate-400 text-base font-manrope">
                Already have an account?{' '}
                <Text className="text-primary font-manrope-bold">Log In</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
