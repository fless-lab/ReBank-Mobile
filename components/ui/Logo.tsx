import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 32 : 24;
  const textClass =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
        ? 'text-3xl'
        : 'text-2xl';

  return (
    <View className="flex-row items-center gap-2">
      <View className="bg-primary/10 p-2 rounded-lg">
        <MaterialCommunityIcons name="pine-tree-variant" size={iconSize} color="#2edc6b" />
      </View>
      <Text className={`${textClass} font-manrope-extrabold tracking-tight text-white`}>
        Re<Text className="text-primary">Bank</Text>
      </Text>
    </View>
  );
}
