import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavBar, Input, Button } from '@/components/ui';

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        {/* Navigation */}
        <NavBar />

        {/* Content */}
        <View className="flex-1 items-center justify-center px-6 pt-4 pb-8">
          <View className="w-full max-w-[440px]">

            {/* Hero Image Area */}
            <View className="w-full h-[180px] rounded-xl overflow-hidden border border-primary/20 bg-primary/10 mb-8">
              <LinearGradient
                colors={['transparent', 'rgba(18, 32, 23, 0.6)']}
                className="absolute inset-0 z-10"
              />
              <View className="flex-1 items-center justify-center">
                <MaterialCommunityIcons name="shield-lock-outline" size={64} color="rgba(46, 220, 107, 0.3)" />
              </View>
            </View>

            {/* Welcome Text */}
            <View className="items-center mb-8">
              <Text className="text-white text-[32px] font-manrope-bold tracking-tight mb-2">
                Welcome back
              </Text>
              <Text className="text-primary/70 text-base font-manrope">
                Securely access your premium account
              </Text>
            </View>

            {/* Login Form */}
            <View className="gap-4">
              {/* Email */}
              <Input
                label="Email or Username"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                rightIcon="email"
              />

              {/* Password */}
              <Input
                label="Password"
                placeholder="••••••••"
                secureTextEntry
                rightIcon="password"
                rightAction={
                  <Pressable>
                    <Text className="text-primary text-xs font-manrope-semibold">Forgot Password?</Text>
                  </Pressable>
                }
              />

              {/* Biometric Login */}
              <Button
                title="Login with Biometrics"
                variant="outline"
                iconComponent={
                  <MaterialCommunityIcons name="fingerprint" size={22} color="#2edc6b" />
                }
              />

              {/* Main Login Button */}
              <View className="pt-4">
                <Button title="Log In" variant="primary" />
              </View>
            </View>

            {/* Footer */}
            <View className="items-center mt-8 gap-4">
              <Text className="text-primary/40 text-sm font-manrope">
                Don't have an account?{' '}
                <Text className="text-primary font-manrope-bold">Apply Now</Text>
              </Text>

              <View className="flex-row gap-6 pt-4">
                <MaterialCommunityIcons name="shield-check-outline" size={24} color="rgba(46, 220, 107, 0.3)" />
                <MaterialCommunityIcons name="lock-outline" size={24} color="rgba(46, 220, 107, 0.3)" />
                <MaterialCommunityIcons name="security" size={24} color="rgba(46, 220, 107, 0.3)" />
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Status */}
        <View className="p-6 items-center">
          <Text className="text-[10px] uppercase tracking-widest text-primary/30 font-manrope-bold">
            Encrypted End-to-End Connection
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
