import { ScreenHeader } from '@/components/ui';
import { AccountsService } from '@/lib/api/accounts';
import { BankAccount, Transaction } from '@/lib/types/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TX_TYPE_CONFIG = {
  DEPOSIT: { icon: 'cash-plus' as const, color: '#2edc6b', label: 'Deposit' },
  WITHDRAWAL: { icon: 'cash-minus' as const, color: '#ef4444', label: 'Withdrawal' },
  TRANSFER: { icon: 'bank-transfer' as const, color: '#818cf8', label: 'Transfer' },
};

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError('');
      const data = await AccountsService.detail(Number(id));
      setAccount(data.account);
      setTransactions(data.transaction);
    } catch (e: any) {
      setError(e.message || 'Failed to load account');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData(true);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#2edc6b" />
      </SafeAreaView>
    );
  }

  if (error || !account) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <ScreenHeader title="Account" />
        <View className="flex-1 items-center justify-center px-6">
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#94a3b8" />
          <Text className="text-white mt-4 font-manrope-bold">{error || 'Account not found'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Account Details" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2edc6b" />
        }
      >
        {/* Account Card */}
        <View className="mx-6 mt-4 p-6 rounded-2xl bg-primary/10 border border-primary/20">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className={`size-12 rounded-xl items-center justify-center ${account.approved ? 'bg-primary/20' : 'bg-yellow-500/20'}`}>
                <MaterialCommunityIcons
                  name={account.approved ? 'bank' : 'clock-outline'}
                  size={24}
                  color={account.approved ? '#2edc6b' : '#eab308'}
                />
              </View>
              <View>
                <Text className="text-white text-lg font-manrope-bold">
                  {account.first_name} {account.last_name}
                </Text>
                {account.numero ? (
                  <Text className="text-slate-400 text-xs font-manrope">N° {account.numero}</Text>
                ) : null}
              </View>
            </View>
            <View className={`px-3 py-1 rounded-full ${account.approved ? 'bg-primary/10' : 'bg-yellow-500/10'}`}>
              <Text className={`text-xs font-manrope-bold uppercase ${account.approved ? 'text-primary' : 'text-yellow-400'}`}>
                {account.approved ? 'Active' : 'Pending'}
              </Text>
            </View>
          </View>

          {account.approved ? (
            <>
              <Text className="text-primary/60 text-[10px] font-manrope-bold uppercase tracking-widest mb-1">Balance</Text>
              <Text className="text-white text-3xl font-manrope-extrabold">{account.balance.toLocaleString('en-US')} MAD</Text>
            </>
          ) : (
            <View className="bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/10">
              <Text className="text-yellow-400 text-sm font-manrope">
                This account is pending approval. You'll be able to make transactions once approved.
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        {account.approved ? (
          <View className="px-6 mt-6">
            <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Quick Actions</Text>
            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 items-center gap-2 bg-primary/5 rounded-xl p-4 border border-primary/10 active:bg-primary/10"
                onPress={() => router.push({ pathname: '/transfer/deposit' as any, params: { accountId: account.id } })}
              >
                <MaterialCommunityIcons name="cash-plus" size={24} color="#2edc6b" />
                <Text className="text-white text-xs font-manrope-bold">Deposit</Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center gap-2 bg-primary/5 rounded-xl p-4 border border-primary/10 active:bg-primary/10"
                onPress={() => router.push({ pathname: '/transfer/withdraw' as any, params: { accountId: account.id } })}
              >
                <MaterialCommunityIcons name="cash-minus" size={24} color="#ef4444" />
                <Text className="text-white text-xs font-manrope-bold">Withdraw</Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center gap-2 bg-primary/5 rounded-xl p-4 border border-primary/10 active:bg-primary/10"
                onPress={() => router.push({ pathname: '/transfer/send-friend' as any, params: { sourceAccountId: account.id } })}
              >
                <MaterialCommunityIcons name="bank-transfer" size={24} color="#818cf8" />
                <Text className="text-white text-xs font-manrope-bold">Transfer</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Account Info */}
        <View className="px-6 mt-6">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Account Info</Text>
          <View className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <InfoRow label="Created" value={new Date(account.created_at).toLocaleDateString()} />
            {account.approved_at ? (
              <InfoRow label="Approved" value={new Date(account.approved_at).toLocaleDateString()} />
            ) : null}
            <InfoRow label="Status" value={account.approved ? 'Approved' : 'Pending Approval'} isLast />
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mt-6">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">
            Recent Transactions
          </Text>
          {transactions.length === 0 ? (
            <Text className="text-slate-500 text-sm font-manrope text-center py-8">
              No transactions yet
            </Text>
          ) : (
            transactions.map((tx) => {
              const config = TX_TYPE_CONFIG[tx.transaction_type];
              const isDeposit = tx.transaction_type === 'DEPOSIT';
              const dateStr = new Date(tx.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

              let title = config.label;
              if (tx.transaction_type === 'TRANSFER') {
                if (tx.destination_account) {
                  title = `Transfer to ${tx.destination_account.first_name}`;
                }
                if (tx.source_account && tx.source_account.numero !== account.numero) {
                  title = `Transfer from ${tx.source_account.first_name}`;
                }
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

function InfoRow({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View className={`flex-row justify-between py-3 ${!isLast ? 'border-b border-primary/10' : ''}`}>
      <Text className="text-slate-500 text-sm font-manrope">{label}</Text>
      <Text className="text-white text-sm font-manrope-semibold">{value}</Text>
    </View>
  );
}
