import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface RecentTransactionProps {
  icon: React.ReactNode;
  title: string;
  date: string;
  amount: string;
  onPress?: () => void;
}

export function RecentTransaction({ icon, title, date, amount, onPress }: RecentTransactionProps) {
  return (
    <Pressable
      className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-2 border border-border active:bg-surface-hover"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        <View className="size-10 rounded-full bg-surface-hover items-center justify-center">
          {icon}
        </View>
        <View>
          <Text className="text-sm font-manrope-bold text-foreground">{title}</Text>
          <Text className="text-xs text-muted font-manrope">{date}</Text>
        </View>
      </View>
      <Text className="text-sm font-manrope-bold text-foreground">{amount}</Text>
    </Pressable>
  );
}
