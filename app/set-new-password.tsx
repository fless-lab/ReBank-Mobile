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

interface Requirement {
  label: string;
  met: boolean;
}

export default function SetNewPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, watch } = useForm<SetNewPasswordInput>({
    resolver: zodResolver(setNewPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const watchPassword = watch('password');

  const requirements: Requirement[] = [
    { label: 'At least 8 characters long', met: watchPassword.length >= 8 },
    { label: 'Include a number and a symbol', met: /\d/.test(watchPassword) && /[^a-zA-Z0-9]/.test(watchPassword) },
    { label: 'One uppercase character', met: /[A-Z]/.test(watchPassword) },
  ];

  const onSubmit = async (data: SetNewPasswordInput) => {
    try {
      setIsLoading(true);
      await AuthService.setNewPassword(data, params.token || '');
      Alert.alert('Success', 'Password has been successfully updated.', [
        { text: 'Log In', onPress: () => router.replace('/') }
      ]);
    } catch (error: any) {
      Alert.alert('Reset Failed', error.message || 'An unexpected error occurred.');
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
        <ScreenHeader title="Reset Password" />

        <View className="px-6 pt-8 pb-2">
          {/* Icon */}
          <View className="size-16 bg-primary/20 rounded-2xl items-center justify-center mb-6">
            <MaterialCommunityIcons name="lock-reset" size={32} color="#2edc6b" />
          </View>
          <Text className="text-white tracking-tight text-[32px] font-manrope-bold leading-tight mb-3">
            Create new password
          </Text>
          <Text className="text-slate-400 text-base font-manrope leading-relaxed mb-6">
            Your new password must be different from previously used passwords to keep your ReBank account secure.
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 gap-4">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="New Password"
                placeholder="Enter new password"
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
                label="Confirm New Password"
                placeholder="Confirm new password"
                secureTextEntry
                rightIcon="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={error?.message}
              />
            )}
          />

          {/* Requirements */}
          <View className="py-4 gap-3">
            <Text className="text-xs font-manrope-bold uppercase tracking-wider text-primary/50 mb-1">
              Security Requirements
            </Text>
            {requirements.map((req, i) => (
              <View key={i} className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name={req.met ? 'check-circle' : 'circle-outline'}
                  size={18}
                  color={req.met ? '#2edc6b' : 'rgba(148, 163, 184, 0.3)'}
                />
                <Text className="text-slate-400 text-sm font-manrope">{req.label}</Text>
              </View>
            ))}
          </View>

          {/* Submit */}
          <View className="pt-6 pb-6">
            <Button
              title="Reset Password"
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </View>

          {/* Help */}
          <View className="items-center pb-10">
            <Text className="text-slate-500 text-sm font-manrope">
              Having trouble?{' '}
              <Text className="text-primary font-manrope-semibold">Contact ReBank Support</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
