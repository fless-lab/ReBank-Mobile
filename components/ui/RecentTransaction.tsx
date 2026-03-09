import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface RecentTransactionProps {
  icon: IconName;
  title: string;
  date: string;
  amount: string;
  onPress?: () => void;
}

export function RecentTransaction({ icon, title, date, amount, onPress }: RecentTransactionProps) {
  return (
    <Pressable
      className="flex-row items-center justify-between p-4 bg-primary/10 rounded-xl mb-2 active:bg-primary/20"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        <View className="size-10 rounded-full bg-slate-800 items-center justify-center">
          <MaterialCommunityIcons name={icon} size={20} color="#94a3b8" />
        </View>
        <View>
          <Text className="text-sm font-manrope-bold text-white">{title}</Text>
          <Text className="text-xs text-slate-500 font-manrope">{date}</Text>
        </View>
      </View>
      <Text className="text-sm font-manrope-bold text-white">{amount}</Text>
    </Pressable>
  );
}
