import { ScreenHeader } from '@/components/ui';
import { AccountsService } from '@/lib/api/accounts';
import { BankAccount, Transaction } from '@/lib/types/api';
import { WadOfMoney, CashOut, CardTransfer, Wallet2, DangerCircle } from '@solar-icons/react-native/BoldDuotone';
import { ClockCircle } from '@solar-icons/react-native/LineDuotone';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TX_TYPE_CONFIG = {
  DEPOSIT: { Icon: WadOfMoney, color: '#5B8C5A', label: 'Dépôt' },
  WITHDRAWAL: { Icon: CashOut, color: '#C9544D', label: 'Retrait' },
  TRANSFER: { Icon: CardTransfer, color: '#8B6F47', label: 'Virement' },
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
      setError(e.message || 'Impossible de charger le compte');
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
        <ActivityIndicator size="large" color="#8B6F47" />
      </SafeAreaView>
    );
  }

  if (error || !account) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <ScreenHeader title="Compte" />
        <View className="flex-1 items-center justify-center px-6">
          <DangerCircle size={48} color="#8C7B6B" />
          <Text className="text-foreground mt-4 font-manrope-bold">{error || 'Compte introuvable'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Détails du Compte" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#8B6F47" />
        }
      >
        {/* Account Card */}
        <View className="mx-6 mt-4 p-6 rounded-2xl bg-surface border border-border">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <View className={`size-12 rounded-xl items-center justify-center ${account.approved ? 'bg-surface-hover' : 'bg-yellow-50'}`}>
                {account.approved ? <Wallet2 size={24} color="#8B6F47" /> : <ClockCircle size={24} color="#D4A534" />}
              </View>
              <View>
                <Text className="text-foreground text-lg font-manrope-bold">
                  {account.first_name} {account.last_name}
                </Text>
                {account.numero ? (
                  <Text className="text-muted text-xs font-manrope">N° {account.numero}</Text>
                ) : null}
              </View>
            </View>
            <View className={`px-3 py-1 rounded-full ${account.approved ? 'bg-surface-hover' : 'bg-yellow-50'}`}>
              <Text className={`text-xs font-manrope-bold uppercase ${account.approved ? 'text-primary' : 'text-[#D4A534]'}`}>
                {account.approved ? 'Actif' : 'En attente'}
              </Text>
            </View>
          </View>

          {account.approved ? (
            <>
              <Text className="text-muted text-[10px] font-manrope-bold uppercase tracking-widest mb-1">Solde</Text>
              <Text className="text-foreground text-3xl font-manrope-extrabold">{account.balance.toLocaleString('fr-FR')} MAD</Text>
            </>
          ) : (
            <View className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <Text className="text-[#D4A534] text-sm font-manrope">
                Ce compte est en attente d'approbation. Vous pourrez effectuer des transactions une fois approuvé.
              </Text>
            </View>
          )}
        </View>

        {/* Actions Rapides */}
        {account.approved ? (
          <View className="px-6 mt-6">
            <Text className="text-foreground text-lg font-manrope-bold tracking-tight mb-4">Actions Rapides</Text>
            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 items-center gap-2 bg-surface rounded-xl p-4 border border-border active:bg-surface-hover"
                onPress={() => router.push({ pathname: '/transfer/deposit' as any, params: { accountId: account.id } })}
              >
                <WadOfMoney size={24} color="#5B8C5A" />
                <Text className="text-foreground text-xs font-manrope-bold">Dépôt</Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center gap-2 bg-surface rounded-xl p-4 border border-border active:bg-surface-hover"
                onPress={() => router.push({ pathname: '/transfer/withdraw' as any, params: { accountId: account.id } })}
              >
                <CashOut size={24} color="#C9544D" />
                <Text className="text-foreground text-xs font-manrope-bold">Retrait</Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center gap-2 bg-surface rounded-xl p-4 border border-border active:bg-surface-hover"
                onPress={() => router.push({ pathname: '/transfer/send-friend' as any, params: { sourceAccountId: account.id } })}
              >
                <CardTransfer size={24} color="#8B6F47" />
                <Text className="text-foreground text-xs font-manrope-bold">Virement</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Informations du Compte */}
        <View className="px-6 mt-6">
          <Text className="text-foreground text-lg font-manrope-bold tracking-tight mb-4">Informations du Compte</Text>
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <InfoRow label="Date de création" value={new Date(account.created_at).toLocaleDateString('fr-FR')} />
            {account.approved_at ? (
              <InfoRow label="Date d'approbation" value={new Date(account.approved_at).toLocaleDateString('fr-FR')} />
            ) : null}
            <InfoRow label="Statut" value={account.approved ? 'Approuvé' : 'En attente d\'approbation'} isLast />
          </View>
        </View>

        {/* Dernières Transactions */}
        <View className="px-6 mt-6">
          <Text className="text-foreground text-lg font-manrope-bold tracking-tight mb-4">
            Dernières Transactions
          </Text>
          {transactions.length === 0 ? (
            <Text className="text-muted text-sm font-manrope text-center py-8">
              Aucune transaction pour le moment
            </Text>
          ) : (
            transactions.map((tx) => {
              const config = TX_TYPE_CONFIG[tx.transaction_type];
              const isDeposit = tx.transaction_type === 'DEPOSIT';
              const dateStr = new Date(tx.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });

              let title = config.label;
              if (tx.transaction_type === 'TRANSFER') {
                if (tx.destination_account) {
                  title = `Virement vers ${tx.destination_account.first_name}`;
                }
                if (tx.source_account && tx.source_account.numero !== account.numero) {
                  title = `Virement de ${tx.source_account.first_name}`;
                }
              }

              const statusLabels: Record<string, string> = {
                COMPLETED: 'Terminé',
                PENDING: 'En attente',
                FAILED: 'Échoué',
              };

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
                    <Text className={`text-sm font-manrope-bold ${isDeposit ? 'text-[#5B8C5A]' : 'text-foreground'}`}>
                      {isDeposit ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} MAD
                    </Text>
                    <View className={`px-2 py-0.5 rounded-full mt-1 ${
                      tx.status === 'COMPLETED' ? 'bg-[#5B8C5A]/10' :
                      tx.status === 'PENDING' ? 'bg-[#D4A534]/10' : 'bg-[#C9544D]/10'
                    }`}>
                      <Text className={`text-[10px] font-manrope-bold uppercase ${
                        tx.status === 'COMPLETED' ? 'text-[#5B8C5A]' :
                        tx.status === 'PENDING' ? 'text-[#D4A534]' : 'text-[#C9544D]'
                      }`}>{statusLabels[tx.status] || tx.status}</Text>
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
    <View className={`flex-row justify-between py-3 ${!isLast ? 'border-b border-border' : ''}`}>
      <Text className="text-muted text-sm font-manrope">{label}</Text>
      <Text className="text-foreground text-sm font-manrope-semibold">{value}</Text>
    </View>
  );
}
