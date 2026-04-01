import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home2, Wallet2, UserCircle, TransferHorizontal } from '@solar-icons/react-native/BoldDuotone';

function TabIcon({ Icon, color, size }: { Icon: React.ComponentType<{size: number; color: string}>; color: string; size: number }) {
  return <Icon size={size} color={color} />;
}

export default function MainLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 12) : insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8E0D8',
          borderTopWidth: 1,
          paddingBottom: bottomPadding,
          paddingTop: 10,
          height: 64 + bottomPadding,
        },
        tabBarActiveTintColor: '#8B6F47',
        tabBarInactiveTintColor: '#B5A99D',
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Manrope-Bold',
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <TabIcon Icon={Home2} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: 'Comptes',
          tabBarIcon: ({ color, size }) => <TabIcon Icon={Wallet2} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          title: 'Transferts',
          tabBarIcon: ({ color, size }) => <TabIcon Icon={TransferHorizontal} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <TabIcon Icon={UserCircle} color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
