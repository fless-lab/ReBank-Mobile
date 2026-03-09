import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-white text-xl font-manrope-bold tracking-tight">Profile</Text>
        </View>

        {/* Avatar & Name */}
        <View className="items-center px-6 pb-8">
          <View className="size-20 rounded-full bg-primary/20 items-center justify-center mb-4">
            <Text className="text-primary text-3xl font-manrope-bold">JS</Text>
          </View>
          <Text className="text-white text-xl font-manrope-bold">Jameson Sterling</Text>
          <Text className="text-slate-400 text-sm font-manrope">Elite Member · Since 2021</Text>
        </View>

        {/* Menu Items */}
        <View className="px-6 gap-2">
          {[
            { icon: 'account-edit' as const, title: 'Personal Info' },
            { icon: 'shield-check' as const, title: 'Security' },
            { icon: 'bell' as const, title: 'Notifications' },
            { icon: 'help-circle' as const, title: 'Help & Support' },
            { icon: 'file-document' as const, title: 'Legal' },
          ].map((item) => (
            <Pressable key={item.title} className="flex-row items-center gap-4 p-4 bg-primary/10 rounded-xl active:bg-primary/20">
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
