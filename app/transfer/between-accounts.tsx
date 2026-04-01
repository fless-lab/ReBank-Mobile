import { Button, ScreenHeader } from '@/components/ui';
import { AccountsService } from '@/lib/api/accounts';
import { TransactionsService } from '@/lib/api/transactions';
import { BankAccount } from '@/lib/types/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BetweenAccountsScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    AccountsService.list().then((data) => {
      const approved = data.filter((a) => a.approved);
      setAccounts(approved);
      if (approved.length >= 2) {
        setFromIdx(0);
        setToIdx(1);
      }
      setPageLoading(false);
    }).catch((e) => {
      Alert.alert('Error', e.message);
      setPageLoading(false);
    });
  }, []);

  const handleTransfer = async () => {
    if (accounts.length < 2) {
      Alert.alert('Error', 'You need at least 2 approved accounts.');
      return;
    }
    if (fromIdx === toIdx) {
      Alert.alert('Same Account', 'Source and destination must be different.');
      return;
    }
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive amount.');
      return;
    }
    const sourceAccount = accounts[fromIdx];
    const destAccount = accounts[toIdx];

    if (num > sourceAccount.balance) {
      Alert.alert('Insufficient Funds', 'You do not have enough balance.');
      return;
    }

    setLoading(true);
    try {
      await TransactionsService.transfer(
        sourceAccount.id,
        String(destAccount.numero),
        num,
      );
      router.push({
        pathname: '/transfer/success' as any,
        params: {
          amount: String(num),
          name: `${destAccount.first_name} ${destAccount.last_name}`,
          txId: `TRF-${Date.now()}`,
          type: 'between',
        },
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

  if (accounts.length < 2) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <ScreenHeader title="Between Accounts" />
        <View className="flex-1 items-center justify-center px-6">
          <MaterialCommunityIcons name="bank-off" size={48} color="#94a3b8" />
          <Text className="text-white text-lg font-manrope-bold mt-4">Not enough accounts</Text>
          <Text className="text-slate-400 text-sm font-manrope mt-2 text-center">
            You need at least 2 approved accounts to transfer between them.
          </Text>
        </View>
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
                  <Text className="text-white text-sm font-manrope-bold">{acc.first_name} {acc.last_name}</Text>
                  <Text className="text-slate-500 text-xs font-manrope">N° {acc.numero}</Text>
                </View>
              </View>
              <Text className="text-white text-sm font-manrope-semibold">{acc.balance.toLocaleString()} MAD</Text>
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
                  <Text className="text-white text-sm font-manrope-bold">{acc.first_name} {acc.last_name}</Text>
                  <Text className="text-slate-500 text-xs font-manrope">N° {acc.numero}</Text>
                </View>
              </View>
              <Text className="text-white text-sm font-manrope-semibold">{acc.balance.toLocaleString()} MAD</Text>
            </Pressable>
          ))}
        </View>

        {/* Amount */}
        <Text className="text-slate-400 text-xs font-manrope-bold uppercase tracking-widest mb-2">Amount</Text>
        <View className="flex-row items-center bg-primary/5 rounded-xl border border-primary/10 px-4 h-14 mb-8">
          <Text className="text-primary text-xl font-manrope-bold mr-2">MAD</Text>
          <TextInput
            className="flex-1 text-white text-xl font-manrope-bold"
            keyboardType="number-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor="rgba(255,255,255,0.2)"
          />
        </View>

        <Button
          title="Transfer Now"
          variant="primary"
          onPress={handleTransfer}
          loading={loading}
          disabled={!amount || parseInt(amount, 10) <= 0}
        />
      </View>
    </SafeAreaView>
  );
}
