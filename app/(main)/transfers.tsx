import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TransferOptionCard, QuickSendContact, RecentTransaction } from '@/components/ui';

const CONTACTS = [
  { name: 'New', isNew: true },
  { name: 'Marcus' },
  { name: 'Elena' },
  { name: 'Julian' },
  { name: 'Sarah' },
  { name: 'David' },
];

export default function TransfersScreen() {
  const router = useRouter();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
              />
            </View>
            <View className="w-[48%]">
              <TransferOptionCard
                icon="account-plus"
                title="Send to Friend"
                subtitle="Split costs easily"
              />
            </View>
            <View className="w-[48%]">
              <TransferOptionCard
                icon="earth"
                title="International"
                subtitle="Global remittances"
              />
            </View>
            <View className="w-[48%]">
              <TransferOptionCard
                icon="receipt"
                title="Pay Bills"
                subtitle="Scheduled payments"
              />
            </View>
          </View>
        </View>

        {/* Quick Send */}
        <View className="mt-8">
          <View className="flex-row items-center justify-between px-4 mb-4">
            <Text className="text-white text-lg font-manrope-bold tracking-tight">Quick Send</Text>
            <Text className="text-primary text-sm font-manrope-semibold">See all</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-4 gap-4 pb-4">
            {CONTACTS.map((contact, index) => (
              <QuickSendContact
                key={index}
                name={contact.name}
                isNew={contact.isNew}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View className="px-4 mt-8">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Recent</Text>
          <RecentTransaction
            icon="lightning-bolt"
            title="Electric Co."
            date="Oct 12, 2023"
            amount="-$84.20"
          />
          <RecentTransaction
            icon="wifi"
            title="Internet Bill"
            date="Oct 10, 2023"
            amount="-$55.00"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
