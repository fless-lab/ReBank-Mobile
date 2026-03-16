import { CardsService } from '@/lib/api/cards';
import { BankCard } from '@/lib/mockDb';
import { getUserProfile } from '@/utils/userStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, ScrollView, Switch, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const CARD_WIDTH = Dimensions.get('window').width - 48;

export default function CardsScreen() {
  const [cards, setCards] = useState<BankCard[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [pageLoading, setPageLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        CardsService.getCards(),
        getUserProfile(),
      ]).then(([c, profile]) => {
        setCards(c);
        setHolderName(profile.name);
        setPageLoading(false);
      });
    }, [])
  );

  const card = cards[activeIdx] || null;

  const handleToggleLock = async () => {
    if (!card) return;
    const updated = await CardsService.toggleCardLock(card.id);
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#2edc6b" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1" contentContainerClassName="pb-8">
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-white text-xl font-manrope-bold tracking-tight">My Cards</Text>
        </View>

        {/* Card Carousel */}
        <FlatList
          data={cards}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
            setActiveIdx(idx);
            setShowDetails(false);
          }}
          renderItem={({ item }) => (
            <View
              style={{ width: CARD_WIDTH }}
              className="aspect-[2/1] rounded-2xl border border-slate-700/50 overflow-hidden p-6 justify-between"
              {...{ style: { width: CARD_WIDTH, backgroundColor: item.type === 'visa' ? '#1a2e23' : '#1a1a2e' } }}
            >
              <View className="flex-row justify-between items-start">
                <MaterialCommunityIcons name="contactless-payment" size={32} color={item.type === 'visa' ? '#2edc6b' : '#818cf8'} />
                <Text className="text-slate-500 font-manrope-bold text-xs uppercase tracking-widest">
                  {item.type === 'visa' ? 'VISA' : 'MASTERCARD'} • {item.isLocked ? 'LOCKED' : 'ACTIVE'}
                </Text>
              </View>
              <View>
                <View className="h-8 w-12 bg-primary/20 rounded-md mb-6 items-center justify-center">
                  <View className="h-4 w-8 bg-primary/40 rounded-sm" />
                </View>
                <Text className="text-white text-xl font-manrope-medium tracking-widest mb-1">
                  {showDetails && cards[activeIdx]?.id === item.id
                    ? item.fullNumber
                    : `•••• •••• •••• ${item.last4}`}
                </Text>
                <View className="flex-row justify-between items-center">
                  <Text className="text-slate-500 text-[10px] uppercase tracking-widest font-manrope">
                    {holderName}
                  </Text>
                  {showDetails && cards[activeIdx]?.id === item.id && (
                    <Text className="text-slate-400 text-xs font-manrope-semibold">
                      EXP {item.expiry}  CVV {item.cvv}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item.id}
        />

        {/* Page Indicator */}
        <View className="flex-row justify-center gap-2 mt-4 mb-2">
          {cards.map((_, idx) => (
            <View key={idx} className={`h-2 rounded-full ${idx === activeIdx ? 'w-6 bg-primary' : 'w-2 bg-slate-700'}`} />
          ))}
        </View>

        {/* Card Balance */}
        {card && (
          <View className="mx-6 mt-4 mb-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <Text className="text-slate-400 text-xs font-manrope-bold uppercase tracking-widest mb-1">Card Balance</Text>
            <Text className="text-white text-2xl font-manrope-bold">
              ${card.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        )}

        {/* Card Settings */}
        <View className="px-6">
          <Text className="text-white text-lg font-manrope-bold tracking-tight mb-4">Card Settings</Text>

          {/* Show Details Toggle */}
          <Pressable
            className="flex-row items-center gap-4 p-4 bg-primary/10 rounded-xl mb-2 active:bg-primary/20"
            onPress={() => setShowDetails(!showDetails)}
          >
            <View className="size-10 rounded-lg bg-primary/20 items-center justify-center">
              <MaterialCommunityIcons name={showDetails ? 'eye-off' : 'eye'} size={20} color="#2edc6b" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-manrope-bold">
                {showDetails ? 'Hide Card Details' : 'Show Card Details'}
              </Text>
              <Text className="text-slate-400 text-xs font-manrope">Card number, expiry & CVV</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#94a3b8" />
          </Pressable>

          {/* Lock Toggle */}
          <View className="flex-row items-center gap-4 p-4 bg-primary/10 rounded-xl mb-2">
            <View className="size-10 rounded-lg bg-primary/20 items-center justify-center">
              <MaterialCommunityIcons name="lock" size={20} color="#2edc6b" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-manrope-bold">Lock Card</Text>
              <Text className="text-slate-400 text-xs font-manrope">Temporarily freeze your card</Text>
            </View>
            <Switch
              value={card?.isLocked || false}
              onValueChange={handleToggleLock}
              trackColor={{ false: '#334155', true: '#2edc6b' }}
              thumbColor="#fff"
            />
          </View>

          {[
            { icon: 'credit-card-settings' as const, title: 'Card Limits', subtitle: `$${card?.limit.toLocaleString() || 0} daily limit` },
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
