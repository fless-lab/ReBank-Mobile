import { Button, Input, ScreenHeader } from '@/components/ui';
import { AuthService } from '@/lib/api/auth';
import { SetNewPasswordInput, setNewPasswordSchema } from '@/lib/validations/auth';
import { ShieldKeyhole, Lock, LockKeyhole } from '@solar-icons/react-native/BoldDuotone';
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
        'Mot de Passe Réinitialisé',
        response.message || 'Votre mot de passe a été réinitialisé avec succès.',
        [{ text: 'Se Connecter', onPress: () => router.replace('/') }],
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de réinitialiser le mot de passe.');
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
        <ScreenHeader title="Nouveau Mot de Passe" />

        <View className="flex-1 px-6">
          <View className="mt-8 mb-10">
            <View className="bg-surface-hover p-3 rounded-xl self-start mb-6">
              <ShieldKeyhole size={28} color="#8B6F47" />
            </View>
            <Text className="text-foreground tracking-tight text-3xl font-manrope-extrabold leading-tight mb-3">
              Nouveau Mot de Passe
            </Text>
            <Text className="text-muted text-base font-manrope leading-relaxed">
              Créez un mot de passe sécurisé pour protéger votre compte.
            </Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  label="Nouveau Mot de Passe"
                  placeholder="••••••••••"
                  leftIcon={<Lock size={22} color="#8C7B6B" />}
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
                  label="Confirmer le Mot de Passe"
                  placeholder="••••••••••"
                  leftIcon={<LockKeyhole size={22} color="#8C7B6B" />}
                  secureTextEntry
                  rightIcon="password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={error?.message}
                />
              )}
            />

            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-xs font-manrope-bold uppercase tracking-wider text-muted mb-2">
                Exigences du mot de passe
              </Text>
              <Text className="text-muted text-xs font-manrope leading-relaxed">
                Min. 10 caractères, avec majuscule, minuscule, chiffre et caractère spécial.
              </Text>
            </View>

            <View className="pt-4">
              <Button
                title="Réinitialiser le Mot de Passe"
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
