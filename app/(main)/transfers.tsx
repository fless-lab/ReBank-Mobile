import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WadOfMoney, CashOut, CardTransfer, History, TransferHorizontal } from '@solar-icons/react-native/BoldDuotone';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { TransferOptionCard } from '@/components/ui';
import { TransactionsService } from '@/lib/api/transactions';
import { Transaction } from '@/lib/types/api';

const TX_TYPE_CONFIG = {
  DEPOSIT: { Icon: WadOfMoney, color: '#5B8C5A', label: 'Dépôt' },
  WITHDRAWAL: { Icon: CashOut, color: '#C9544D', label: 'Retrait' },
  TRANSFER: { Icon: CardTransfer, color: '#8B6F47', label: 'Virement' },
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
        <View className="px-6 pt-4 pb-2">
          <Text className="text-foreground text-2xl font-manrope-bold tracking-tight">Transferts</Text>
          <Text className="text-muted text-sm font-manrope mt-1">Gérez vos opérations bancaires</Text>
        </View>

        {/* Transfer Options - Full Width Cards */}
        <View className="px-6 pt-4 gap-3">
          <TransferOptionCard
            icon={<WadOfMoney size={28} color="#8B6F47" />}
            title="Dépôt"
            subtitle="Alimenter votre compte"
            onPress={() => router.push('/transfer/deposit' as any)}
          />
          <TransferOptionCard
            icon={<CashOut size={28} color="#8B6F47" />}
            title="Retrait"
            subtitle="Retirer des fonds de votre compte"
            onPress={() => router.push('/transfer/withdraw' as any)}
          />
          <TransferOptionCard
            icon={<CardTransfer size={28} color="#8B6F47" />}
            title="Virement Externe"
            subtitle="Envoyer vers un autre compte"
            onPress={() => router.push('/transfer/send-friend' as any)}
          />
          <TransferOptionCard
            icon={<TransferHorizontal size={28} color="#8B6F47" />}
            title="Virement Interne"
            subtitle="Transférer entre vos comptes"
            onPress={() => router.push('/transfer/between-accounts' as any)}
          />
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mt-8">
          <Text className="text-foreground text-lg font-manrope-bold tracking-tight mb-4">Activité Récente</Text>
          {recentTx.length === 0 ? (
            <View className="items-center py-8">
              <History size={40} color="#B5A99D" />
              <Text className="text-muted text-sm font-manrope mt-3">Aucune transaction récente</Text>
            </View>
          ) : (
            recentTx.map((tx) => {
              const config = TX_TYPE_CONFIG[tx.transaction_type];
              const isDeposit = tx.transaction_type === 'DEPOSIT';
              const dateStr = new Date(tx.created_at).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });

              let title = config.label;
              if (tx.transaction_type === 'TRANSFER' && tx.destination_account) {
                title = `Vers ${tx.destination_account.first_name} ${tx.destination_account.last_name}`;
              }

              return (
                <View
                  key={tx.id}
                  className="flex-row items-center justify-between p-4 bg-surface rounded-2xl mb-3 border border-border"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="size-11 rounded-full bg-surface-hover items-center justify-center">
                      <config.Icon size={22} color={config.color} />
                    </View>
                    <View>
                      <Text className="text-sm font-manrope-bold text-foreground">{title}</Text>
                      <Text className="text-xs text-muted font-manrope mt-0.5">{dateStr}</Text>
                    </View>
                  </View>
                  <Text className={`text-base font-manrope-bold ${isDeposit ? 'text-[#5B8C5A]' : 'text-foreground'}`}>
                    {isDeposit ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} MAD
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
