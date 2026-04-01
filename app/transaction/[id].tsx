import { ScreenHeader } from '@/components/ui';
import { TransactionsService } from '@/lib/api/transactions';
import { Transaction } from '@/lib/types/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TX_TYPE_CONFIG = {
  DEPOSIT: { icon: 'cash-plus' as const, color: '#2edc6b', label: 'Deposit' },
  WITHDRAWAL: { icon: 'cash-minus' as const, color: '#ef4444', label: 'Withdrawal' },
  TRANSFER: { icon: 'bank-transfer' as const, color: '#818cf8', label: 'Transfer' },
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  COMPLETED: { bg: 'bg-primary/10', text: 'text-primary' },
  PENDING: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  FAILED: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tx, setTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TransactionsService.list().then((txs) => {
      const found = txs.find((t) => String(t.id) === id);
      setTx(found || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark justify-center items-center">
        <ActivityIndicator size="large" color="#2edc6b" />
      </SafeAreaView>
    );
  }

  if (!tx) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <ScreenHeader title="Details" />
        <View className="flex-1 items-center justify-center px-6">
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#94a3b8" />
          <Text className="text-white mt-4 font-manrope-bold">Transaction not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const config = TX_TYPE_CONFIG[tx.transaction_type];
  const isDeposit = tx.transaction_type === 'DEPOSIT';
  const statusStyle = STATUS_STYLES[tx.status] || STATUS_STYLES.COMPLETED;

  let title = config.label;
  if (tx.transaction_type === 'TRANSFER' && tx.destination_account) {
    title = `Transfer to ${tx.destination_account.first_name} ${tx.destination_account.last_name}`;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Transaction Details" />
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Hero */}
        <View className="items-center mb-8">
          <View className="size-20 rounded-full bg-slate-800 items-center justify-center mb-4">
            <MaterialCommunityIcons name={config.icon} size={40} color={config.color} />
          </View>
          <Text className="text-white text-2xl font-manrope-bold tracking-tight mb-1">{title}</Text>

          {/* Type Badge */}
          <View className="px-3 py-1 rounded-full mt-1 mb-3 bg-primary/10">
            <Text className="text-xs font-manrope-bold uppercase text-primary">{tx.transaction_type}</Text>
          </View>

          <Text className={`text-4xl font-manrope-bold ${isDeposit ? 'text-primary' : 'text-white'}`}>
            {isDeposit ? '+' : '-'}{tx.amount.toLocaleString('en-US')} MAD
          </Text>
        </View>

        {/* Details Card */}
        <View className="bg-primary/5 rounded-2xl p-4 border border-primary/10 mb-6">
          <DetailRow label="Date" value={new Date(tx.created_at).toLocaleString()} />
          <DetailRow
            label="Status"
            value={tx.status.charAt(0) + tx.status.slice(1).toLowerCase()}
            valueClassName={statusStyle.text}
          />
          <DetailRow label="Reference" value={tx.reference} />
          <DetailRow label="Balance After" value={`${tx.balance_after.toLocaleString()} MAD`} />
          {tx.source_account ? (
            <DetailRow label="From" value={`${tx.source_account.first_name} ${tx.source_account.last_name} (${tx.source_account.numero})`} />
          ) : null}
          {tx.destination_account ? (
            <DetailRow label="To" value={`${tx.destination_account.first_name} ${tx.destination_account.last_name} (${tx.destination_account.numero})`} />
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
    <View className={`flex-row justify-between py-3 ${!isLast ? 'border-b border-primary/10' : ''}`}>
      <Text className="text-slate-500 text-sm font-manrope">{label}</Text>
      <Text className={`text-sm font-manrope-semibold ${valueClassName || 'text-white'} max-w-[60%] text-right`}>{value}</Text>
    </View>
  );
}
