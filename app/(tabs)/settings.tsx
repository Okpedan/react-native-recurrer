import images from "@/constants/images";
import { useAuth, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const posthog = usePostHog();

  const handleSignOut = () => {
    posthog?.capture("Auth Sign Out Clicked");
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => posthog?.capture("Auth Sign Out Canceled"),
      },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          posthog?.capture("Auth Sign Out Confirmed");
          try {
            await signOut();
            router.replace("/(auth)/sign-in");
          } catch (error) {
            posthog?.capture("Auth Sign Out Failed");
            console.error("Sign out failed:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const avatarUri = user?.imageUrl;
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}`
    : (user?.username ?? "Account");
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
          <Text className="home-user-name" numberOfLines={1}>
            {displayName}
          </Text>
          {email ? (
            <Text className="auth-helper" numberOfLines={1}>
              {email}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Sign out button */}
      <TouchableOpacity
        className="items-center rounded-2xl border border-destructive/30 bg-destructive/10 py-4"
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <Text className="text-base font-sans-bold text-destructive">
          Sign out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;
