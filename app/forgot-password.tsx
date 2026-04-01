import { Button, Input, ScreenHeader } from '@/components/ui';
import { AuthService } from '@/lib/api/auth';
import { RequestPasswordResetInput, requestPasswordResetSchema } from '@/lib/validations/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: RequestPasswordResetInput) => {
    try {
      setIsLoading(true);
      const response = await AuthService.requestPasswordReset(data.email);
      router.push({
        pathname: '/verify-otp',
        params: {
          mode: 'password-reset',
          email: data.email,
          id_token: response.id_token,
          otp_exp: String(response.otp_exp),
        },
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Reset Password" />

      <View className="flex-1 px-6">
        <View className="mt-8 mb-10">
          <View className="bg-primary/10 p-3 rounded-xl self-start mb-6">
            <MaterialCommunityIcons name="lock-reset" size={28} color="#2edc6b" />
          </View>
          <Text className="text-white tracking-tight text-3xl font-manrope-extrabold leading-tight mb-3">
            Forgot Password?
          </Text>
          <Text className="text-slate-400 text-base font-manrope leading-relaxed">
            Enter the email associated with your account and we'll send you a verification code to reset your password.
          </Text>
        </View>

        <View className="gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Email Address"
                placeholder="Enter your email"
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

          <View className="pt-4">
            <Button
              title="Send Verification Code"
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </View>
        </View>

        <View className="items-center mt-8">
          <Pressable onPress={() => router.back()} disabled={isLoading}>
            <Text className="text-slate-400 text-base font-manrope">
              Remember your password?{' '}
              <Text className="text-primary font-manrope-bold">Log In</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
