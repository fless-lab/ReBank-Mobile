import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 items-center justify-center p-6">
        <View className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
          <Text className="text-white text-4xl font-manrope font-extrabold tracking-tight mb-2">
            ReBank
          </Text>
          <Text className="text-slate-400 text-lg">
            Votre application est prête avec Tailwind CSS.
          </Text>
          <View className="h-1 w-12 bg-blue-500 rounded-full mt-6" />
        </View>
      </View>
    </SafeAreaView>
  );
}
