import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { AccountsService } from '@/lib/api/accounts';
import { BankAccount } from '@/lib/types/api';

export default function AccountsScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadAccounts = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError('');
      const data = await AccountsService.list();
      setAccounts(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAccounts(true);
  };

  const totalBalance = accounts
    .filter(a => a.approved)
    .reduce((sum, a) => sum + a.balance, 0);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#2edc6b" />
      </SafeAreaView>
    );
  }

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
          <Text className="text-white text-xl font-manrope-bold tracking-tight">My Accounts</Text>
          <Pressable
            className="size-10 rounded-full bg-primary/20 items-center justify-center active:bg-primary/30"
            onPress={() => router.push('/account/create' as any)}
          >
            <MaterialCommunityIcons name="plus" size={22} color="#2edc6b" />
          </Pressable>
        </View>

        {/* Total Balance */}
        <View className="mx-6 p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
          <Text className="text-primary/60 text-xs font-manrope-bold uppercase tracking-widest mb-2">
            Total Balance
          </Text>
          <Text className="text-white text-3xl font-manrope-extrabold tracking-tight">
            {totalBalance.toLocaleString('en-US')} MAD
          </Text>
          <Text className="text-slate-400 text-xs font-manrope mt-1">
            {accounts.filter(a => a.approved).length} active account{accounts.filter(a => a.approved).length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <View className="mx-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
            <Text className="text-red-400 text-sm font-manrope">{error}</Text>
          </View>
        ) : null}

        {/* Accounts List */}
        <View className="px-6 gap-3">
          {accounts.length === 0 ? (
            <View className="items-center py-16">
              <View className="size-20 rounded-full bg-primary/10 items-center justify-center mb-4">
                <MaterialCommunityIcons name="bank-plus" size={36} color="rgba(46, 220, 107, 0.4)" />
              </View>
              <Text className="text-white text-lg font-manrope-bold mb-2">No accounts yet</Text>
              <Text className="text-slate-400 text-sm font-manrope text-center mb-6">
                Create your first bank account to get started
              </Text>
              <Pressable
                className="bg-primary px-6 py-3 rounded-xl active:bg-primary/80"
                onPress={() => router.push('/account/create' as any)}
              >
                <Text className="text-background-dark font-manrope-bold text-sm">Create Account</Text>
              </Pressable>
            </View>
          ) : (
            accounts.map((account) => (
              <Pressable
                key={account.id}
                className="bg-primary/5 rounded-2xl border border-primary/10 p-5 active:bg-primary/10"
                onPress={() => router.push({ pathname: '/account/[id]' as any, params: { id: account.id } })}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-row items-center gap-3">
                    <View className={`size-10 rounded-xl items-center justify-center ${account.approved ? 'bg-primary/20' : 'bg-yellow-500/20'}`}>
                      <MaterialCommunityIcons
                        name={account.approved ? 'bank' : 'clock-outline'}
                        size={20}
                        color={account.approved ? '#2edc6b' : '#eab308'}
                      />
                    </View>
                    <View>
                      <Text className="text-white text-sm font-manrope-bold">
                        {account.first_name} {account.last_name}
                      </Text>
                      {account.numero ? (
                        <Text className="text-slate-500 text-xs font-manrope">
                          N° {account.numero}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {/* Status Badge */}
                  <View className={`px-2.5 py-1 rounded-full ${account.approved ? 'bg-primary/10' : 'bg-yellow-500/10'}`}>
                    <Text className={`text-[10px] font-manrope-bold uppercase ${account.approved ? 'text-primary' : 'text-yellow-400'}`}>
                      {account.approved ? 'Active' : 'Pending'}
                    </Text>
                  </View>
                </View>

                {account.approved ? (
                  <View className="flex-row items-end justify-between">
                    <View>
                      <Text className="text-slate-500 text-[10px] font-manrope-bold uppercase tracking-widest">Balance</Text>
                      <Text className="text-white text-xl font-manrope-bold">
                        {account.balance.toLocaleString('en-US')} MAD
                      </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={20} color="#94a3b8" />
                  </View>
                ) : (
                  <Text className="text-slate-400 text-xs font-manrope">
                    Awaiting staff approval
                  </Text>
                )}
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
