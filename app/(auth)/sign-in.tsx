import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SignIn = () => {
  const { signIn } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!signIn) return;
    setLoading(true);
    setErrorMsg("");

    try {
      await signIn.create({ identifier: emailAddress });
      await signIn.password({ password });

      if (signIn.status === "complete") {
        await signIn.finalize({ navigate: () => router.replace("/(tabs)") });
      } else {
        console.error("Sign-in failed", { status: signIn.status });
        setErrorMsg("Sign-in failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Sign-in error", {
        code: err?.errors?.[0]?.code,
        message: err?.errors?.[0]?.message,
      });
      setErrorMsg(
        err.errors?.[0]?.message || "An error occurred during sign in.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <ScrollView className="auth-scroll" showsVerticalScrollIndicator={false}>
        <View className="auth-content">
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <Image
                source={require("@/assets/icons/logo.png")}
                style={{ width: 64, height: 64 }}
                resizeMode="contain"
              />
            </View>
            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">
              Sign in to continue managing your subscriptions
            </Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              {errorMsg ? <Text className="auth-error">{errorMsg}</Text> : null}

              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  className="auth-input"
                  onChangeText={setEmailAddress}
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  secureTextEntry={true}
                  className="auth-input"
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity
                className={`auth-button ${loading ? "auth-button-disabled" : ""}`}
                onPress={onSignInPress}
                disabled={loading}
              >
                <Text className="auth-button-text">
                  {loading ? "Signing in..." : "Sign in"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Recurrer?</Text>
              <Link href="/(auth)/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="auth-link">Create an account</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
