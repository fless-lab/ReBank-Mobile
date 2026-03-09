import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
}

export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center px-4 py-3 justify-between">
      <Pressable
        className="size-12 items-center justify-center rounded-full active:bg-primary/10"
        onPress={onBack ?? (() => router.back())}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
      </Pressable>
      <Text className="text-white text-lg font-manrope-bold tracking-tight flex-1 text-center pr-12">
        {title}
      </Text>
    </View>
  );
}
