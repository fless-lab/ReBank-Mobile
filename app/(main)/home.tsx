import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { AccountsService } from '@/lib/api/accounts';
import { TransactionsService } from '@/lib/api/transactions';
import { BankAccount, Transaction } from '@/lib/types/api';

const TX_TYPE_CONFIG = {
  DEPOSIT: { icon: 'cash-plus' as const, color: '#2edc6b' },
  WITHDRAWAL: { icon: 'cash-minus' as const, color: '#ef4444' },
  TRANSFER: { icon: 'bank-transfer' as const, color: '#818cf8' },
};

export default function HomeScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = async (isRefresh = false) => {
    try {
      setError('');
      const [accs, txs] = await Promise.all([
        AccountsService.list(),
        TransactionsService.list(),
      ]);
      setAccounts(accs);
      setTransactions(txs.slice(0, 8));
    } catch (e: any) {
      setError(e.message || 'Failed to load data');
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  const totalBalance = accounts
    .filter((a) => a.approved)
    .reduce((sum, a) => sum + a.balance, 0);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2edc6b" />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <View>
            <Text className="text-slate-400 text-sm font-manrope">{getGreeting()},</Text>
            <Text className="text-white text-xl font-manrope-bold">ReBank</Text>
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
            {totalBalance.toLocaleString('en-US')} MAD
          </Text>
          <Text className="text-slate-400 text-xs font-manrope mt-1">
            {accounts.filter((a) => a.approved).length} active account{accounts.filter((a) => a.approved).length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Error Banner */}
        {error ? (
          <View className="mx-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
            <Text className="text-red-400 text-sm font-manrope">{error}</Text>
          </View>
        ) : null}

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Quick Actions</Text>
          <View className="flex-row gap-4">
            {[
              { icon: 'cash-plus' as const, label: 'Deposit', route: '/transfer/deposit' },
              { icon: 'cash-minus' as const, label: 'Withdraw', route: '/transfer/withdraw' },
              { icon: 'bank-transfer' as const, label: 'Transfer', route: '/transfer/send-friend' },
              { icon: 'bank-plus' as const, label: 'New Acc.', route: '/account/create' },
            ].map((action) => (
              <Pressable
                key={action.label}
                className="flex-1 items-center gap-2"
                onPress={() => router.push(action.route as any)}
              >
                <View className="size-12 rounded-xl bg-primary/10 items-center justify-center">
                  <MaterialCommunityIcons name={action.icon} size={22} color="#2edc6b" />
                </View>
                <Text className="text-xs font-manrope-semibold text-slate-400">{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Accounts Overview */}
        {accounts.length > 0 ? (
          <View className="px-6 mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-manrope-bold tracking-tight">My Accounts</Text>
              <Pressable onPress={() => router.push('/(main)/accounts' as any)}>
                <Text className="text-primary text-xs font-manrope-bold">See All</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
              {accounts.map((acc) => (
                <Pressable
                  key={acc.id}
                  className="bg-primary/5 rounded-xl p-4 border border-primary/10 active:bg-primary/10"
                  style={{ width: 200 }}
                  onPress={() => router.push({ pathname: '/account/[id]' as any, params: { id: acc.id } })}
                >
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className={`size-6 rounded items-center justify-center ${acc.approved ? 'bg-primary/20' : 'bg-yellow-500/20'}`}>
                      <MaterialCommunityIcons
                        name={acc.approved ? 'bank' : 'clock-outline'}
                        size={14}
                        color={acc.approved ? '#2edc6b' : '#eab308'}
                      />
                    </View>
                    <Text className="text-white text-xs font-manrope-bold" numberOfLines={1}>
                      {acc.first_name} {acc.last_name}
                    </Text>
                  </View>
                  {acc.approved ? (
                    <Text className="text-white text-lg font-manrope-bold">
                      {acc.balance.toLocaleString()} MAD
                    </Text>
                  ) : (
                    <Text className="text-yellow-400 text-xs font-manrope">Pending</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Recent Transactions */}
        <View className="px-6">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Recent Transactions</Text>
          {transactions.length === 0 ? (
            <Text className="text-slate-500 text-sm font-manrope text-center py-8">
              No transactions yet
            </Text>
          ) : (
            transactions.map((tx) => {
              const config = TX_TYPE_CONFIG[tx.transaction_type];
              const isDeposit = tx.transaction_type === 'DEPOSIT';
              const dateStr = new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

              let title = tx.transaction_type.charAt(0) + tx.transaction_type.slice(1).toLowerCase();
              if (tx.transaction_type === 'TRANSFER' && tx.destination_account) {
                title = `Transfer to ${tx.destination_account.first_name}`;
              }
              if (tx.transaction_type === 'TRANSFER' && tx.source_account) {
                title = `From ${tx.source_account.first_name}`;
              }
              if (tx.description) title = tx.description;

              return (
                <View
                  key={tx.id}
                  className="flex-row items-center justify-between p-4 bg-primary/10 rounded-xl mb-2"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="size-10 rounded-full bg-slate-800 items-center justify-center">
                      <MaterialCommunityIcons name={config.icon} size={20} color={config.color} />
                    </View>
                    <View>
                      <Text className="text-sm font-manrope-bold text-white">{title}</Text>
                      <Text className="text-xs text-slate-500 font-manrope">{dateStr}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className={`text-sm font-manrope-bold ${isDeposit ? 'text-primary' : 'text-white'}`}>
                      {isDeposit ? '+' : '-'}{tx.amount.toLocaleString('en-US')} MAD
                    </Text>
                    <View className={`px-2 py-0.5 rounded-full mt-1 ${
                      tx.status === 'COMPLETED' ? 'bg-primary/10' :
                      tx.status === 'PENDING' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                    }`}>
                      <Text className={`text-[10px] font-manrope-bold uppercase ${
                        tx.status === 'COMPLETED' ? 'text-primary' :
                        tx.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400'
                      }`}>{tx.status}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
