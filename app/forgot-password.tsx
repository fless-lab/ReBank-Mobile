import { Button, Input, ScreenHeader } from '@/components/ui';
import { AuthService } from '@/lib/api/auth';
import { RequestPasswordResetInput, requestPasswordResetSchema } from '@/lib/validations/auth';
import { LockKeyholeUnlocked, Letter } from '@solar-icons/react-native/BoldDuotone';
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
      Alert.alert('Erreur', error.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Réinitialisation" />

      <View className="flex-1 px-6">
        <View className="mt-8 mb-10">
          <View className="bg-surface-hover p-3 rounded-xl self-start mb-6">
            <LockKeyholeUnlocked size={28} color="#8B6F47" />
          </View>
          <Text className="text-foreground tracking-tight text-3xl font-manrope-extrabold leading-tight mb-3">
            Mot de passe oublié ?
          </Text>
          <Text className="text-muted text-base font-manrope leading-relaxed">
            Entrez l'email associé à votre compte et nous vous enverrons un code de vérification pour réinitialiser votre mot de passe.
          </Text>
        </View>

        <View className="gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Adresse Email"
                placeholder="Entrez votre email"
                leftIcon={<Letter size={22} color="#8C7B6B" />}
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
              title="Envoyer le Code"
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </View>
        </View>

        <View className="items-center mt-8">
          <Pressable onPress={() => router.back()} disabled={isLoading}>
            <Text className="text-muted text-base font-manrope">
              Vous vous souvenez ?{' '}
              <Text className="text-primary font-manrope-bold">Se Connecter</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
