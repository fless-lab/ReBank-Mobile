import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserProfile } from '@/utils/userStore';
import { TransactionsService } from '@/lib/api/transactions';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Transaction } from '@/lib/mockDb';

export default function HomeScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useFocusEffect(
    useCallback(() => {
      getUserProfile().then((p) => setFirstName(p.name.split(' ')[0]));
      const loadData = async () => {
        const bal = await TransactionsService.getBalance();
        const txs = await TransactionsService.getRecentTransactions(8);
        setBalance(bal);
        setTransactions(txs);
      };
      loadData();
    }, [])
  );

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <View>
            <Text className="text-slate-400 text-sm font-manrope">{getGreeting()},</Text>
            <Text className="text-white text-xl font-manrope-bold">{firstName}</Text>
          </View>
          <View className="size-10 rounded-full bg-primary/20 items-center justify-center">
            <MaterialCommunityIcons name="bell" size={20} color="#2edc6b" />
          </View>
        </View>

        {/* Balance Card */}
        <View className="mx-6 p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
          <Text className="text-primary/60 text-xs font-manrope-bold uppercase tracking-widest mb-2">
            Total Balance
          </Text>
          <Text className="text-white text-4xl font-manrope-extrabold tracking-tight mb-1">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View className="flex-row items-center gap-1 mt-2">
            <MaterialCommunityIcons name="trending-up" size={16} color="#2edc6b" />
            <Text className="text-primary text-sm font-manrope-semibold">+2.4% this month</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Quick Actions</Text>
          <View className="flex-row gap-4">
            {[
              { icon: 'send' as const, label: 'Send', route: '/transfer/send-friend' },
              { icon: 'cash-plus' as const, label: 'Receive', route: null },
              { icon: 'qrcode-scan' as const, label: 'Scan', route: null },
              { icon: 'receipt' as const, label: 'Pay', route: '/transfer/pay-bills' },
            ].map((action) => (
              <Pressable
                key={action.label}
                className="flex-1 items-center gap-2"
                onPress={() => action.route
                  ? router.push(action.route as any)
                  : null
                }
              >
                <View className="size-12 rounded-xl bg-primary/10 items-center justify-center">
                  <MaterialCommunityIcons name={action.icon} size={22} color="#2edc6b" />
                </View>
                <Text className="text-xs font-manrope-semibold text-slate-400">{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Recent Transactions</Text>
          {transactions.map((tx) => {
            const isPositive = tx.amount > 0;
            const amountStr = `${isPositive ? '+' : '-'}$${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            const dateStr = new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

            return (
              <Pressable
                key={tx.id}
                className="flex-row items-center justify-between p-4 bg-primary/10 rounded-xl mb-2 active:bg-primary/20"
                onPress={() => router.push({ pathname: '/transaction/[id]' as any, params: { id: tx.id } })}
              >
                <View className="flex-row items-center gap-3">
                  <View className="size-10 rounded-full bg-slate-800 items-center justify-center">
                    <MaterialCommunityIcons name={tx.icon as any} size={20} color="#94a3b8" />
                  </View>
                  <View>
                    <Text className="text-sm font-manrope-bold text-white">{tx.title}</Text>
                    <Text className="text-xs text-slate-500 font-manrope">{dateStr}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className={`text-sm font-manrope-bold ${isPositive ? 'text-primary' : 'text-white'}`}>
                    {amountStr}
                  </Text>
                  <View className={`px-2 py-0.5 rounded-full mt-1 ${tx.status === 'completed' ? 'bg-primary/10' : tx.status === 'pending' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
                    <Text className={`text-[10px] font-manrope-bold uppercase ${tx.status === 'completed' ? 'text-primary' : tx.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>{tx.status}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
