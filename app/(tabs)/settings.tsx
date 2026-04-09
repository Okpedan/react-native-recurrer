import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/(auth)/sign-in");
          },
        },
      ]
    );
  };

  const avatarUri = user?.imageUrl;
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : user?.username ?? "Account";
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      {/* Header */}
      <Text className="list-title mb-6">Settings</Text>

      {/* User card */}
      <View className="auth-card mb-6 flex-row items-center gap-4">
        <Image
          source={avatarUri ? { uri: avatarUri } : images.avatar}
          className="home-avatar"
        />
        <View className="min-w-0 flex-1">
          <Text className="home-user-name" numberOfLines={1}>{displayName}</Text>
          {email ? (
            <Text className="auth-helper" numberOfLines={1}>{email}</Text>
          ) : null}
        </View>
      </View>

      {/* Sign out button */}
      <TouchableOpacity
        className="items-center rounded-2xl border border-destructive/30 bg-destructive/10 py-4"
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <Text className="text-base font-sans-bold text-destructive">Sign out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;