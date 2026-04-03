import { ScreenHeader } from '@/components/ui';
import { AccountsService } from '@/lib/api/accounts';
import { TransactionsService } from '@/lib/api/transactions';
import { BankAccount, Transaction } from '@/lib/types/api';
import { WadOfMoney, CashOut, CardTransfer, DangerCircle } from '@solar-icons/react-native/BoldDuotone';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TX_TYPE_CONFIG = {
  DEPOSIT: { Icon: WadOfMoney, color: '#5B8C5A', label: 'Dépôt' },
  WITHDRAWAL: { Icon: CashOut, color: '#C9544D', label: 'Retrait' },
  TRANSFER: { Icon: CardTransfer, color: '#8B6F47', label: 'Virement' },
};

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  COMPLETED: { bg: 'bg-[#5B8C5A]/10', text: 'text-[#5B8C5A]', label: 'Terminé' },
  PENDING: { bg: 'bg-[#D4A534]/10', text: 'text-[#D4A534]', label: 'En attente' },
  FAILED: { bg: 'bg-[#C9544D]/10', text: 'text-[#C9544D]', label: 'Échoué' },
};

const TX_TYPE_LABELS: Record<string, string> = {
  DEPOSIT: 'Dépôt',
  WITHDRAWAL: 'Retrait',
  TRANSFER: 'Virement',
};

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tx, setTx] = useState<Transaction | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      TransactionsService.detail(Number(id)),
      AccountsService.list(),
    ]).then(([transaction, accs]) => {
      setTx(transaction);
      setAccounts(accs);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark justify-center items-center">
        <ActivityIndicator size="large" color="#8B6F47" />
      </SafeAreaView>
    );
  }

  if (!tx) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <ScreenHeader title="Détails" />
        <View className="flex-1 items-center justify-center px-6">
          <DangerCircle size={48} color="#8C7B6B" />
          <Text className="text-foreground mt-4 font-manrope-bold">Transaction introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const config = TX_TYPE_CONFIG[tx.transaction_type];
  const myNums = new Set(accounts.map(a => a.numero).filter(Boolean));
  const isIncoming = tx.transaction_type === 'DEPOSIT' || (tx.transaction_type === 'TRANSFER' && !!tx.source_account && !myNums.has(tx.source_account.numero));
  const statusStyle = STATUS_STYLES[tx.status] || STATUS_STYLES.COMPLETED;

  let title = config.label;
  if (tx.transaction_type === 'TRANSFER' && tx.destination_account) {
    title = `Virement vers ${tx.destination_account.first_name} ${tx.destination_account.last_name}`;
  }
  if (tx.transaction_type === 'TRANSFER' && tx.source_account) {
    title = `Virement de ${tx.source_account.first_name} ${tx.source_account.last_name}`;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Détails de la Transaction" />
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Hero */}
        <View className="items-center mb-8">
          <View className="size-20 rounded-full bg-surface-hover items-center justify-center mb-4">
            <config.Icon size={40} color={config.color} />
          </View>
          <Text className="text-foreground text-2xl font-manrope-bold tracking-tight mb-1">{title}</Text>

          {/* Type Badge */}
          <View className="px-3 py-1 rounded-full mt-1 mb-3 bg-surface-hover">
            <Text className="text-xs font-manrope-bold uppercase text-primary">{TX_TYPE_LABELS[tx.transaction_type] || tx.transaction_type}</Text>
          </View>

          <Text className={`text-4xl font-manrope-bold ${isIncoming ? 'text-[#5B8C5A]' : 'text-foreground'}`}>
            {isIncoming ? '+' : '-'}{tx.amount.toLocaleString('fr-FR')} MAD
          </Text>
        </View>

        {/* Carte de Détails */}
        <View className="bg-surface rounded-2xl p-4 border border-border mb-6">
          <DetailRow label="Date" value={new Date(tx.created_at).toLocaleString('fr-FR')} />
          <DetailRow
            label="Statut"
            value={statusStyle.label}
            valueClassName={statusStyle.text}
          />
          <DetailRow label="Référence" value={tx.reference} />
          <DetailRow label="Solde Après" value={`${tx.balance_after.toLocaleString('fr-FR')} MAD`} />
          {tx.source_account ? (
            <DetailRow label="Compte Source" value={`${tx.source_account.first_name} ${tx.source_account.last_name} (${tx.source_account.numero})`} />
          ) : null}
          {tx.destination_account ? (
            <DetailRow label="Compte Destination" value={`${tx.destination_account.first_name} ${tx.destination_account.last_name} (${tx.destination_account.numero})`} />
          ) : null}
          {tx.description ? (
            <DetailRow label="Description" value={tx.description} isLast />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, valueClassName, isLast }: {
  label: string; value: string; valueClassName?: string; isLast?: boolean;
}) {
  return (
    <View className={`flex-row justify-between py-3 ${!isLast ? 'border-b border-border' : ''}`}>
      <Text className="text-muted text-sm font-manrope">{label}</Text>
      <Text className={`text-sm font-manrope-semibold ${valueClassName || 'text-foreground'} max-w-[60%] text-right`}>{value}</Text>
    </View>
  );
}
