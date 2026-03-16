import { ScreenHeader } from '@/components/ui';
import { TransactionsService } from '@/lib/api/transactions';
import { Transaction } from '@/lib/mockDb';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  shopping: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  food: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  salary: { bg: 'bg-green-500/10', text: 'text-green-400' },
  transfer: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  bill: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  international: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  entertainment: { bg: 'bg-red-500/10', text: 'text-red-400' },
  transport: { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  completed: { bg: 'bg-primary/10', text: 'text-primary' },
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tx, setTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    TransactionsService.getTransactionDetails(id).then((data) => {
      setTx(data);
      setLoading(false);
    });
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

  const isPositive = tx.amount > 0;
  const catStyle = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.shopping;
  const statusStyle = STATUS_STYLES[tx.status] || STATUS_STYLES.completed;

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Transaction Details" />
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Hero */}
        <View className="items-center mb-8">
          <View className="size-20 rounded-full bg-slate-800 items-center justify-center mb-4">
            <MaterialCommunityIcons name={(tx.icon || 'cash') as any} size={40} color="#94a3b8" />
          </View>
          <Text className="text-white text-2xl font-manrope-bold tracking-tight mb-1">{tx.title}</Text>

          {/* Category Badge */}
          <View className={`px-3 py-1 rounded-full mt-1 mb-3 ${catStyle.bg}`}>
            <Text className={`text-xs font-manrope-bold uppercase ${catStyle.text}`}>{tx.category}</Text>
          </View>

          <Text className={`text-4xl font-manrope-bold ${isPositive ? 'text-primary' : 'text-white'}`}>
            {isPositive ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Details Card */}
        <View className="bg-primary/5 rounded-2xl p-4 border border-primary/10 mb-6">
          <DetailRow label="Date" value={new Date(tx.date).toLocaleString()} />
          <DetailRow
            label="Status"
            value={tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
            valueClassName={statusStyle.text}
            hasBorder
          />
          {tx.recipient && <DetailRow label="Recipient" value={tx.recipient} />}
          {tx.sender && <DetailRow label="From" value={tx.sender} />}
          <DetailRow label="Reference" value={tx.id.toUpperCase()} isLast />
        </View>

        {/* Actions */}
        <View className="gap-2 mb-8">
          <Pressable
            className="flex-row items-center gap-3 p-4 bg-primary/5 rounded-xl active:bg-primary/10"
            onPress={() => Alert.alert('Share', 'Receipt sharing is not available in the demo.')}
          >
            <MaterialCommunityIcons name="share-variant" size={20} color="#2edc6b" />
            <Text className="text-white text-sm font-manrope-bold">Share Receipt</Text>
          </Pressable>
          <Pressable
            className="flex-row items-center gap-3 p-4 bg-red-500/5 rounded-xl active:bg-red-500/10"
            onPress={() => Alert.alert('Report', 'Issue reporting is not available in the demo.')}
          >
            <MaterialCommunityIcons name="flag" size={20} color="#ef4444" />
            <Text className="text-red-400 text-sm font-manrope-bold">Report a Problem</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, valueClassName, hasBorder, isLast }: {
  label: string; value: string; valueClassName?: string; hasBorder?: boolean; isLast?: boolean;
}) {
  return (
    <View className={`flex-row justify-between py-3 ${!isLast ? 'border-b border-primary/10' : ''}`}>
      <Text className="text-slate-500 text-sm font-manrope">{label}</Text>
      <Text className={`text-sm font-manrope-semibold ${valueClassName || 'text-white'}`}>{value}</Text>
    </View>
  );
}
