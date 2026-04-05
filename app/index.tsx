import "@/global.css";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background ">
      <Text className="text-xl font-bold text-primary">
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
    </View>
  );
}