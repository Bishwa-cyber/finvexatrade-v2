import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import {  Alert } from "react-native";
import  {styles } from "../../assets/styles/auth.styles.js"; 
import { Image } from "react-native";
export default function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.log("Further steps required:", signInAttempt);
      }
    } catch (err) {
      console.error("Sign-in error:", err);
    }
  };

  const handleOAuthSignIn = async (provider) => {
  if (!isLoaded) return;

  try {
    if (Platform.OS === "web") {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_" + provider,
      });
    } else {
      Alert.alert(
        "Not Supported",
        "Social login via Apple or Google is only supported on web at the moment."
      );
    }
  } catch (err) {
    console.error("OAuth sign-in error:", err);
  }
};
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.header}>
              <Image 
                source={require("../../assets/images/tradelogo1.png")} 
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.description}>
                Login with your Apple or Google account
              </Text>
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => handleOAuthSignIn("apple")}
              >
                <Ionicons name="logo-apple" size={20} color="#ffffffff" />
                <Text style={styles.outlineButtonText}>Login with Apple</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => handleOAuthSignIn("google")}
              >
                <AntDesign name="google" size={20} color="#ffffffff" />
                <Text style={styles.outlineButtonText}>Login with Google</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@example.com"
                placeholderTextColor="#747272ff"
                keyboardType="email-address"
                value={emailAddress}
                onChangeText={setEmailAddress}
                autoCapitalize="none"
              />

              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/forgot-password")} >
               <Text style={[styles.link]}>Forgot your password?</Text>
              </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#747272ff"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
               
              <View style={[styles.labelRow,{ textAlign: "right" }]}>
             
            </View>
             
            </View>
            
            <TouchableOpacity
              onPress={onSignInPress}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
                <Text style={styles.link}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Link href="/(legal)/terms-policy" asChild>
            <TouchableOpacity>
              <Text style={styles.policyText}>
                By signing up, you agree to our{" "}
                <Text style={styles.link}>Terms of Service</Text> and{" "}
                <Text style={styles.link}>Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


