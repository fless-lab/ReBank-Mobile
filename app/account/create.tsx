import { Button, Input, ScreenHeader } from '@/components/ui';
import { AccountsService } from '@/lib/api/accounts';
import { WadOfMoney, CameraAdd, InfoCircle, UserCircle } from '@solar-icons/react-native/BoldDuotone';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateAccountScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identityUri, setIdentityUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickIdentityFile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin d\'accéder à vos photos pour télécharger votre pièce d\'identité.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIdentityUri(result.assets[0].uri);
      setErrors((prev) => ({ ...prev, identity: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!identityUri) newErrors.identity = 'La pièce d\'identité est requise';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      const response = await AccountsService.create(firstName.trim(), lastName.trim(), identityUri);
      Alert.alert(
        'Compte Créé',
        response.message || 'Votre compte a été créé et est en attente d\'approbation.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (error: any) {
      Alert.alert('Échec de la Création', error.message || 'Une erreur inattendue s\'est produite.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="flex-grow" keyboardShouldPersistTaps="handled">
        <ScreenHeader title="Nouveau Compte" />

        <View className="px-6 pt-8 pb-4">
          <View className="bg-surface border border-border p-3 rounded-xl self-start mb-6">
            <WadOfMoney size={28} color="#8B6F47" />
          </View>
          <Text className="text-foreground tracking-tight text-3xl font-manrope-extrabold leading-tight mb-3">
            Ouvrir un Compte Bancaire
          </Text>
          <Text className="text-muted text-base font-manrope leading-relaxed">
            Remplissez vos informations et téléchargez une pièce d'identité. Votre compte sera examiné et approuvé par notre équipe.
          </Text>
        </View>

        <View className="px-6 py-4 gap-5">
          {/* Prénom */}
          <Input
            label="Prénom"
            placeholder="Entrez votre prénom"
            leftIcon={<UserCircle size={22} color="#8C7B6B" />}
            autoCapitalize="words"
            value={firstName}
            onChangeText={(v) => { setFirstName(v); setErrors((p) => ({ ...p, firstName: '' })); }}
            error={errors.firstName}
          />

          {/* Nom */}
          <Input
            label="Nom"
            placeholder="Entrez votre nom"
            leftIcon={<UserCircle size={22} color="#8C7B6B" />}
            autoCapitalize="words"
            value={lastName}
            onChangeText={(v) => { setLastName(v); setErrors((p) => ({ ...p, lastName: '' })); }}
            error={errors.lastName}
          />

          {/* Pièce d'Identité */}
          <View>
            <Text className="text-xs font-manrope-bold uppercase tracking-widest text-muted mb-2">
              Pièce d'Identité
            </Text>
            <Pressable
              className={`rounded-2xl border-2 border-dashed p-6 items-center justify-center active:bg-surface-hover ${
                identityUri ? 'border-primary/30' : errors.identity ? 'border-red-500/30' : 'border-border'
              }`}
              onPress={pickIdentityFile}
            >
              {identityUri ? (
                <View className="items-center w-full">
                  <Image
                    source={{ uri: identityUri }}
                    style={{ width: '100%', height: 160, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                  <Text className="text-primary text-xs font-manrope-semibold mt-3">Appuyez pour changer</Text>
                </View>
              ) : (
                <View className="items-center py-4">
                  <View className="size-14 rounded-full bg-surface-hover items-center justify-center mb-3">
                    <CameraAdd size={24} color="#8B6F47" />
                  </View>
                  <Text className="text-foreground text-sm font-manrope-bold mb-1">Télécharger la Pièce d'Identité</Text>
                  <Text className="text-muted text-xs font-manrope">Format PNG ou JPEG</Text>
                </View>
              )}
            </Pressable>
            {errors.identity ? (
              <Text className="text-red-400 text-xs font-manrope mt-2">{errors.identity}</Text>
            ) : null}
          </View>

          {/* Carte d'Information */}
          <View className="bg-surface rounded-xl p-4 border border-border flex-row items-start gap-3">
            <InfoCircle size={20} color="#8C7B6B" />
            <Text className="text-muted text-xs font-manrope flex-1 leading-relaxed">
              Votre compte restera en attente jusqu'à son approbation par notre équipe. Une fois approuvé, vous recevrez un numéro de compte unique et pourrez effectuer des transactions.
            </Text>
          </View>

          <View className="pt-4 pb-8">
            <Button
              title="Créer le Compte"
              variant="primary"
              onPress={handleSubmit}
              loading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
