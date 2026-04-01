import React, { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

interface OtpInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  onChange?: (code: string) => void;
  error?: boolean;
}

export function OtpInput({ length = 6, onComplete, onChange, error }: OtpInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const refs = useRef<(TextInput | null)[]>(Array(length).fill(null));

  const handleChange = (text: string, index: number) => {
    const newValues = [...values];

    if (text.length > 1) {
      const chars = text.split('').slice(0, length);
      chars.forEach((char, i) => {
        if (index + i < length) {
          newValues[index + i] = char;
        }
      });
      setValues(newValues);
      const nextIndex = Math.min(index + chars.length, length - 1);
      refs.current[nextIndex]?.focus();
    } else {
      newValues[index] = text;
      setValues(newValues);
      if (text && index < length - 1) {
        refs.current[index + 1]?.focus();
      }
    }

    const code = newValues.join('');
    onChange?.(code);
    if (code.length === length && !newValues.includes('')) {
      onComplete?.(code);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !values[index] && index > 0) {
      refs.current[index - 1]?.focus();
      const newValues = [...values];
      newValues[index - 1] = '';
      setValues(newValues);

      const code = newValues.join('');
      onChange?.(code);
    }
  };

  return (
    <View className="flex-row justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(el) => { refs.current[index] = el; }}
          className={`w-[50px] h-[68px] text-center text-3xl font-manrope-bold ${error ? 'bg-red-500/5 border-red-500/50' : 'bg-surface border-border'} border-2 rounded-2xl text-foreground`}
          maxLength={1}
          keyboardType="number-pad"
          value={values[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          placeholderTextColor="#B5A99D"
          placeholder="•"
        />
      ))}
    </View>
  );
}
