import { Button, Input, ScreenHeader } from '@/components/ui';
import { AuthService } from '@/lib/api/auth';
import { SetNewPasswordInput, setNewPasswordSchema } from '@/lib/validations/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetNewPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    email?: string;
    reset_token?: string;
    reset_exp?: string;
  }>();

  const email = params.email || '';
  const resetToken = params.reset_token || '';
  const resetExp = parseFloat(params.reset_exp || '0');

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit } = useForm<SetNewPasswordInput>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SetNewPasswordInput) => {
    try {
      setIsLoading(true);
      const response = await AuthService.resetPassword(
        resetToken, resetExp, email, data.password,
      );
      Alert.alert(
        'Password Reset',
        response.message || 'Your password has been reset successfully.',
        [{ text: 'Log In', onPress: () => router.replace('/') }],
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password.');
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
        <ScreenHeader title="New Password" />

        <View className="flex-1 px-6">
          <View className="mt-8 mb-10">
            <View className="bg-primary/10 p-3 rounded-xl self-start mb-6">
              <MaterialCommunityIcons name="shield-key" size={28} color="#2edc6b" />
            </View>
            <Text className="text-white tracking-tight text-3xl font-manrope-extrabold leading-tight mb-3">
              Set New Password
            </Text>
            <Text className="text-slate-400 text-base font-manrope leading-relaxed">
              Create a strong password to secure your account.
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  label="New Password"
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

            <View className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <Text className="text-xs font-manrope-bold uppercase tracking-wider text-primary/50 mb-2">
                Password Requirements
              </Text>
              <Text className="text-slate-400 text-xs font-manrope leading-relaxed">
                Min. 10 characters, with uppercase, lowercase, number, and special character.
              </Text>
            </View>

            <View className="pt-4">
              <Button
                title="Reset Password"
                variant="primary"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
