import { Button, Input, ScreenHeader } from '@/components/ui';
import { AuthService } from '@/lib/api/auth';
import { SignUpInput, signUpSchema } from '@/lib/validations/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SignUpInput) => {
    if (!agreed) {
      Alert.alert('Terms of Service', 'You must agree to the Terms of Service and Privacy Policy to create an account.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await AuthService.register(data.email, data.password);
      if (response.id_token && response.otp_exp) {
        // Navigate to OTP verification
        router.push({
          pathname: '/verify-otp',
          params: {
            mode: 'account-verify',
            email: data.email,
            id_token: response.id_token,
            otp_exp: String(response.otp_exp),
          },
        });
      } else {
        Alert.alert(
          'Info',
          response.message || 'Please check your email.',
          [{ text: 'OK', onPress: () => router.replace('/') }],
        );
      }
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An unexpected error occurred.');
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
        <ScreenHeader title="Sign Up" />

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

        <View className="px-6 py-4 gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Email Address"
                placeholder="michel-dos@gmail.com"
                leftIcon="email"
                keyboardType="email-address"
                autoCapitalize="none"
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
                placeholder="••••••••••"
                leftIcon="lock"
                secureTextEntry
                rightIcon="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Confirm Password"
                placeholder="••••••••••"
                leftIcon="lock-check"
                secureTextEntry
                rightIcon="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            )}
          />

          {/* Password requirements info */}
          <View className="bg-primary/5 rounded-xl p-4 border border-primary/10">
            <Text className="text-xs font-manrope-bold uppercase tracking-wider text-primary/50 mb-2">
              Password Requirements
            </Text>
            <Text className="text-slate-400 text-xs font-manrope leading-relaxed">
              Min. 10 characters, with uppercase, lowercase, number, and special character.
            </Text>
          </View>

          <Pressable
            className="flex-row items-start gap-3 py-2"
            onPress={() => setAgreed(!agreed)}
            disabled={isLoading}
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

          <View className="pt-4">
            <Button
              title="Create Account"
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </View>

          <View className="items-center pt-6 pb-12">
            <Pressable onPress={() => router.back()} disabled={isLoading}>
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
