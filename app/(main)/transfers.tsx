import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { TransferOptionCard } from '@/components/ui';
import { TransactionsService } from '@/lib/api/transactions';
import { Transaction } from '@/lib/types/api';

const TX_TYPE_CONFIG = {
  DEPOSIT: { icon: 'cash-plus' as const, color: '#2edc6b', label: 'Deposit' },
  WITHDRAWAL: { icon: 'cash-minus' as const, color: '#ef4444', label: 'Withdrawal' },
  TRANSFER: { icon: 'bank-transfer' as const, color: '#818cf8', label: 'Transfer' },
};

export default function TransfersScreen() {
  const router = useRouter();
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);

  useFocusEffect(
    useCallback(() => {
      TransactionsService.list()
        .then((txs) => setRecentTx(txs.slice(0, 5)))
        .catch(() => {});
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-white text-xl font-manrope-bold tracking-tight">Transfer & Pay</Text>
        </View>

        {/* Transfer Options Grid */}
        <View className="px-4 pt-2">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4 px-2">Banking Operations</Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="w-[48%]">
              <TransferOptionCard
                icon="cash-plus"
                title="Deposit"
                subtitle="Add funds to account"
                onPress={() => router.push('/transfer/deposit' as any)}
              />
            </View>
            <View className="w-[48%]">
              <TransferOptionCard
                icon="cash-minus"
                title="Withdraw"
                subtitle="Cash out funds"
                onPress={() => router.push('/transfer/withdraw' as any)}
              />
            </View>
            <View className="w-[48%]">
              <TransferOptionCard
                icon="bank-transfer"
                title="Transfer"
                subtitle="Send to account"
                onPress={() => router.push('/transfer/send-friend' as any)}
              />
            </View>
            <View className="w-[48%]">
              <TransferOptionCard
                icon="swap-horizontal"
                title="Between Accounts"
                subtitle="Move money instantly"
                onPress={() => router.push('/transfer/between-accounts' as any)}
              />
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mt-8">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Recent Activity</Text>
          {recentTx.length === 0 ? (
            <Text className="text-slate-500 text-sm font-manrope text-center mt-4">No recent transactions</Text>
          ) : (
            recentTx.map((tx) => {
              const config = TX_TYPE_CONFIG[tx.transaction_type];
              const isDeposit = tx.transaction_type === 'DEPOSIT';
              const dateStr = new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

              let title = config.label;
              if (tx.transaction_type === 'TRANSFER' && tx.destination_account) {
                title = `To ${tx.destination_account.first_name} ${tx.destination_account.last_name}`;
              }

              return (
                <View
                  key={tx.id}
                  className="flex-row items-center justify-between p-4 bg-primary/5 rounded-xl mb-2"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="size-10 rounded-full bg-slate-800 items-center justify-center">
                      <MaterialCommunityIcons name={config.icon} size={20} color={config.color} />
                    </View>
                    <View>
                      <Text className="text-sm font-manrope-bold text-white">{title}</Text>
                      <Text className="text-xs text-slate-500 font-manrope">{dateStr} · {tx.reference}</Text>
                    </View>
                  </View>
                  <Text className={`text-sm font-manrope-bold ${isDeposit ? 'text-primary' : 'text-white'}`}>
                    {isDeposit ? '+' : '-'}{tx.amount.toLocaleString()} MAD
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
