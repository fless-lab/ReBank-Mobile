import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

export type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface InputProps extends TextInputProps {
  label: string;
  leftIcon?: IconName;
  rightIcon?: 'email' | 'password';
  rightAction?: React.ReactNode;
  error?: string;
}

export function Input({ label, leftIcon, rightIcon, rightAction, secureTextEntry, error, ...props }: InputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

  const iconName: IconName = rightIcon === 'email'
    ? 'email'
    : isSecure
      ? 'eye-off'
      : 'eye';

  return (
    <View className="gap-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-slate-200 text-sm font-manrope-semibold">{label}</Text>
        {rightAction}
      </View>
      <View className="relative">
        <TextInput
          {...props}
          secureTextEntry={isSecure}
          className={`w-full rounded-xl text-white border ${error ? 'border-red-500/50 bg-red-500/5' : 'border-primary/20 bg-primary/5'} h-14 ${leftIcon ? 'pl-12' : 'pl-4'} pr-12 text-base font-manrope`}
          placeholderTextColor={error ? 'rgba(239, 68, 68, 0.4)' : 'rgba(46, 220, 107, 0.3)'}
        />
        {leftIcon && (
          <View className="absolute left-4 top-4">
            <MaterialCommunityIcons name={leftIcon} size={22} color={error ? 'rgba(239, 68, 68, 0.6)' : 'rgba(46, 220, 107, 0.4)'} />
          </View>
        )}
        {rightIcon && (
          <Pressable
            className="absolute right-4 top-4"
            onPress={() => {
              if (rightIcon === 'password') {
                setIsSecure(!isSecure);
              }
            }}
          >
            <MaterialCommunityIcons name={iconName} size={22} color={error ? 'rgba(239, 68, 68, 0.6)' : 'rgba(46, 220, 107, 0.4)'} />
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="text-red-400 text-xs font-manrope mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
