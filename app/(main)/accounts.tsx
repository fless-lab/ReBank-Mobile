import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddCircle, Wallet2, WadOfMoney } from '@solar-icons/react-native/BoldDuotone';
import { ClockCircle } from '@solar-icons/react-native/LineDuotone';
import { AltArrowRight } from '@solar-icons/react-native/Linear';
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
      setError(e.message || 'Impossible de charger les comptes');
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

  const activeCount = accounts.filter(a => a.approved).length;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#8B6F47" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B6F47" />
        }
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-foreground text-xl font-manrope-bold tracking-tight">Mes Comptes</Text>
          <Pressable
            className="size-10 rounded-full bg-surface items-center justify-center border border-border active:bg-surface-hover"
            onPress={() => router.push('/account/create' as any)}
          >
            <AddCircle size={22} color="#8B6F47" />
          </Pressable>
        </View>

        {/* Total Balance */}
        <View className="mx-6 p-6 rounded-2xl bg-surface border border-border mb-6">
          <Text className="text-muted text-xs font-manrope-bold uppercase tracking-widest mb-2">
            Solde Total
          </Text>
          <Text className="text-foreground text-3xl font-manrope-extrabold tracking-tight">
            {totalBalance.toLocaleString('fr-FR')} MAD
          </Text>
          <Text className="text-muted text-xs font-manrope mt-1">
            {activeCount} compte{activeCount !== 1 ? 's' : ''} actif{activeCount !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <View className="mx-6 p-4 rounded-xl bg-[#C9544D]/10 border border-[#C9544D]/20 mb-4">
            <Text className="text-[#C9544D] text-sm font-manrope">{error}</Text>
          </View>
        ) : null}

        {/* Accounts List */}
        <View className="px-6 gap-3">
          {accounts.length === 0 ? (
            <View className="items-center py-16">
              <View className="size-20 rounded-full bg-surface border border-border items-center justify-center mb-4">
                <WadOfMoney size={36} color="#8C7B6B" />
              </View>
              <Text className="text-foreground text-lg font-manrope-bold mb-2">Aucun compte</Text>
              <Text className="text-muted text-sm font-manrope text-center mb-6">
                Créez votre premier compte bancaire pour commencer
              </Text>
              <Pressable
                className="bg-primary px-6 py-3 rounded-xl active:bg-primary/80"
                onPress={() => router.push('/account/create' as any)}
              >
                <Text className="text-white font-manrope-bold text-sm">Créer un Compte</Text>
              </Pressable>
            </View>
          ) : (
            accounts.map((account) => (
              <Pressable
                key={account.id}
                className="bg-surface rounded-2xl border border-border p-5 active:bg-surface-hover"
                onPress={() => router.push({ pathname: '/account/[id]' as any, params: { id: account.id } })}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-row items-center gap-3">
                    <View className={`size-10 rounded-xl items-center justify-center ${account.approved ? 'bg-[#5B8C5A]/20' : 'bg-[#D4A534]/20'}`}>
                      {account.approved ? <Wallet2 size={20} color="#5B8C5A" /> : <ClockCircle size={20} color="#D4A534" />}
                    </View>
                    <View>
                      <Text className="text-foreground text-sm font-manrope-bold">
                        {account.first_name} {account.last_name}
                      </Text>
                      {account.numero ? (
                        <Text className="text-muted text-xs font-manrope">
                          N° {account.numero}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {/* Status Badge */}
                  <View className={`px-2.5 py-1 rounded-full ${account.approved ? 'bg-[#5B8C5A]/10' : 'bg-[#D4A534]/10'}`}>
                    <Text className={`text-[10px] font-manrope-bold uppercase ${account.approved ? 'text-[#5B8C5A]' : 'text-[#D4A534]'}`}>
                      {account.approved ? 'Actif' : 'En attente'}
                    </Text>
                  </View>
                </View>

                {account.approved ? (
                  <View className="flex-row items-end justify-between">
                    <View>
                      <Text className="text-muted text-[10px] font-manrope-bold uppercase tracking-widest">Solde</Text>
                      <Text className="text-foreground text-xl font-manrope-bold">
                        {account.balance.toLocaleString('fr-FR')} MAD
                      </Text>
                    </View>
                    <AltArrowRight size={20} color="#8C7B6B" />
                  </View>
                ) : (
                  <Text className="text-muted text-xs font-manrope">
                    En attente d'approbation
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
