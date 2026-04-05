import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>

      <Link href="/onboarding" className="border rounded-full p-4 bg-accent">
        <Text className="text-xl font-bold text-white">
          Go to Onboarding
        </Text>
      </Link>

      <Link href="/(auth)/sign-in" className="border rounded-full p-4 bg-accent">
        <Text className="text-xl font-bold text-white">
          Sign In
        </Text>
      </Link>

      <Link href="/(auth)/sign-up" className="border rounded-full p-4 bg-accent">
        <Text className="text-xl font-bold text-white">
          Sign Up
        </Text>
      </Link>

      <Link href="/(tabs)/settings" className="border rounded-full p-4 bg-accent">
        <Text className="text-xl font-bold text-white">
          Go to Settings
        </Text>
      </Link>


    </SafeAreaView>
  );
}