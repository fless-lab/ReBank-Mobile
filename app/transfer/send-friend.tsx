import { Button, Input, ScreenHeader } from '@/components/ui';
import { AccountsService } from '@/lib/api/accounts';
import { TransactionsService } from '@/lib/api/transactions';
import { BankAccount } from '@/lib/types/api';
import { DangerCircle, Wallet2, InfoCircle } from '@solar-icons/react-native/BoldDuotone';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransferScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sourceAccountId?: string; prefillNumero?: string }>();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(
    params.sourceAccountId ? Number(params.sourceAccountId) : null
  );
  const [destinationNumero, setDestinationNumero] = useState(params.prefillNumero || '');
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
      Alert.alert('Erreur', e.message);
      setPageLoading(false);
    });
  }, []);

  const selectedAccount = accounts.find((a) => a.id === selectedId);

  const handleTransfer = async () => {
    if (!selectedId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un compte source.');
      return;
    }
    if (!destinationNumero.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le numéro de compte destination.');
      return;
    }
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Montant Invalide', 'Veuillez entrer un montant positif valide.');
      return;
    }
    if (selectedAccount && num > selectedAccount.balance) {
      Alert.alert('Fonds Insuffisants', 'Vous n\'avez pas assez de solde pour ce virement.');
      return;
    }

    setLoading(true);
    try {
      await TransactionsService.transfer(selectedId, destinationNumero.trim(), num);
      router.push({
        pathname: '/transfer/success' as any,
        params: {
          amount: String(num),
          name: `Compte ${destinationNumero}`,
          txId: `TRF-${Date.now()}`,
          type: 'friend',
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

  if (accounts.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <ScreenHeader title="Virement" />
        <View className="flex-1 items-center justify-center px-6">
          <DangerCircle size={48} color="#8C7B6B" />
          <Text className="text-foreground text-lg font-manrope-bold mt-4">Aucun compte approuvé</Text>
          <Text className="text-muted text-sm font-manrope mt-2 text-center">
            Vous avez besoin d'un compte approuvé pour effectuer des virements.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Virement" />
      <ScrollView className="flex-1" contentContainerClassName="px-6 pt-6 pb-8" keyboardShouldPersistTaps="handled">
        {/* Compte Source */}
        <Text className="text-muted text-xs font-manrope-bold uppercase tracking-widest mb-2">
          Compte Source
        </Text>
        <View className="bg-surface rounded-2xl border border-border mb-6 overflow-hidden">
          {accounts.map((acc, idx) => (
            <Pressable
              key={acc.id}
              className={`flex-row items-center justify-between p-4 ${idx > 0 ? 'border-t border-border' : ''}`}
              onPress={() => setSelectedId(acc.id)}
            >
              <View className="flex-row items-center gap-3">
                <View className={`size-5 rounded-full border-2 ${selectedId === acc.id ? 'border-primary bg-primary' : 'border-muted-light'}`} />
                <View>
                  <Text className="text-foreground text-sm font-manrope-bold">
                    {acc.first_name} {acc.last_name}
                  </Text>
                  <Text className="text-muted text-xs font-manrope">N° {acc.numero}</Text>
                </View>
              </View>
              <Text className="text-foreground text-sm font-manrope-semibold">{acc.balance.toLocaleString('fr-FR')} MAD</Text>
            </Pressable>
          ))}
        </View>

        {/* Numéro de Compte Destination */}
        <Text className="text-muted text-xs font-manrope-bold uppercase tracking-widest mb-2">
          Numéro de Compte Destination
        </Text>
        <View className="flex-row items-center bg-surface rounded-xl border border-border px-4 h-14 mb-6">
          <Wallet2 size={20} color="#8C7B6B" />
          <TextInput
            className="flex-1 text-foreground text-sm font-manrope ml-3"
            placeholder="Entrez le numéro de compte"
            placeholderTextColor="#B5A99D"
            value={destinationNumero}
            onChangeText={setDestinationNumero}
            keyboardType="number-pad"
          />
        </View>

        {/* Montant */}
        <Text className="text-muted text-xs font-manrope-bold uppercase tracking-widest mb-2">Montant</Text>
        <View className="flex-row items-center bg-surface rounded-xl border border-border px-4 h-14 mb-4">
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

        {/* Solde Disponible */}
        {selectedAccount ? (
          <View className="bg-surface rounded-xl p-3 border border-border mb-8 flex-row items-center gap-2">
            <InfoCircle size={16} color="#8C7B6B" />
            <Text className="text-muted text-xs font-manrope">
              Solde Disponible : <Text className="text-foreground font-manrope-bold">{selectedAccount.balance.toLocaleString('fr-FR')} MAD</Text>
            </Text>
          </View>
        ) : null}

        <Button
          title="Effectuer le Virement"
          variant="primary"
          onPress={handleTransfer}
          loading={loading}
          disabled={!amount || !destinationNumero.trim() || parseInt(amount, 10) <= 0}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
