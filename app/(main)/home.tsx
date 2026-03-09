import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Logo } from '@/components/ui';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <View>
            <Text className="text-slate-400 text-sm font-manrope">Good morning,</Text>
            <Text className="text-white text-xl font-manrope-bold">Jameson</Text>
          </View>
          <View className="size-10 rounded-full bg-primary/20 items-center justify-center">
            <MaterialCommunityIcons name="bell" size={20} color="#2edc6b" />
          </View>
        </View>

        {/* Balance Card */}
        <View className="mx-6 p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-8">
          <Text className="text-primary/60 text-xs font-manrope-bold uppercase tracking-widest mb-2">
            Total Balance
          </Text>
          <Text className="text-white text-4xl font-manrope-extrabold tracking-tight mb-1">
            $24,562.80
          </Text>
          <View className="flex-row items-center gap-1 mt-2">
            <MaterialCommunityIcons name="trending-up" size={16} color="#2edc6b" />
            <Text className="text-primary text-sm font-manrope-semibold">+2.4% this month</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Quick Actions</Text>
          <View className="flex-row gap-4">
            {[
              { icon: 'send' as const, label: 'Send' },
              { icon: 'cash-plus' as const, label: 'Receive' },
              { icon: 'qrcode-scan' as const, label: 'Scan' },
              { icon: 'dots-horizontal' as const, label: 'More' },
            ].map((action) => (
              <View key={action.label} className="flex-1 items-center gap-2">
                <View className="size-12 rounded-xl bg-primary/10 items-center justify-center">
                  <MaterialCommunityIcons name={action.icon} size={22} color="#2edc6b" />
                </View>
                <Text className="text-xs font-manrope-semibold text-slate-400">{action.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Recent Transactions</Text>
          {[
            { icon: 'shopping-outline' as const, title: 'Amazon', date: 'Today', amount: '-$156.00' },
            { icon: 'coffee' as const, title: 'Starbucks', date: 'Yesterday', amount: '-$8.50' },
            { icon: 'cash-plus' as const, title: 'Salary Deposit', date: 'Mar 1', amount: '+$5,200.00' },
          ].map((tx) => (
            <View key={tx.title} className="flex-row items-center justify-between p-4 bg-primary/10 rounded-xl mb-2">
              <View className="flex-row items-center gap-3">
                <View className="size-10 rounded-full bg-slate-800 items-center justify-center">
                  <MaterialCommunityIcons name={tx.icon} size={20} color="#94a3b8" />
                </View>
                <View>
                  <Text className="text-sm font-manrope-bold text-white">{tx.title}</Text>
                  <Text className="text-xs text-slate-500 font-manrope">{tx.date}</Text>
                </View>
              </View>
              <Text className={`text-sm font-manrope-bold ${tx.amount.startsWith('+') ? 'text-primary' : 'text-white'}`}>
                {tx.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
