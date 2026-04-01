import { Button, Input, ScreenHeader } from '@/components/ui';
import { AuthService } from '@/lib/api/auth';
import { SignUpInput, signUpSchema } from '@/lib/validations/auth';
import { Wallet, Lock, LockKeyhole, Letter } from '@solar-icons/react-native/BoldDuotone';
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

  const { control, handleSubmit, watch } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  const requirements = [
    { label: 'Min. 10 caractères', met: password.length >= 10 },
    { label: 'Une lettre majuscule', met: /[A-Z]/.test(password) },
    { label: 'Une lettre minuscule', met: /[a-z]/.test(password) },
    { label: 'Un chiffre', met: /[0-9]/.test(password) },
    { label: 'Un caractère spécial', met: /[\W_]/.test(password) },
  ];

  const onSubmit = async (data: SignUpInput) => {
    if (!agreed) {
      Alert.alert('Conditions d\'Utilisation', 'Vous devez accepter les Conditions d\'Utilisation et la Politique de Confidentialité pour créer un compte.');
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
          response.message || 'Veuillez vérifier votre email.',
          [{ text: 'OK', onPress: () => router.replace('/') }],
        );
      }
    } catch (error: any) {
      Alert.alert('Inscription Echouée', error.message || 'Une erreur inattendue est survenue.');
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
        <ScreenHeader title="Inscription" />

        <View className="px-6 pt-8 pb-4">
          <View className="bg-surface-hover p-3 rounded-xl self-start mb-6">
            <Wallet size={28} color="#8B6F47" />
          </View>
          <Text className="text-foreground tracking-tight text-4xl font-manrope-extrabold leading-tight mb-3">
            Rejoindre ReBank
          </Text>
          <Text className="text-muted text-base font-manrope leading-relaxed">
            Créez votre compte et profitez d'une expérience bancaire premium avec une sécurité renforcée et des transactions mondiales fluides.
          </Text>
        </View>

        <View className="px-6 py-4 gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Adresse Email"
                placeholder="michel-dos@gmail.com"
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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
              <Input
                label="Mot de passe"
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

          {/* Password requirements - live check */}
          <View className="flex-row flex-wrap gap-x-4 gap-y-2 px-1">
            {requirements.map((req) => (
              <View key={req.label} className="flex-row items-center gap-1.5">
                <View className={`size-4 rounded-full items-center justify-center ${req.met ? 'bg-[#5B8C5A]' : 'border border-border'}`}>
                  {req.met && <Text style={{fontSize: 8, color: '#FFFFFF', fontWeight: 'bold'}}>&#10003;</Text>}
                </View>
                <Text className={`text-xs font-manrope ${req.met ? 'text-[#5B8C5A] font-manrope-bold' : 'text-muted'}`}>
                  {req.label}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            className="flex-row items-start gap-3 py-2"
            onPress={() => setAgreed(!agreed)}
            disabled={isLoading}
          >
            <View className={`mt-0.5 size-5 rounded border items-center justify-center ${agreed ? 'bg-primary border-primary' : 'border-border bg-transparent'}`}>
              {agreed && <Text style={{fontSize: 10, color: '#1E1810', fontWeight: 'bold'}}>&#10003;</Text>}
            </View>
            <Text className="text-muted text-sm font-manrope flex-1">
              J'accepte les{' '}
              <Text className="text-primary">Conditions d'Utilisation</Text> et la{' '}
              <Text className="text-primary">Politique de Confidentialité</Text>.
            </Text>
          </Pressable>

          <View className="pt-4">
            <Button
              title="Créer un Compte"
              variant="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
            />
          </View>

          <View className="items-center pt-6 pb-12">
            <Pressable onPress={() => router.back()} disabled={isLoading}>
              <Text className="text-muted text-base font-manrope">
                Déjà inscrit ?{' '}
                <Text className="text-primary font-manrope-bold">Se Connecter</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
