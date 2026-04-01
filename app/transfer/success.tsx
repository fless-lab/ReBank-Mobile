import { Button } from '@/components/ui';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransferSuccessScreen() {
  const router = useRouter();
  const { amount, name, txId, type } = useLocalSearchParams<{
    amount: string; name: string; txId: string; type?: string;
  }>();

  const titles: Record<string, string> = {
    deposit: 'Deposit Successful',
    withdraw: 'Withdrawal Successful',
    between: 'Transfer Complete',
    friend: 'Transfer Sent!',
  };

  const descriptions: Record<string, string> = {
    deposit: 'deposited into',
    withdraw: 'withdrawn from',
    between: 'moved to',
    friend: 'sent to',
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
          {titles[type || ''] || 'Transaction Successful'}
        </Text>
        <Text className="text-slate-400 text-base font-manrope text-center mb-8">
          <Text className="text-white font-manrope-bold">{amount} MAD</Text>
          {' '}{descriptions[type || ''] || 'transferred to'}{' '}
          <Text className="text-white font-manrope-bold">{name}</Text>
        </Text>

        {/* Receipt */}
        <View className="w-full bg-primary/5 rounded-2xl p-5 border border-primary/10 mb-8">
          <View className="flex-row justify-between mb-3">
            <Text className="text-slate-500 text-sm font-manrope">Reference</Text>
            <Text className="text-white text-sm font-manrope-semibold">
              {txId?.toUpperCase().slice(0, 14) || 'N/A'}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-slate-500 text-sm font-manrope">Date</Text>
            <Text className="text-white text-sm font-manrope-semibold">
              {new Date().toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-slate-500 text-sm font-manrope">Status</Text>
            <Text className="text-[#2edc6b] text-sm font-manrope-bold">Completed</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-slate-500 text-sm font-manrope">Amount</Text>
            <Text className="text-white text-sm font-manrope-semibold">{amount} MAD</Text>
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
