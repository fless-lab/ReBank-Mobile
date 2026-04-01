import { Button, ScreenHeader } from '@/components/ui';
import { AccountsService } from '@/lib/api/accounts';
import { TransactionsService } from '@/lib/api/transactions';
import { BankAccount } from '@/lib/types/api';
import { DangerCircle } from '@solar-icons/react-native/BoldDuotone';
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
      Alert.alert('Erreur', e.message);
      setPageLoading(false);
    });
  }, []);

  const handleTransfer = async () => {
    if (accounts.length < 2) {
      Alert.alert('Erreur', 'Vous avez besoin d\'au moins 2 comptes approuvés.');
      return;
    }
    if (fromIdx === toIdx) {
      Alert.alert('Même Compte', 'Le compte source et le compte destination doivent être différents.');
      return;
    }
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Montant Invalide', 'Veuillez entrer un montant positif valide.');
      return;
    }
    const sourceAccount = accounts[fromIdx];
    const destAccount = accounts[toIdx];

    if (num > sourceAccount.balance) {
      Alert.alert('Fonds Insuffisants', 'Vous n\'avez pas assez de solde.');
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
      Alert.alert('Échec du Virement', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#8B6F47" />
      </SafeAreaView>
    );
  }

  if (accounts.length < 2) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <ScreenHeader title="Virement Interne" />
        <View className="flex-1 items-center justify-center px-6">
          <DangerCircle size={48} color="#8C7B6B" />
          <Text className="text-foreground text-lg font-manrope-bold mt-4">Pas assez de comptes</Text>
          <Text className="text-muted text-sm font-manrope mt-2 text-center">
            Vous avez besoin d'au moins 2 comptes approuvés pour effectuer un virement interne.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Virement Interne" />
      <View className="flex-1 px-6 pt-6">
        {/* Compte Source */}
        <Text className="text-muted text-xs font-manrope-bold uppercase tracking-widest mb-2">Compte Source</Text>
        <View className="bg-surface rounded-2xl border border-border mb-6 overflow-hidden">
          {accounts.map((acc, idx) => (
            <Pressable
              key={acc.id}
              className={`flex-row items-center justify-between p-4 ${idx > 0 ? 'border-t border-border' : ''}`}
              onPress={() => setFromIdx(idx)}
            >
              <View className="flex-row items-center gap-3">
                <View className={`size-5 rounded-full border-2 ${fromIdx === idx ? 'border-primary bg-primary' : 'border-muted-light'}`} />
                <View>
                  <Text className="text-foreground text-sm font-manrope-bold">{acc.first_name} {acc.last_name}</Text>
                  <Text className="text-muted text-xs font-manrope">N° {acc.numero}</Text>
                </View>
              </View>
              <Text className="text-foreground text-sm font-manrope-semibold">{acc.balance.toLocaleString('fr-FR')} MAD</Text>
            </Pressable>
          ))}
        </View>

        {/* Compte Destination */}
        <Text className="text-muted text-xs font-manrope-bold uppercase tracking-widest mb-2">Compte Destination</Text>
        <View className="bg-surface rounded-2xl border border-border mb-8 overflow-hidden">
          {accounts.map((acc, idx) => (
            <Pressable
              key={acc.id}
              className={`flex-row items-center justify-between p-4 ${idx > 0 ? 'border-t border-border' : ''}`}
              onPress={() => setToIdx(idx)}
            >
              <View className="flex-row items-center gap-3">
                <View className={`size-5 rounded-full border-2 ${toIdx === idx ? 'border-primary bg-primary' : 'border-muted-light'}`} />
                <View>
                  <Text className="text-foreground text-sm font-manrope-bold">{acc.first_name} {acc.last_name}</Text>
                  <Text className="text-muted text-xs font-manrope">N° {acc.numero}</Text>
                </View>
              </View>
              <Text className="text-foreground text-sm font-manrope-semibold">{acc.balance.toLocaleString('fr-FR')} MAD</Text>
            </Pressable>
          ))}
        </View>

        {/* Montant */}
        <Text className="text-muted text-xs font-manrope-bold uppercase tracking-widest mb-2">Montant</Text>
        <View className="flex-row items-center bg-surface rounded-xl border border-border px-4 h-14 mb-8">
          <Text className="text-primary text-xl font-manrope-bold mr-2">MAD</Text>
          <TextInput
            className="flex-1 text-foreground text-xl font-manrope-bold"
            keyboardType="number-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor="#B5A99D"
          />
        </View>

        <Button
          title="Effectuer le Virement"
          variant="primary"
          onPress={handleTransfer}
          loading={loading}
          disabled={!amount || parseInt(amount, 10) <= 0}
        />
      </View>
    </SafeAreaView>
  );
}
