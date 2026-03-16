import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { TransferOptionCard, QuickSendContact, RecentTransaction } from '@/components/ui';
import { ContactsService } from '@/lib/api/contacts';
import { TransactionsService } from '@/lib/api/transactions';
import { Contact, Transaction } from '@/lib/mockDb';

export default function TransfersScreen() {
  const router = useRouter();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);

  useFocusEffect(
    useCallback(() => {
      ContactsService.getContacts().then(setContacts);
      TransactionsService.getTransactionsByCategory('transfer').then(txs => setRecentTx(txs.slice(0, 4)));
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="flex-row items-center px-4 py-3 justify-between border-b border-primary/10">
          <Pressable
            className="size-12 items-center justify-center rounded-full active:bg-primary/10"
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </Pressable>
          <Text className="text-white text-lg font-manrope-bold tracking-tight flex-1 text-center">
            Transfer & Pay
          </Text>
          <Pressable
            className="size-12 items-center justify-center rounded-full active:bg-primary/10"
            onPress={() => setSearchVisible(!searchVisible)}
          >
            <MaterialCommunityIcons name={searchVisible ? 'close' : 'magnify'} size={24} color="#fff" />
          </Pressable>
        </View>

        {/* Search Bar */}
        {searchVisible && (
          <View className="px-4 pt-3 pb-1">
            <View className="relative">
              <View className="absolute left-4 top-3.5 z-10">
                <MaterialCommunityIcons name="magnify" size={20} color="rgba(46, 220, 107, 0.4)" />
              </View>
              <TextInput
                className="w-full rounded-xl text-white border border-primary/20 bg-primary/5 h-12 pl-12 pr-4 text-sm font-manrope"
                placeholder="Search transfers, contacts..."
                placeholderTextColor="rgba(46, 220, 107, 0.3)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>
          </View>
        )}

        {/* Transfer Options Grid */}
        <View className="px-4 pt-6">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Transfer Options</Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="w-[48%]">
              <TransferOptionCard
                icon="swap-horizontal"
                title="Between Accounts"
                subtitle="Move money instantly"
                onPress={() => router.push('/transfer/between-accounts' as any)}
              />
            </View>
            <View className="w-[48%]">
              <TransferOptionCard
                icon="account-plus"
                title="Send to Friend"
                subtitle="Split costs easily"
                onPress={() => router.push('/transfer/send-friend' as any)}
              />
            </View>
            <View className="w-[48%]">
              <TransferOptionCard
                icon="earth"
                title="International"
                subtitle="Global remittances"
                onPress={() => router.push('/transfer/international' as any)}
              />
            </View>
            <View className="w-[48%]">
              <TransferOptionCard
                icon="receipt"
                title="Pay Bills"
                subtitle="Scheduled payments"
                onPress={() => router.push('/transfer/pay-bills' as any)}
              />
            </View>
          </View>
        </View>

        {/* Quick Send */}
        <View className="mt-8">
          <View className="flex-row items-center justify-between px-4 mb-4">
            <Text className="text-white text-lg font-manrope-bold tracking-tight">Quick Send</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-4 pb-4">
            <QuickSendContact name="New" isNew onPress={() => router.push('/transfer/send-friend' as any)} />
            {contacts.map((contact) => (
              <QuickSendContact
                key={contact.id}
                name={contact.name.split(' ')[0]}
                onPress={() => router.push({
                  pathname: '/transfer/send-friend' as any,
                  params: { preselect: contact.id },
                })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent Transfers */}
        <View className="px-4 mt-8">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Recent Transfers</Text>
          {recentTx.map(tx => {
            const dateStr = new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            return (
              <Pressable
                key={tx.id}
                className="flex-row items-center justify-between p-4 bg-primary/5 rounded-xl mb-2 active:bg-primary/10"
                onPress={() => router.push({ pathname: '/transaction/[id]' as any, params: { id: tx.id } })}
              >
                <View className="flex-row items-center gap-3">
                  <View className="size-10 rounded-full bg-slate-800 items-center justify-center">
                    <MaterialCommunityIcons name={(tx.icon || 'swap-horizontal') as any} size={20} color="#94a3b8" />
                  </View>
                  <View>
                    <Text className="text-sm font-manrope-bold text-white">{tx.title}</Text>
                    <Text className="text-xs text-slate-500 font-manrope">{dateStr}</Text>
                  </View>
                </View>
                <Text className="text-white text-sm font-manrope-bold">
                  ${Math.abs(tx.amount).toFixed(2)}
                </Text>
              </Pressable>
            );
          })}
          {recentTx.length === 0 && (
            <Text className="text-slate-500 text-sm font-manrope text-center mt-4">No recent transfers</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
