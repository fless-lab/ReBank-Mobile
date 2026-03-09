import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CardsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-white text-xl font-manrope-bold tracking-tight">My Cards</Text>
        </View>

        {/* Card Preview */}
        <View className="px-6 mb-8">
          <View className="w-full aspect-[1.58/1] bg-gradient-to-br rounded-2xl border border-slate-700/50 overflow-hidden p-6 justify-between" style={{ backgroundColor: '#1a2e23' }}>
            <View className="flex-row justify-between items-start">
              <MaterialCommunityIcons name="contactless-payment" size={32} color="#2edc6b" />
              <Text className="text-slate-500 font-manrope-bold text-xs uppercase tracking-widest">Elite Member</Text>
            </View>
            <View>
              <View className="h-8 w-12 bg-primary/20 rounded-md mb-6 items-center justify-center">
                <View className="h-4 w-8 bg-primary/40 rounded-sm" />
              </View>
              <Text className="text-white text-xl font-manrope-medium tracking-widest mb-1">
                •••• •••• •••• 8829
              </Text>
              <Text className="text-slate-500 text-[10px] uppercase tracking-widest font-manrope">
                Jameson Sterling
              </Text>
            </View>
          </View>
        </View>

        {/* Card Actions */}
        <View className="px-6">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Card Settings</Text>
          {[
            { icon: 'lock' as const, title: 'Lock Card', subtitle: 'Temporarily freeze your card' },
            { icon: 'credit-card-settings' as const, title: 'Card Limits', subtitle: 'Set spending limits' },
            { icon: 'contactless-payment' as const, title: 'Contactless', subtitle: 'Manage NFC payments' },
            { icon: 'pin' as const, title: 'Change PIN', subtitle: 'Update your card PIN' },
          ].map((item) => (
            <View key={item.title} className="flex-row items-center gap-4 p-4 bg-primary/10 rounded-xl mb-2">
              <View className="size-10 rounded-lg bg-primary/20 items-center justify-center">
                <MaterialCommunityIcons name={item.icon} size={20} color="#2edc6b" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-sm font-manrope-bold">{item.title}</Text>
                <Text className="text-slate-400 text-xs font-manrope">{item.subtitle}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#94a3b8" />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
