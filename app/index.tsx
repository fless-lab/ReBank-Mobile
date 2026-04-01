import { Button, Input, NavBar } from '@/components/ui';
import { AuthService } from '@/lib/api/auth';
import { LoginInput, loginSchema } from '@/lib/validations/auth';
import { authenticateWithBiometrics } from '@/utils/biometrics';
import { getTokens } from '@/lib/api/client';
import { ShieldKeyhole, ShieldCheck, Lock, Shield, Scanner2 } from '@solar-icons/react-native/BoldDuotone';
import { Letter } from '@solar-icons/react-native/BoldDuotone';
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
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(data.email, data.password);
      // Backend always sends OTP → navigate to OTP screen
      router.push({
        pathname: '/verify-otp',
        params: {
          mode: '2fa-login',
          email: data.email,
          id_token: response.id_token,
          otp_exp: String(response.otp_exp),
        },
      });
    } catch (error: any) {
      Alert.alert('Connexion Echouée', error.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    try {
      const tokens = await getTokens();
      if (!tokens) {
        Alert.alert('Aucune Session', 'Veuillez d\'abord vous connecter avec vos identifiants pour activer la connexion biométrique.');
        return;
      }
      const success = await authenticateWithBiometrics();
      if (success) {
        router.replace('/(main)/home');
      }
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
            <View className="items-center mb-10">
              <View className="size-28 rounded-full bg-surface items-center justify-center border-2 border-border mb-6 shadow-sm">
                <ShieldKeyhole size={52} color="#8B6F47" />
              </View>
              <Text className="text-foreground text-[32px] font-manrope-bold tracking-tight mb-2">
                Bon Retour
              </Text>
              <Text className="text-muted text-base font-manrope">
                Accédez à votre compte en toute sécurité
              </Text>
            </View>

            <View className="gap-4">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <Input
                    label="Email"
                    placeholder="Entrez votre email"
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
                    label="Mot de passe"
                    placeholder="••••••••••"
                    secureTextEntry
                    rightIcon="password"
                    rightAction={
                      <Pressable onPress={() => router.push('/forgot-password')} disabled={isLoading}>
                        <Text className="text-primary text-xs font-manrope-bold">Mot de passe oublié ?</Text>
                      </Pressable>
                    }
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                  />
                )}
              />

              <Button
                title="Connexion Biométrique"
                variant="outline"
                iconComponent={<Scanner2 size={22} color="#8B6F47" />}
                disabled={isLoading}
                onPress={handleBiometricLogin}
              />

              <View className="pt-4">
                <Button
                  title="Se connecter"
                  variant="primary"
                  onPress={handleSubmit(onSubmit)}
                  loading={isLoading}
                />
              </View>
            </View>

            <View className="items-center mt-8 gap-4">
              <Pressable onPress={() => router.push('/sign-up')} disabled={isLoading}>
                <Text className="text-muted text-base font-manrope">
                  Pas de compte ?{' '}
                  <Text className="text-primary font-manrope-bold">S'inscrire</Text>
                </Text>
              </Pressable>

              <View className="flex-row gap-6 pt-4">
                <ShieldCheck size={24} color="#B5A99D" />
                <Lock size={24} color="#B5A99D" />
                <Shield size={24} color="#B5A99D" />
              </View>
            </View>
          </View>
        </View>

        <View className="p-6 items-center">
          <Text className="text-[10px] uppercase tracking-widest text-muted-light font-manrope-bold">
            Connexion Chiffrée de Bout en Bout
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
