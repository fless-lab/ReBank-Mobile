import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, TextInputProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface InputProps extends TextInputProps {
  label: string;
  leftIcon?: IconName;
  rightIcon?: 'email' | 'password';
  rightAction?: React.ReactNode;
}

export function Input({ label, leftIcon, rightIcon, rightAction, secureTextEntry, ...props }: InputProps) {
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
          className={`w-full rounded-xl text-white border border-primary/20 bg-primary/5 h-14 ${leftIcon ? 'pl-12' : 'pl-4'} pr-12 text-base font-manrope`}
          placeholderTextColor="rgba(46, 220, 107, 0.3)"
        />
        {leftIcon && (
          <View className="absolute left-4 top-4">
            <MaterialCommunityIcons name={leftIcon} size={22} color="rgba(46, 220, 107, 0.4)" />
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
            <MaterialCommunityIcons name={iconName} size={22} color="rgba(46, 220, 107, 0.4)" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
