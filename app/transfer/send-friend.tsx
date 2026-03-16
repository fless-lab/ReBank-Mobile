import { Button, ScreenHeader } from '@/components/ui';
import { ContactsService } from '@/lib/api/contacts';
import { TransfersService } from '@/lib/api/transfers';
import { Contact } from '@/lib/mockDb';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SendFriendScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [emailSearch, setEmailSearch] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [step, setStep] = useState<'select' | 'amount'>('select');

  useEffect(() => {
    ContactsService.getContacts().then(c => {
      setContacts(c);
      setPageLoading(false);
    });
  }, []);

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(emailSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(emailSearch.toLowerCase())
  );

  const handleSend = async () => {
    if (!selected) return;
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      const res = await TransfersService.sendToFriend(num, selected.name);
      router.push({
        pathname: '/transfer/success' as any,
        params: { amount: num.toFixed(2), name: selected.name, txId: res.transaction.id, type: 'friend' }
      });
    } catch (e: any) {
      Alert.alert('Transfer Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#2edc6b" />
      </SafeAreaView>
    );
  }

  if (step === 'amount' && selected) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <ScreenHeader title={`Send to ${selected.name.split(' ')[0]}`} onBack={() => setStep('select')} />
        <View className="flex-1 items-center justify-center px-6">
          <View className="size-20 rounded-full bg-primary/20 items-center justify-center mb-4">
            <Text className="text-primary text-2xl font-manrope-bold">{selected.name.charAt(0)}</Text>
          </View>
          <Text className="text-white text-lg font-manrope-bold mb-1">{selected.name}</Text>
          <Text className="text-slate-400 text-sm font-manrope mb-8">{selected.email}</Text>

          <View className="flex-row items-center mb-12">
            <Text className="text-primary text-5xl font-manrope-medium mr-2">$</Text>
            <TextInput
              className="text-white text-6xl font-manrope-bold min-w-[150px] text-center"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="rgba(255,255,255,0.2)"
              autoFocus
            />
          </View>
          <View className="w-full">
            <Button
              title={`Send $${amount || '0.00'}`}
              variant="primary"
              onPress={handleSend}
              loading={loading}
              disabled={!amount || parseFloat(amount) <= 0}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScreenHeader title="Send to Friend" />
      <View className="px-6 pt-4">
        {/* Search */}
        <View className="flex-row items-center bg-primary/5 rounded-xl border border-primary/10 px-4 h-12 mb-6">
          <MaterialCommunityIcons name="magnify" size={20} color="rgba(46, 220, 107, 0.4)" />
          <TextInput
            className="flex-1 text-white text-sm font-manrope ml-2"
            placeholder="Search by name or email..."
            placeholderTextColor="rgba(46, 220, 107, 0.3)"
            value={emailSearch}
            onChangeText={setEmailSearch}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        <Text className="text-slate-400 text-xs font-manrope-bold uppercase tracking-widest mb-3">Contacts</Text>
        {filteredContacts.map(contact => (
          <Pressable
            key={contact.id}
            className="flex-row items-center gap-3 p-4 bg-primary/5 rounded-xl mb-2 active:bg-primary/10"
            onPress={() => { setSelected(contact); setStep('amount'); }}
          >
            <View className="size-12 rounded-full bg-primary/20 items-center justify-center">
              <Text className="text-primary text-lg font-manrope-bold">{contact.name.charAt(0)}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-manrope-bold">{contact.name}</Text>
              <Text className="text-slate-500 text-xs font-manrope">{contact.email}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#94a3b8" />
          </Pressable>
        ))}
        {filteredContacts.length === 0 && (
          <Text className="text-slate-500 text-sm font-manrope text-center mt-8">No contacts found</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
