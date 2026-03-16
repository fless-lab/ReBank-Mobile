import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { getUserProfile, saveUserProfile, UserProfile } from '@/utils/userStore';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need access to your photos to update your avatar.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newProfile = { ...profile!, avatarUri: result.assets[0].uri };
      setProfile(newProfile);
      await saveUserProfile(newProfile);
    }
  };

  if (!profile) return null;

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-white text-xl font-manrope-bold tracking-tight">Your Profile</Text>
        </View>

        {/* Avatar & Name */}
        <View className="items-center px-6 pb-8">
          <Pressable onPress={pickImage} className="relative mb-4">
            <View className="size-24 rounded-full overflow-hidden bg-primary/20">
              {profile.avatarUri ? (
                <Image
                  source={{ uri: profile.avatarUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Text className="text-primary text-3xl font-manrope-bold">{initials}</Text>
                </View>
              )}
            </View>
            {/* Camera overlay */}
            <View className="absolute bottom-0 right-0 bg-primary size-8 rounded-full items-center justify-center border-2 border-background-dark">
              <MaterialCommunityIcons name="camera" size={16} color="#122017" />
            </View>
          </Pressable>
          <Text className="text-white text-xl font-manrope-bold">{profile.name}</Text>
          <Text className="text-slate-400 text-sm font-manrope">
            Elite Member · Since {profile.memberSince}
          </Text>
        </View>

        {/* Info Cards */}
        <View className="px-6 mb-6 gap-2">
          <View className="flex-row items-center gap-3 p-4 bg-primary/10 rounded-xl">
            <MaterialCommunityIcons name="email" size={18} color="rgba(46, 220, 107, 0.5)" />
            <Text className="text-slate-300 text-sm font-manrope flex-1">{profile.email}</Text>
          </View>
          <View className="flex-row items-center gap-3 p-4 bg-primary/10 rounded-xl">
            <MaterialCommunityIcons name="phone" size={18} color="rgba(46, 220, 107, 0.5)" />
            <Text className="text-slate-300 text-sm font-manrope flex-1">{profile.phone}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 gap-2">
          {[
            { icon: 'account-edit' as const, title: 'Personal Info', route: '/settings/personal-info' as any },
            { icon: 'shield-check' as const, title: 'Security', route: '/settings/security' as any },
            { icon: 'bell' as const, title: 'Notifications', route: null },
            { icon: 'help-circle' as const, title: 'Help & Support', route: null },
            { icon: 'file-document' as const, title: 'Legal', route: null },
          ].map((item) => (
            <Pressable 
              key={item.title} 
              className="flex-row items-center gap-4 p-4 bg-primary/10 rounded-xl active:bg-primary/20"
              onPress={() => item.route ? router.push(item.route) : Alert.alert('Coming Soon', `${item.title} settings are not implemented yet.`)}
            >
              <View className="size-10 rounded-lg bg-primary/20 items-center justify-center">
                <MaterialCommunityIcons name={item.icon} size={20} color="#2edc6b" />
              </View>
              <Text className="text-white text-sm font-manrope-bold flex-1">{item.title}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
          ))}

          {/* Logout */}
          <Pressable
            className="flex-row items-center gap-4 p-4 mt-4 rounded-xl active:bg-red-500/10"
            onPress={() => router.replace('/')}
          >
            <View className="size-10 rounded-lg bg-red-500/20 items-center justify-center">
              <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
            </View>
            <Text className="text-red-400 text-sm font-manrope-bold flex-1">Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
