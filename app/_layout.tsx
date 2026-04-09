import "@/global.css";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useSegments } from "expo-router";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import { useEffect } from "react";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file");
}

SplashScreen.preventAutoHideAsync();

function PostHogAuthSync() {
  const { isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const posthog = usePostHog();

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!posthog) return;

    if (!isSignedIn) {
      posthog.reset();
      return;
    }

    if (!isUserLoaded) return;

    const distinctId = user?.id;
    if (!distinctId) return;
    const email = user?.primaryEmailAddress?.emailAddress;
    posthog.identify(distinctId, email ? { email } : {});
  }, [
    isAuthLoaded,
    isSignedIn,
    isUserLoaded,
    user?.id,
    user?.primaryEmailAddress?.emailAddress,
    posthog,
  ]);

  return null;
}

function PostHogScreenTracking() {
  const segments = useSegments();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) return;

    const screen = `/${segments.join("/")}`;

    posthog.screen(screen);
    posthog.capture("Screen Viewed", { screen });
  }, [posthog, segments]);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const posthogApiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
  const posthogHost = process.env.EXPO_PUBLIC_POSTHOG_HOST;

  if (!posthogApiKey || !posthogHost) {
    console.warn(
      "PostHog is disabled: missing EXPO_PUBLIC_POSTHOG_API_KEY or EXPO_PUBLIC_POSTHOG_HOST",
    );
  }

  const app = (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <PostHogAuthSync />
      <PostHogScreenTracking />
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );

  if (!posthogApiKey || !posthogHost) {
    return app;
  }

  return (
    <PostHogProvider apiKey={posthogApiKey} options={{ host: posthogHost }}>
      {app}
    </PostHogProvider>
  );
}
