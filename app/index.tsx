import { Button, HeroImage, Input, NavBar } from '@/components/ui';
import { AuthService } from '@/lib/api/auth';
import { LoginInput, loginSchema } from '@/lib/validations/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      await AuthService.login(data);
      router.replace('/(main)/home');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        <NavBar />

        <View className="flex-1 items-center justify-center px-6 pt-4 pb-8">
          <View className="w-full max-w-[440px]">
            <HeroImage />

            <View className="items-center mb-8">
              <Text className="text-white text-[32px] font-manrope-bold tracking-tight mb-2">
                Welcome back
              </Text>
              <Text className="text-primary/70 text-base font-manrope">
                Securely access your premium account
              </Text>
            </View>

            <View className="gap-4">
              <Controller
                control={control}
                name="identifier"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    label="Email or Username"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    rightIcon="email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    secureTextEntry
                    rightIcon="password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    rightAction={
                      <Pressable onPress={() => router.push('/forgot-password')}>
                        <Text className="text-primary text-xs font-manrope-semibold">Forgot Password?</Text>
                      </Pressable>
                    }
                  />
                )}
              />

              <Button
                title="Login with Biometrics"
                variant="outline"
                icon="fingerprint"
                disabled={isLoading}
              />

              <View className="pt-4">
                <Button
                  title="Log In"
                  variant="primary"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                />
              </View>
            </View>

            <View className="items-center mt-8 gap-4">
              <Pressable onPress={() => router.push('/sign-up')} disabled={isLoading}>
                <Text className="text-primary/40 text-sm font-manrope">
                  Don't have an account?{' '}
                  <Text className="text-primary font-manrope-bold">Apply Now</Text>
                </Text>
              </Pressable>

              <View className="flex-row gap-6 pt-4">
                <MaterialCommunityIcons name="shield-check" size={24} color="rgba(46, 220, 107, 0.3)" />
                <MaterialCommunityIcons name="lock" size={24} color="rgba(46, 220, 107, 0.3)" />
                <MaterialCommunityIcons name="security" size={24} color="rgba(46, 220, 107, 0.3)" />
              </View>
            </View>
          </View>
        </View>

        <View className="p-6 items-center">
          <Text className="text-[10px] uppercase tracking-widest text-primary/30 font-manrope-bold">
            Encrypted End-to-End Connection
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
