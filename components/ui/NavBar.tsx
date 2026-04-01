import React from 'react';
import { View } from 'react-native';
import { Logo } from './Logo';

interface NavBarProps {
  children?: React.ReactNode;
}

export function NavBar({ children }: NavBarProps) {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-transparent">
      <Logo size="md" />
      {children}
    </View>
  );
}
