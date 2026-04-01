import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AltArrowLeft } from '@solar-icons/react-native/Linear';
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
        className="size-12 items-center justify-center rounded-full active:bg-surface-hover"
        onPress={onBack ?? (() => router.back())}
      >
        <AltArrowLeft size={24} color="#1E1810" />
      </Pressable>
      <Text className="text-foreground text-lg font-manrope-bold tracking-tight flex-1 text-center pr-12">
        {title}
      </Text>
    </View>
  );
}
