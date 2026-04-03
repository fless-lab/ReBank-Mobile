import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, WadOfMoney, CashOut, CardTransfer, AddCircle, Wallet2 } from '@solar-icons/react-native/BoldDuotone';
import { ClockCircle } from '@solar-icons/react-native/LineDuotone';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { AccountsService } from '@/lib/api/accounts';
import { TransactionsService } from '@/lib/api/transactions';
import { BankAccount, Transaction } from '@/lib/types/api';

const TX_TYPE_CONFIG = {
  DEPOSIT: { Icon: WadOfMoney, color: '#5B8C5A' },
  WITHDRAWAL: { Icon: CashOut, color: '#C9544D' },
  TRANSFER: { Icon: CardTransfer, color: '#8B6F47' },
};

const TX_STATUS_FR: Record<string, string> = {
  COMPLETED: 'Approuvé',
  PENDING: 'En attente',
  FAILED: 'Échoué',
};

const TX_TYPE_FR: Record<string, string> = {
  DEPOSIT: 'Dépôt',
  WITHDRAWAL: 'Retrait',
  TRANSFER: 'Virement',
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
      setError(e.message || 'Impossible de charger les données');
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
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const activeCount = accounts.filter((a) => a.approved).length;

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
          <View>
            <Text className="text-muted text-sm font-manrope">{getGreeting()},</Text>
            <Text className="text-foreground text-xl font-manrope-bold">ReBank</Text>
          </View>
          <View className="size-10 rounded-full bg-surface items-center justify-center border border-border">
            <Bell size={20} color="#8B6F47" />
          </View>
        </View>

        {/* Balance Card */}
        <View className="mx-6 p-6 rounded-2xl bg-surface border border-border mb-8">
          <Text className="text-muted text-xs font-manrope-bold uppercase tracking-widest mb-2">
            Solde Total
          </Text>
          <Text className="text-foreground text-4xl font-manrope-extrabold tracking-tight mb-1">
            {totalBalance.toLocaleString('fr-FR')} MAD
          </Text>
          <Text className="text-muted text-xs font-manrope mt-1">
            {activeCount} compte{activeCount !== 1 ? 's' : ''} actif{activeCount !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Error Banner */}
        {error ? (
          <View className="mx-6 p-4 rounded-xl bg-[#C9544D]/10 border border-[#C9544D]/20 mb-4">
            <Text className="text-[#C9544D] text-sm font-manrope">{error}</Text>
          </View>
        ) : null}

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-foreground text-lg font-manrope-bold tracking-tight mb-4">Actions Rapides</Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { Icon: WadOfMoney, label: 'Dépôt', desc: 'Alimenter', route: '/transfer/deposit' },
              { Icon: CashOut, label: 'Retrait', desc: 'Retirer', route: '/transfer/withdraw' },
              { Icon: CardTransfer, label: 'Virement', desc: 'Envoyer', route: '/transfer/send-friend' },
              { Icon: AddCircle, label: 'Nouveau', desc: 'Créer', route: '/account/create' },
            ].map((action) => (
              <Pressable
                key={action.label}
                className="w-[48%] bg-surface border border-border rounded-2xl p-4 items-center gap-2 active:bg-surface-hover"
                onPress={() => router.push(action.route as any)}
              >
                <View className="size-14 rounded-xl bg-surface-hover items-center justify-center">
                  <action.Icon size={26} color="#8B6F47" />
                </View>
                <Text className="text-sm font-manrope-bold text-foreground">{action.label}</Text>
                <Text className="text-xs font-manrope text-muted">{action.desc}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Accounts Overview */}
        {accounts.length > 0 ? (
          <View className="px-6 mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-foreground text-lg font-manrope-bold tracking-tight">Mes Comptes</Text>
              <Pressable onPress={() => router.push('/(main)/accounts' as any)}>
                <Text className="text-primary text-xs font-manrope-bold">Voir Tout</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
              {accounts.map((acc) => (
                <Pressable
                  key={acc.id}
                  className="bg-surface rounded-xl p-4 border border-border active:bg-surface-hover"
                  style={{ width: 200 }}
                  onPress={() => router.push({ pathname: '/account/[id]' as any, params: { id: acc.id } })}
                >
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className={`size-6 rounded items-center justify-center ${acc.approved ? 'bg-[#5B8C5A]/20' : 'bg-[#D4A534]/20'}`}>
                      {acc.approved ? <Wallet2 size={14} color="#5B8C5A" /> : <ClockCircle size={14} color="#D4A534" />}
                    </View>
                    <Text className="text-foreground text-xs font-manrope-bold" numberOfLines={1}>
                      {acc.first_name} {acc.last_name}
                    </Text>
                  </View>
                  {acc.approved ? (
                    <Text className="text-foreground text-lg font-manrope-bold">
                      {acc.balance.toLocaleString('fr-FR')} MAD
                    </Text>
                  ) : (
                    <Text className="text-[#D4A534] text-xs font-manrope">En attente</Text>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Recent Transactions */}
        <View className="px-6">
          <Text className="text-foreground text-lg font-manrope-bold tracking-tight mb-4">Transactions Récentes</Text>
          {transactions.length === 0 ? (
            <Text className="text-muted text-sm font-manrope text-center py-8">
              Aucune transaction pour le moment
            </Text>
          ) : (() => {
            const myNums = new Set(accounts.map(a => a.numero).filter(Boolean));
            return transactions.map((tx) => {
              const config = TX_TYPE_CONFIG[tx.transaction_type];
              const isIncoming = tx.transaction_type === 'DEPOSIT' || (tx.transaction_type === 'TRANSFER' && !!tx.source_account && !myNums.has(tx.source_account.numero));
              const dateStr = new Date(tx.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });

              let title = TX_TYPE_FR[tx.transaction_type] || tx.transaction_type;
              if (tx.transaction_type === 'TRANSFER' && tx.destination_account) {
                title = `Virement à ${tx.destination_account.first_name}`;
              }
              if (tx.transaction_type === 'TRANSFER' && tx.source_account) {
                title = `De ${tx.source_account.first_name}`;
              }
              if (tx.description) title = tx.description;

              return (
                <View
                  key={tx.id}
                  className="flex-row items-center justify-between p-4 bg-surface rounded-xl mb-2 border border-border"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="size-10 rounded-full bg-surface-hover items-center justify-center">
                      <config.Icon size={20} color={config.color} />
                    </View>
                    <View>
                      <Text className="text-sm font-manrope-bold text-foreground">{title}</Text>
                      <Text className="text-xs text-muted font-manrope">{dateStr}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className={`text-sm font-manrope-bold ${isIncoming ? 'text-[#5B8C5A]' : 'text-foreground'}`}>
                      {isIncoming ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} MAD
                    </Text>
                    <View className={`px-2 py-0.5 rounded-full mt-1 ${
                      tx.status === 'COMPLETED' ? 'bg-[#5B8C5A]/10' :
                      tx.status === 'PENDING' ? 'bg-[#D4A534]/10' : 'bg-[#C9544D]/10'
                    }`}>
                      <Text className={`text-[10px] font-manrope-bold uppercase ${
                        tx.status === 'COMPLETED' ? 'text-[#5B8C5A]' :
                        tx.status === 'PENDING' ? 'text-[#D4A534]' : 'text-[#C9544D]'
                      }`}>{TX_STATUS_FR[tx.status] || tx.status}</Text>
                    </View>
                  </View>
                </View>
              );
            });
          })()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
