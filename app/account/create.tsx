import { Button, Input, ScreenHeader } from '@/components/ui';
import { AccountsService } from '@/lib/api/accounts';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      Alert.alert('Permission needed', 'We need access to your photos to upload your identity document.');
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
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!identityUri) newErrors.identity = 'Identity document is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      const response = await AccountsService.create(firstName.trim(), lastName.trim(), identityUri);
      Alert.alert(
        'Account Created',
        response.message || 'Your account has been created and is pending approval.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (error: any) {
      Alert.alert('Creation Failed', error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="flex-grow" keyboardShouldPersistTaps="handled">
        <ScreenHeader title="New Account" />

        <View className="px-6 pt-8 pb-4">
          <View className="bg-primary/10 p-3 rounded-xl self-start mb-6">
            <MaterialCommunityIcons name="bank-plus" size={28} color="#2edc6b" />
          </View>
          <Text className="text-white tracking-tight text-3xl font-manrope-extrabold leading-tight mb-3">
            Open a Bank Account
          </Text>
          <Text className="text-slate-400 text-base font-manrope leading-relaxed">
            Fill in your details and upload an identity document. Your account will be reviewed and approved by our staff.
          </Text>
        </View>

        <View className="px-6 py-4 gap-5">
          {/* First Name */}
          <Input
            label="First Name"
            placeholder="Enter your first name"
            leftIcon="account"
            autoCapitalize="words"
            value={firstName}
            onChangeText={(v) => { setFirstName(v); setErrors((p) => ({ ...p, firstName: '' })); }}
            error={errors.firstName}
          />

          {/* Last Name */}
          <Input
            label="Last Name"
            placeholder="Enter your last name"
            leftIcon="account"
            autoCapitalize="words"
            value={lastName}
            onChangeText={(v) => { setLastName(v); setErrors((p) => ({ ...p, lastName: '' })); }}
            error={errors.lastName}
          />

          {/* Identity File Upload */}
          <View>
            <Text className="text-xs font-manrope-bold uppercase tracking-widest text-primary/50 mb-2">
              Identity Document
            </Text>
            <Pressable
              className={`rounded-2xl border-2 border-dashed p-6 items-center justify-center active:bg-primary/10 ${
                identityUri ? 'border-primary/30' : errors.identity ? 'border-red-500/30' : 'border-primary/20'
              }`}
              onPress={pickIdentityFile}
            >
              {identityUri ? (
                <View className="items-center">
                  <Image
                    source={{ uri: identityUri }}
                    className="w-full h-40 rounded-xl mb-3"
                    resizeMode="cover"
                  />
                  <Text className="text-primary text-xs font-manrope-semibold">Tap to change</Text>
                </View>
              ) : (
                <View className="items-center py-4">
                  <View className="size-14 rounded-full bg-primary/10 items-center justify-center mb-3">
                    <MaterialCommunityIcons name="camera-plus" size={24} color="#2edc6b" />
                  </View>
                  <Text className="text-white text-sm font-manrope-bold mb-1">Upload Identity Document</Text>
                  <Text className="text-slate-400 text-xs font-manrope">PNG or JPEG format</Text>
                </View>
              )}
            </Pressable>
            {errors.identity ? (
              <Text className="text-red-400 text-xs font-manrope mt-2">{errors.identity}</Text>
            ) : null}
          </View>

          {/* Info Card */}
          <View className="bg-primary/5 rounded-xl p-4 border border-primary/10 flex-row items-start gap-3">
            <MaterialCommunityIcons name="information" size={20} color="rgba(46, 220, 107, 0.5)" />
            <Text className="text-slate-400 text-xs font-manrope flex-1 leading-relaxed">
              Your account will be pending until approved by our staff. Once approved, you'll receive a unique account number and can start making transactions.
            </Text>
          </View>

          <View className="pt-4 pb-8">
            <Button
              title="Create Account"
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
