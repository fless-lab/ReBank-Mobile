import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { ArrowRight } from '@solar-icons/react-native/Linear';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  iconComponent?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  iconComponent,
  loading = false,
  fullWidth = true,
  disabled = false,
}: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center gap-2 h-14 rounded-xl';

  const variantClasses = {
    primary: `${baseClasses} bg-primary shadow-lg`,
    outline: `${baseClasses} border border-border bg-surface`,
    ghost: `${baseClasses} bg-transparent`,
  };

  const textClasses = {
    primary: 'text-white text-lg font-manrope-bold',
    outline: 'text-primary text-sm font-manrope-semibold',
    ghost: 'text-primary text-sm font-manrope-semibold',
  };

  const iconColor = {
    primary: '#FFFFFF',
    outline: '#8B6F47',
    ghost: '#8B6F47',
  };

  return (
    <Pressable
      className={`${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${(disabled || loading) ? 'opacity-50' : 'active:opacity-80'}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={iconColor[variant]} />
      ) : (
        <>
          {iconComponent}
          <Text className={textClasses[variant]}>{title}</Text>
          {variant === 'primary' && (
            <ArrowRight size={20} color={iconColor[variant]} />
          )}
        </>
      )}
    </Pressable>
  );
}
