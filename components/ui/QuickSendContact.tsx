import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { AddCircle } from '@solar-icons/react-native/BoldDuotone';
import { getAvatarColor, getAvatarInitials } from '@/utils/avatar';

interface QuickSendContactProps {
  name: string;
  seed?: string;
  isNew?: boolean;
  onPress?: () => void;
}

export function QuickSendContact({ name, seed, isNew = false, onPress }: QuickSendContactProps) {
  const color = getAvatarColor(seed || name);
  const initials = getAvatarInitials(name);

  return (
    <Pressable className="items-center gap-2 w-[68px]" onPress={onPress}>
      {isNew ? (
        <View className="size-14 rounded-full border-2 border-dashed border-primary/40 items-center justify-center bg-surface-hover">
          <AddCircle size={22} color="#8B6F47" />
        </View>
      ) : (
        <View
          className="size-14 rounded-full items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Text className="text-white text-base font-manrope-bold">{initials}</Text>
        </View>
      )}
      <Text className="text-xs font-manrope-semibold text-foreground text-center" numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
}
