import { Button } from '@/components/ui';
import { CheckCircle } from '@solar-icons/react-native/BoldDuotone';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransferSuccessScreen() {
  const router = useRouter();
  const { amount, name, txId, type } = useLocalSearchParams<{
    amount: string; name: string; txId: string; type?: string;
  }>();

  const titles: Record<string, string> = {
    deposit: 'Dépôt Réussi',
    withdraw: 'Retrait Réussi',
    between: 'Virement Effectué',
    friend: 'Virement Envoyé !',
  };

  const descriptions: Record<string, string> = {
    deposit: 'déposé sur',
    withdraw: 'retiré de',
    between: 'transféré vers',
    friend: 'envoyé à',
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-1 items-center justify-center px-6">
        {/* Icône de Succès */}
        <View className="size-24 rounded-full bg-[#5B8C5A]/20 items-center justify-center mb-6">
          <View className="size-16 rounded-full bg-[#5B8C5A]/40 items-center justify-center">
            <CheckCircle size={40} color="#5B8C5A" />
          </View>
        </View>

        <Text className="text-foreground text-2xl font-manrope-bold tracking-tight mb-2 text-center">
          {titles[type || ''] || 'Opération Réussie !'}
        </Text>
        <Text className="text-muted text-base font-manrope text-center mb-8">
          <Text className="text-foreground font-manrope-bold">{amount} MAD</Text>
          {' '}{descriptions[type || ''] || 'transféré vers'}{' '}
          <Text className="text-foreground font-manrope-bold">{name}</Text>
        </Text>

        {/* Reçu */}
        <View className="w-full bg-surface rounded-2xl p-5 border border-border mb-8">
          <View className="flex-row justify-between mb-3">
            <Text className="text-muted text-sm font-manrope">Référence</Text>
            <Text className="text-foreground text-sm font-manrope-semibold">
              {txId?.toUpperCase().slice(0, 14) || 'N/A'}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-muted text-sm font-manrope">Date</Text>
            <Text className="text-foreground text-sm font-manrope-semibold">
              {new Date().toLocaleDateString('fr-FR')}
            </Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-muted text-sm font-manrope">Statut</Text>
            <Text className="text-[#5B8C5A] text-sm font-manrope-bold">Terminé</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-muted text-sm font-manrope">Montant</Text>
            <Text className="text-foreground text-sm font-manrope-semibold">{amount} MAD</Text>
          </View>
        </View>

        <View className="w-full gap-3">
          <Button title="Retour à l'Accueil" variant="primary" onPress={() => router.replace('/(main)/home')} />
          <Button title="Voir les Détails" variant="outline" onPress={() => router.replace('/(main)/transfers')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
