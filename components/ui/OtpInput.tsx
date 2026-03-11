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
    <View className="flex-row justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(el) => { refs.current[index] = el; }}
          className={`w-12 h-16 text-center text-2xl font-manrope-bold ${error ? 'bg-red-500/5 border-red-500/50' : 'bg-primary/5 border-primary/20'} border-2 rounded-xl text-white`}
          maxLength={1}
          keyboardType="number-pad"
          value={values[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
          placeholderTextColor="rgba(46, 220, 107, 0.2)"
          placeholder="•"
        />
      ))}
    </View>
  );
}
