import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AuthService } from '@/lib/api/auth';
import { AccountsService } from '@/lib/api/accounts';
import { BankAccount } from '@/lib/types/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  useFocusEffect(
    useCallback(() => {
      AccountsService.list().then(setAccounts).catch(() => {});
    }, [])
  );

  const totalBalance = accounts.filter(a => a.approved).reduce((s, a) => s + a.balance, 0);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await AuthService.logout();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-white text-xl font-manrope-bold tracking-tight">Your Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="items-center px-6 pb-8">
          <View className="size-24 rounded-full bg-primary/20 items-center justify-center mb-4">
            <MaterialCommunityIcons name="account" size={48} color="#2edc6b" />
          </View>
          <Text className="text-white text-xl font-manrope-bold">ReBank User</Text>
          <Text className="text-slate-400 text-sm font-manrope">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} · {totalBalance.toLocaleString()} MAD
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="px-6 mb-6 flex-row gap-3">
          <View className="flex-1 bg-primary/10 rounded-xl p-4 border border-primary/20">
            <Text className="text-primary/60 text-[10px] font-manrope-bold uppercase tracking-widest mb-1">Accounts</Text>
            <Text className="text-white text-2xl font-manrope-bold">{accounts.length}</Text>
          </View>
          <View className="flex-1 bg-primary/10 rounded-xl p-4 border border-primary/20">
            <Text className="text-primary/60 text-[10px] font-manrope-bold uppercase tracking-widest mb-1">Active</Text>
            <Text className="text-white text-2xl font-manrope-bold">{accounts.filter(a => a.approved).length}</Text>
          </View>
          <View className="flex-1 bg-primary/10 rounded-xl p-4 border border-primary/20">
            <Text className="text-primary/60 text-[10px] font-manrope-bold uppercase tracking-widest mb-1">Pending</Text>
            <Text className="text-white text-2xl font-manrope-bold">{accounts.filter(a => !a.approved).length}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 gap-2">
          {[
            { icon: 'bank' as const, title: 'My Accounts', route: '/(main)/accounts' as any },
            { icon: 'bank-plus' as const, title: 'New Account', route: '/account/create' as any },
            { icon: 'shield-check' as const, title: 'Security', route: '/settings/security' as any },
            { icon: 'help-circle' as const, title: 'Help & Support', route: null },
          ].map((item) => (
            <Pressable
              key={item.title}
              className="flex-row items-center gap-4 p-4 bg-primary/10 rounded-xl active:bg-primary/20"
              onPress={() => item.route ? router.push(item.route) : Alert.alert('Coming Soon', `${item.title} is not available yet.`)}
            >
              <View className="size-10 rounded-lg bg-primary/20 items-center justify-center">
                <MaterialCommunityIcons name={item.icon} size={20} color="#2edc6b" />
              </View>
              <Text className="text-white text-sm font-manrope-bold flex-1">{item.title}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
          ))}

          {/* Logout */}
          <Pressable
            className="flex-row items-center gap-4 p-4 mt-4 rounded-xl active:bg-red-500/10"
            onPress={handleLogout}
          >
            <View className="size-10 rounded-lg bg-red-500/20 items-center justify-center">
              <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
            </View>
            <Text className="text-red-400 text-sm font-manrope-bold flex-1">Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
