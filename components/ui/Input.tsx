import React, { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import { Letter, Eye, EyeClosed } from '@solar-icons/react-native/Linear';

interface InputProps extends TextInputProps {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: 'email' | 'password';
  rightAction?: React.ReactNode;
  error?: string;
}

export function Input({ label, leftIcon, rightIcon, rightAction, secureTextEntry, error, ...props }: InputProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);

  const RightIconComponent = rightIcon === 'email' ? Letter : isSecure ? EyeClosed : Eye;

  return (
    <View className="gap-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-foreground text-sm font-manrope-semibold">{label}</Text>
        {rightAction}
      </View>
      <View className="relative">
        <TextInput
          {...props}
          secureTextEntry={isSecure}
          className={`w-full rounded-xl text-foreground border ${error ? 'border-red-500/50 bg-red-500/5' : 'border-border bg-surface'} h-14 ${leftIcon ? 'pl-12' : 'pl-4'} pr-12 text-base font-manrope`}
          placeholderTextColor={error ? 'rgba(239, 68, 68, 0.4)' : '#B5A99D'}
        />
        {leftIcon && (
          <View className="absolute left-4 top-4">
            {leftIcon}
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
            <RightIconComponent size={22} color={error ? 'rgba(239, 68, 68, 0.6)' : '#8C7B6B'} />
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="text-red-400 text-xs font-manrope mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
