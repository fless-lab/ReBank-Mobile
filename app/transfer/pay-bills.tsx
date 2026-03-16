import { Button, ScreenHeader } from '@/components/ui';
import { BillersService } from '@/lib/api/billers';
import { TransfersService } from '@/lib/api/transfers';
import { Biller } from '@/lib/mockDb';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORY_COLORS: Record<string, string> = {
  electricity: '#fbbf24',
  internet: '#3b82f6',
  streaming: '#ef4444',
  water: '#06b6d4',
  insurance: '#8b5cf6',
};

export default function PayBillsScreen() {
  const router = useRouter();
  const [billers, setBillers] = useState<Biller[]>([]);
  const [selected, setSelected] = useState<Biller | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    BillersService.getBillers().then(b => {
      setBillers(b);
      setPageLoading(false);
    });
  }, []);

  const handlePay = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await TransfersService.payBill(selected.id);
      router.push({
        pathname: '/transfer/success' as any,
        params: { amount: res.amountPaid.toFixed(2), name: selected.name, txId: res.transaction.id, type: 'bill' }
      });
    } catch (e: any) {
      Alert.alert('Payment Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#2edc6b" />
      </SafeAreaView>
    );
  }

  // Detail view
  if (selected) {
    const color = CATEGORY_COLORS[selected.category] || '#2edc6b';
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <ScreenHeader title="Pay Bill" onBack={() => setSelected(null)} />
        <View className="flex-1 items-center justify-center px-6">
          <View className="size-20 rounded-full items-center justify-center mb-4" style={{ backgroundColor: `${color}20` }}>
            <MaterialCommunityIcons name={selected.icon as any} size={40} color={color} />
          </View>
          <Text className="text-white text-2xl font-manrope-bold mb-1">{selected.name}</Text>
          <Text className="text-slate-400 text-sm font-manrope capitalize mb-2">{selected.category}</Text>

          <View className="w-full bg-primary/5 rounded-2xl p-4 border border-primary/10 my-8">
            <View className="flex-row justify-between mb-3">
              <Text className="text-slate-500 text-sm font-manrope">Amount Due</Text>
              <Text className="text-white text-lg font-manrope-bold">${selected.amount.toFixed(2)}</Text>
            </View>
            {selected.lastPaid && (
              <View className="flex-row justify-between">
                <Text className="text-slate-500 text-sm font-manrope">Last Paid</Text>
                <Text className="text-slate-300 text-sm font-manrope-semibold">
                  {new Date(selected.lastPaid).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>

          <View className="w-full">
            <Button
              title={`Pay $${selected.amount.toFixed(2)}`}
              variant="primary"
              onPress={handlePay}
              loading={loading}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Pay Bills" />
      <ScrollView className="flex-1 px-6 pt-4">
        <Text className="text-slate-400 text-xs font-manrope-bold uppercase tracking-widest mb-3">Your Billers</Text>
        {billers.map(biller => {
          const color = CATEGORY_COLORS[biller.category] || '#2edc6b';
          return (
            <Pressable
              key={biller.id}
              className="flex-row items-center gap-4 p-4 bg-primary/5 rounded-xl mb-2 active:bg-primary/10"
              onPress={() => setSelected(biller)}
            >
              <View className="size-12 rounded-full items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <MaterialCommunityIcons name={biller.icon as any} size={24} color={color} />
              </View>
              <View className="flex-1">
                <Text className="text-white text-sm font-manrope-bold">{biller.name}</Text>
                <Text className="text-slate-500 text-xs font-manrope capitalize">{biller.category}</Text>
              </View>
              <Text className="text-white text-sm font-manrope-bold">${biller.amount.toFixed(2)}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
