import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface QuickSendContactProps {
  name: string;
  imageUrl?: string;
  isNew?: boolean;
  onPress?: () => void;
}

export function QuickSendContact({ name, imageUrl, isNew = false, onPress }: QuickSendContactProps) {
  return (
    <Pressable className="items-center gap-2" onPress={onPress}>
      {isNew ? (
        <View className="size-16 rounded-full border-2 border-dashed border-primary/40 items-center justify-center bg-primary/5">
          <MaterialCommunityIcons name="plus" size={24} color="#2edc6b" />
        </View>
      ) : (
        <View className="size-16 rounded-full overflow-hidden border-2 border-transparent">
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="w-full h-full bg-primary/20 items-center justify-center">
              <Text className="text-primary text-lg font-manrope-bold">{name.charAt(0)}</Text>
            </View>
          )}
        </View>
      )}
      <Text className="text-xs font-manrope-semibold text-white">{name}</Text>
    </Pressable>
  );
}
