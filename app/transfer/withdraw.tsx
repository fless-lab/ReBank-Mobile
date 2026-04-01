import { Button, ScreenHeader } from '@/components/ui';
import { AccountsService } from '@/lib/api/accounts';
import { TransactionsService } from '@/lib/api/transactions';
import { BankAccount } from '@/lib/types/api';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WithdrawScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ accountId?: string }>();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(
    params.accountId ? Number(params.accountId) : null
  );
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    AccountsService.list().then((data) => {
      const approved = data.filter((a) => a.approved);
      setAccounts(approved);
      if (!selectedId && approved.length > 0) {
        setSelectedId(approved[0].id);
      }
      setPageLoading(false);
    }).catch((e) => {
      Alert.alert('Error', e.message);
      setPageLoading(false);
    });
  }, []);

  const selectedAccount = accounts.find((a) => a.id === selectedId);

  const handleWithdraw = async () => {
    if (!selectedId) {
      Alert.alert('Error', 'Please select an account.');
      return;
    }
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive amount.');
      return;
    }
    if (selectedAccount && num > selectedAccount.balance) {
      Alert.alert('Insufficient Funds', 'You do not have enough balance for this withdrawal.');
      return;
    }
    setLoading(true);
    try {
      await TransactionsService.withdraw(selectedId, num);
      router.push({
        pathname: '/transfer/success' as any,
        params: {
          amount: String(num),
          name: selectedAccount ? `${selectedAccount.first_name} ${selectedAccount.last_name}` : 'Account',
          txId: `WDR-${Date.now()}`,
          type: 'withdraw',
        },
      });
    } catch (e: any) {
      Alert.alert('Withdrawal Failed', e.message);
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

  if (accounts.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <ScreenHeader title="Withdraw" />
        <View className="flex-1 items-center justify-center px-6">
          <MaterialCommunityIcons name="bank-off" size={48} color="#94a3b8" />
          <Text className="text-white text-lg font-manrope-bold mt-4">No approved accounts</Text>
          <Text className="text-slate-400 text-sm font-manrope mt-2 text-center">
            You need an approved account to make a withdrawal.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Withdraw" />
      <View className="flex-1 px-6 pt-6">
        {/* Select Account */}
        <Text className="text-slate-400 text-xs font-manrope-bold uppercase tracking-widest mb-2">
          Select Account
        </Text>
        <View className="bg-primary/5 rounded-2xl border border-primary/10 mb-6 overflow-hidden">
          {accounts.map((acc, idx) => (
            <Pressable
              key={acc.id}
              className={`flex-row items-center justify-between p-4 ${idx > 0 ? 'border-t border-primary/10' : ''}`}
              onPress={() => setSelectedId(acc.id)}
            >
              <View className="flex-row items-center gap-3">
                <View className={`size-5 rounded-full border-2 ${selectedId === acc.id ? 'border-primary bg-primary' : 'border-slate-600'}`} />
                <View>
                  <Text className="text-white text-sm font-manrope-bold">
                    {acc.first_name} {acc.last_name}
                  </Text>
                  <Text className="text-slate-500 text-xs font-manrope">N° {acc.numero}</Text>
                </View>
              </View>
              <Text className="text-white text-sm font-manrope-semibold">{acc.balance.toLocaleString()} MAD</Text>
            </Pressable>
          ))}
        </View>

        {/* Available Balance */}
        {selectedAccount ? (
          <View className="bg-primary/5 rounded-xl p-3 border border-primary/10 mb-4 flex-row items-center gap-2">
            <MaterialCommunityIcons name="information" size={16} color="rgba(46, 220, 107, 0.5)" />
            <Text className="text-slate-400 text-xs font-manrope">
              Available: <Text className="text-white font-manrope-bold">{selectedAccount.balance.toLocaleString()} MAD</Text>
            </Text>
          </View>
        ) : null}

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
          title="Withdraw"
          variant="primary"
          onPress={handleWithdraw}
          loading={loading}
          disabled={!amount || parseInt(amount, 10) <= 0}
        />
      </View>
    </SafeAreaView>
  );
}
