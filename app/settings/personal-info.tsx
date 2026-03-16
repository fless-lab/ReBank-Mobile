import { Button, Input, ScreenHeader } from '@/components/ui';
import { getUserProfile, saveUserProfile, UserProfile } from '@/utils/userStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserProfile().then((p) => {
      setProfile(p);
      setName(p.name);
      setEmail(p.email);
      setPhone(p.phone);
    });
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const p = { ...profile, name, email, phone };
      await saveUserProfile(p);
      Alert.alert('Success', 'Profile information updated successfully.');
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Personal Info" />
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="gap-4">
          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="John Doe"
            leftIcon="account"
          />
          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="john@example.com"
            keyboardType="email-address"
            rightIcon="email"
          />
          <Input
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="+1 234 567 8900"
            keyboardType="phone-pad"
            leftIcon="phone"
          />

          <View className="mt-8">
            <Button
              title="Save Changes"
              variant="primary"
              onPress={handleSave}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
