import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

export default function ForgotPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

 const handleResetPassword = async () => {
  if (!emailAddress) {
    Alert.alert("Please enter your email address.");
    return;
  }
  if (!isLoaded) return;

  try {
    setIsSubmitting(true);

    const signInAttempt = await signIn.create({
      identifier: emailAddress,
      strategy: "reset_password_email_code",
    });

    const firstFactor = signInAttempt.supportedFirstFactors?.[0];

    if (!firstFactor?.emailAddressId) {
      Alert.alert("Error", "Missing email address ID from Clerk.");
      console.error("Missing emailAddressId:", signInAttempt);
      return;
    }

    router.push({
      pathname: "/(auth)/verify-reset-code",
      params: {
        email: emailAddress,
        emailAddressId: firstFactor.emailAddressId,
      },
    });
  } catch (error) {
    console.error("Password reset error:", error);
    Alert.alert("Error", "Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginBottom: 20 }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.description}>
                Enter your email to receive reset instructions
              </Text>
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
            </View>

            <TouchableOpacity
              onPress={handleResetPassword}
              style={styles.primaryButton}
              disabled={isSubmitting}
            >
              <Text style={styles.primaryButtonText}>
                {isSubmitting ? "Sending..." : "Send Reset Code"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#000000" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 16 },
  card: {
    backgroundColor: "#000000",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#000000ff",
  },
  header: { marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center", color: "#fff" },
  description: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, marginBottom: 8, color: "#f1f3f6ff" },
  input: {
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#444547ff",
    borderRadius: 8,
    backgroundColor: "#171718ff",
    marginBottom: 12,
    color: "#fff",
  },
  primaryButton: {
    backgroundColor: "#f7f8fbff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: { color: "black", fontWeight: "600" },
});
