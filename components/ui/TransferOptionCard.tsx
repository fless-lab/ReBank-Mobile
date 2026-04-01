import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AltArrowRight } from '@solar-icons/react-native/Linear';

interface TransferOptionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function TransferOptionCard({ icon, title, subtitle, onPress }: TransferOptionCardProps) {
  return (
    <Pressable
      className="flex-row items-center rounded-2xl border border-border bg-surface p-5 active:bg-surface-hover gap-4"
      onPress={onPress}
    >
      <View className="bg-surface-hover size-14 rounded-xl items-center justify-center">
        {icon}
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-foreground text-base font-manrope-bold">{title}</Text>
        <Text className="text-muted text-sm font-manrope">{subtitle}</Text>
      </View>
      <AltArrowRight size={22} color="#B5A99D" />
    </Pressable>
  );
}
