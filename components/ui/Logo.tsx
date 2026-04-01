import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

function LogoIcon({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M10 28L10 22L5 22L10 15L6.5 15L11 8L8 8L13 2L18 8L15 8L19.5 15L16 15L21 22L16 22L16 28Z"
        fill="#8B6F47"
        opacity={0.45}
      />
      <Path
        d="M16 28L16 22L11 22L16 15L12.5 15L17 8L14 8L19 2L24 8L21 8L25.5 15L22 15L27 22L22 22L22 28Z"
        fill="#8B6F47"
        opacity={1}
      />
    </Svg>
  );
}

export function Logo({ size = 'md' }: LogoProps) {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 36 : 28;
  const containerSize = size === 'sm' ? 'p-1.5' : size === 'lg' ? 'p-3' : 'p-2';
  const textClass =
    size === 'sm'
      ? 'text-lg'
      : size === 'lg'
        ? 'text-3xl'
        : 'text-2xl';

  return (
    <View className="flex-row items-center gap-2">
      <View className={`bg-surface-hover ${containerSize} rounded-lg`}>
        <LogoIcon size={iconSize} />
      </View>
      <Text className={`${textClass} font-manrope-extrabold tracking-tight text-foreground`}>
        Re<Text className="text-primary">Bank</Text>
      </Text>
    </View>
  );
}
