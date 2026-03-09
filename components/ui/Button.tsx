import React from 'react';
import { Text, Pressable, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: IconName;
  iconComponent?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconComponent,
  loading = false,
  fullWidth = true,
}: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center gap-2 h-14 rounded-xl';

  const variantClasses = {
    primary: `${baseClasses} bg-primary shadow-lg`,
    outline: `${baseClasses} border border-primary/20 bg-primary/5`,
    ghost: `${baseClasses} bg-transparent`,
  };

  const textClasses = {
    primary: 'text-background-dark text-lg font-manrope-bold',
    outline: 'text-primary text-sm font-manrope-semibold',
    ghost: 'text-primary text-sm font-manrope-semibold',
  };

  const iconColor = {
    primary: '#122017',
    outline: '#2edc6b',
    ghost: '#2edc6b',
  };

  return (
    <Pressable
      className={`${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} active:opacity-80`}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={iconColor[variant]} />
      ) : (
        <>
          {iconComponent}
          {icon && !iconComponent && (
            <MaterialCommunityIcons name={icon} size={22} color={iconColor[variant]} />
          )}
          <Text className={textClasses[variant]}>{title}</Text>
          {variant === 'primary' && (
            <MaterialCommunityIcons name="arrow-right" size={20} color={iconColor[variant]} />
          )}
        </>
      )}
    </Pressable>
  );
}
