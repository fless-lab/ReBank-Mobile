import { Button } from '@/components/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransferSuccessScreen() {
  const router = useRouter();
  const { amount, name, txId, type, fee, country } = useLocalSearchParams<{
    amount: string; name: string; txId: string;
    type?: string; fee?: string; country?: string;
  }>();

  const titles: Record<string, string> = {
    between: 'Transfer Complete',
    friend: 'Money Sent!',
    bill: 'Bill Paid!',
    international: 'International Transfer Sent',
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-1 items-center justify-center px-6">
        {/* Animated Check */}
        <View className="size-24 rounded-full bg-primary/20 items-center justify-center mb-6">
          <View className="size-16 rounded-full bg-primary/40 items-center justify-center">
            <MaterialCommunityIcons name="check-bold" size={40} color="#2edc6b" />
          </View>
        </View>

        <Text className="text-white text-2xl font-manrope-bold tracking-tight mb-2 text-center">
          {titles[type || ''] || 'Transfer Successful'}
        </Text>
        <Text className="text-slate-400 text-base font-manrope text-center mb-8">
          <Text className="text-white font-manrope-bold">${amount}</Text>
          {type === 'between' ? ' moved to ' : ' sent to '}
          <Text className="text-white font-manrope-bold">{name}</Text>
        </Text>

        {/* Receipt */}
        <View className="w-full bg-primary/5 rounded-2xl p-5 border border-primary/10 mb-8">
          <View className="flex-row justify-between mb-3">
            <Text className="text-slate-500 text-sm font-manrope">Reference</Text>
            <Text className="text-white text-sm font-manrope-semibold">{txId?.toUpperCase().slice(0, 14) || 'TX-8820129A'}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-slate-500 text-sm font-manrope">Date</Text>
            <Text className="text-white text-sm font-manrope-semibold">{new Date().toLocaleDateString()}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-slate-500 text-sm font-manrope">Status</Text>
            <Text className="text-[#2edc6b] text-sm font-manrope-bold">Completed</Text>
          </View>
          {type === 'international' && (
            <>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-500 text-sm font-manrope">Country</Text>
                <Text className="text-white text-sm font-manrope-semibold">{country}</Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-slate-500 text-sm font-manrope">Fee</Text>
                <Text className="text-white text-sm font-manrope-semibold">${fee}</Text>
              </View>
            </>
          )}
          <View className="flex-row justify-between">
            <Text className="text-slate-500 text-sm font-manrope">{type === 'international' ? 'Total' : 'Fee'}</Text>
            <Text className="text-white text-sm font-manrope-semibold">
              {type === 'international' ? `$${(parseFloat(amount || '0') + parseFloat(fee || '0')).toFixed(2)}` : '$0.00'}
            </Text>
          </View>
        </View>

        <View className="w-full gap-3">
          <Button title="Back to Home" variant="primary" onPress={() => router.replace('/(main)/home')} />
          <Button title="Make Another Transfer" variant="outline" onPress={() => router.replace('/(main)/transfers')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
