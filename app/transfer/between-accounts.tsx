import { Button, ScreenHeader } from '@/components/ui';
import { getDb } from '@/lib/mockDb';
import { TransfersService } from '@/lib/api/transfers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BetweenAccountsScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    getDb().then(db => {
      setAccounts(db.accounts);
      setPageLoading(false);
    });
  }, []);

  const handleTransfer = async () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (fromIdx === toIdx) {
      Alert.alert('Same Account', 'Source and destination must be different.');
      return;
    }
    setLoading(true);
    try {
      const res = await TransfersService.betweenAccounts(accounts[fromIdx].id, accounts[toIdx].id, num);
      router.push({
        pathname: '/transfer/success' as any,
        params: { amount: num.toFixed(2), name: accounts[toIdx].name, txId: res.transaction.id, type: 'between' }
      });
    } catch (e: any) {
      Alert.alert('Transfer Failed', e.message);
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

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Between Accounts" />
      <View className="flex-1 px-6 pt-6">
        {/* From Account */}
        <Text className="text-slate-400 text-xs font-manrope-bold uppercase tracking-widest mb-2">From</Text>
        <View className="bg-primary/5 rounded-2xl border border-primary/10 mb-6 overflow-hidden">
          {accounts.map((acc, idx) => (
            <Pressable
              key={acc.id}
              className={`flex-row items-center justify-between p-4 ${idx > 0 ? 'border-t border-primary/10' : ''}`}
              onPress={() => setFromIdx(idx)}
            >
              <View className="flex-row items-center gap-3">
                <View className={`size-5 rounded-full border-2 ${fromIdx === idx ? 'border-primary bg-primary' : 'border-slate-600'}`} />
                <View>
                  <Text className="text-white text-sm font-manrope-bold">{acc.name}</Text>
                  <Text className="text-slate-500 text-xs font-manrope">{acc.accountNumber}</Text>
                </View>
              </View>
              <Text className="text-white text-sm font-manrope-semibold">${acc.balance.toFixed(2)}</Text>
            </Pressable>
          ))}
        </View>

        {/* To Account */}
        <Text className="text-slate-400 text-xs font-manrope-bold uppercase tracking-widest mb-2">To</Text>
        <View className="bg-primary/5 rounded-2xl border border-primary/10 mb-8 overflow-hidden">
          {accounts.map((acc, idx) => (
            <Pressable
              key={acc.id}
              className={`flex-row items-center justify-between p-4 ${idx > 0 ? 'border-t border-primary/10' : ''}`}
              onPress={() => setToIdx(idx)}
            >
              <View className="flex-row items-center gap-3">
                <View className={`size-5 rounded-full border-2 ${toIdx === idx ? 'border-primary bg-primary' : 'border-slate-600'}`} />
                <View>
                  <Text className="text-white text-sm font-manrope-bold">{acc.name}</Text>
                  <Text className="text-slate-500 text-xs font-manrope">{acc.accountNumber}</Text>
                </View>
              </View>
              <Text className="text-white text-sm font-manrope-semibold">${acc.balance.toFixed(2)}</Text>
            </Pressable>
          ))}
        </View>

        {/* Amount */}
        <Text className="text-slate-400 text-xs font-manrope-bold uppercase tracking-widest mb-2">Amount</Text>
        <View className="flex-row items-center bg-primary/5 rounded-xl border border-primary/10 px-4 h-14 mb-8">
          <Text className="text-primary text-xl font-manrope-bold mr-2">$</Text>
          <TextInput
            className="flex-1 text-white text-xl font-manrope-bold"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="rgba(255,255,255,0.2)"
          />
        </View>

        <Button
          title="Transfer Now"
          variant="primary"
          onPress={handleTransfer}
          loading={loading}
          disabled={!amount || parseFloat(amount) <= 0}
        />
      </View>
    </SafeAreaView>
  );
}
