import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface TransferOptionCardProps {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function TransferOptionCard({ icon, title, subtitle, onPress }: TransferOptionCardProps) {
  return (
    <Pressable
      className="flex-col justify-between rounded-xl border border-primary/20 bg-primary/10 p-5 active:bg-primary/20 h-[140px]"
      onPress={onPress}
    >
      <View className="bg-primary/20 size-10 rounded-lg items-center justify-center">
        <MaterialCommunityIcons name={icon} size={24} color="#2edc6b" />
      </View>
      <View className="gap-1">
        <Text className="text-white text-sm font-manrope-bold leading-tight" numberOfLines={2}>{title}</Text>
        <Text className="text-slate-400 text-xs font-manrope-medium" numberOfLines={1}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}
