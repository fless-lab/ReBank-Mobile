import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet2, ShieldCheck, QuestionCircle, WadOfMoney, Logout2 } from '@solar-icons/react-native/BoldDuotone';
import { AltArrowRight } from '@solar-icons/react-native/Linear';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { AuthService, getUserEmail } from '@/lib/api/auth';
import { AccountsService } from '@/lib/api/accounts';
import { BankAccount } from '@/lib/types/api';
import { getAvatarColor, getAvatarInitials } from '@/utils/avatar';

export default function ProfileScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [email, setEmail] = useState('');

  useFocusEffect(
    useCallback(() => {
      AccountsService.list().then(setAccounts).catch(() => {});
      getUserEmail().then((e) => setEmail(e || ''));
    }, [])
  );

  const avatarColor = getAvatarColor(email || 'user');
  const avatarInitials = getAvatarInitials(email.split('@')[0] || 'U');

  const totalBalance = accounts.filter(a => a.approved).reduce((s, a) => s + a.balance, 0);

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se Déconnecter',
        style: 'destructive',
        onPress: async () => {
          await AuthService.logout();
          router.replace('/');
        },
      },
    ]);
  };

  const menuItems = [
    { Icon: Wallet2, title: 'Mes Comptes', route: '/(main)/accounts' as any },
    { Icon: WadOfMoney, title: 'Nouveau Compte', route: '/account/create' as any },
    { Icon: ShieldCheck, title: 'Sécurité', route: '/settings/security' as any },
    { Icon: QuestionCircle, title: 'Aide & Support', route: null },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-foreground text-xl font-manrope-bold tracking-tight">Votre Profil</Text>
        </View>

        {/* Profile Card */}
        <View className="items-center px-6 pb-8">
          <View
            className="size-24 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: avatarColor + '30' }}
          >
            <Text style={{ color: avatarColor, fontSize: 32, fontFamily: 'Manrope-Bold' }}>
              {avatarInitials}
            </Text>
          </View>
          {email ? (
            <Text className="text-foreground text-xl font-manrope-bold">{email}</Text>
          ) : (
            <Text className="text-foreground text-xl font-manrope-bold">Utilisateur ReBank</Text>
          )}
          <Text className="text-muted text-sm font-manrope">
            {accounts.length} compte{accounts.length !== 1 ? 's' : ''} · {totalBalance.toLocaleString('fr-FR')} MAD
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="px-6 mb-6 flex-row gap-3">
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <Text className="text-muted text-[10px] font-manrope-bold uppercase tracking-widest mb-1">Comptes</Text>
            <Text className="text-foreground text-2xl font-manrope-bold">{accounts.length}</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <Text className="text-muted text-[10px] font-manrope-bold uppercase tracking-widest mb-1">Actifs</Text>
            <Text className="text-foreground text-2xl font-manrope-bold">{accounts.filter(a => a.approved).length}</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <Text className="text-muted text-[10px] font-manrope-bold uppercase tracking-widest mb-1">Solde Total</Text>
            <Text className="text-foreground text-lg font-manrope-bold">{totalBalance.toLocaleString('fr-FR')} MAD</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 gap-2">
          {menuItems.map((item) => (
            <Pressable
              key={item.title}
              className="flex-row items-center gap-4 p-4 bg-surface rounded-xl border border-border active:bg-surface-hover"
              onPress={() => item.route ? router.push(item.route) : Alert.alert('Bientôt disponible', `${item.title} n'est pas encore disponible.`)}
            >
              <View className="size-10 rounded-lg bg-surface-hover items-center justify-center">
                <item.Icon size={20} color="#8B6F47" />
              </View>
              <Text className="text-foreground text-sm font-manrope-bold flex-1">{item.title}</Text>
              <AltArrowRight size={20} color="#8C7B6B" />
            </Pressable>
          ))}

          {/* Logout */}
          <Pressable
            className="flex-row items-center gap-4 p-4 mt-4 rounded-xl active:bg-[#C9544D]/10"
            onPress={handleLogout}
          >
            <View className="size-10 rounded-lg bg-[#C9544D]/10 items-center justify-center">
              <Logout2 size={20} color="#C9544D" />
            </View>
            <Text className="text-[#C9544D] text-sm font-manrope-bold flex-1">Se Déconnecter</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
