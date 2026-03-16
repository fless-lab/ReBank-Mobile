import { Button, Input, ScreenHeader } from '@/components/ui';
import { TransfersService } from '@/lib/api/transfers';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_RATE = 0.92; // USD to EUR

export default function InternationalScreen() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState('');
  const [country, setCountry] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const fee = Math.round(numAmount * 0.025 * 100) / 100;
  const converted = Math.round(numAmount * MOCK_RATE * 100) / 100;

  const handleSend = async () => {
    if (!recipientName.trim()) { Alert.alert('Error', 'Enter recipient name.'); return; }
    if (!country.trim()) { Alert.alert('Error', 'Enter destination country.'); return; }
    if (numAmount <= 0) { Alert.alert('Error', 'Enter a valid amount.'); return; }

    setLoading(true);
    try {
      const res = await TransfersService.internationalTransfer(numAmount, recipientName, country);
      router.push({
        pathname: '/transfer/success' as any,
        params: {
          amount: numAmount.toFixed(2), name: recipientName, txId: res.transaction.id,
          type: 'international', fee: fee.toFixed(2), country,
        },
      });
    } catch (e: any) {
      Alert.alert('Transfer Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="International Transfer" />
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="gap-4">
          <Input
            label="Recipient Name"
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="Carlos Ruiz"
            leftIcon="account"
          />
          <Input
            label="Destination Country"
            value={country}
            onChangeText={setCountry}
            placeholder="Spain"
            leftIcon="earth"
          />
          <Input
            label="Amount (USD)"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            leftIcon="currency-usd"
          />
        </View>

        {/* Rate & Fee Summary */}
        {numAmount > 0 && (
          <View className="bg-primary/5 rounded-2xl p-4 border border-primary/10 mt-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500 text-sm font-manrope">Exchange Rate</Text>
              <Text className="text-white text-sm font-manrope-semibold">1 USD = {MOCK_RATE} EUR</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500 text-sm font-manrope">Recipient Gets</Text>
              <Text className="text-primary text-sm font-manrope-bold">€{converted.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500 text-sm font-manrope">Transfer Fee (2.5%)</Text>
              <Text className="text-white text-sm font-manrope-semibold">${fee.toFixed(2)}</Text>
            </View>
            <View className="h-px bg-primary/10 my-2" />
            <View className="flex-row justify-between">
              <Text className="text-white text-sm font-manrope-bold">Total Debit</Text>
              <Text className="text-white text-sm font-manrope-bold">${(numAmount + fee).toFixed(2)}</Text>
            </View>
          </View>
        )}

        <View className="mt-8">
          <Button
            title="Send International Transfer"
            variant="primary"
            onPress={handleSend}
            loading={loading}
            disabled={numAmount <= 0}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
