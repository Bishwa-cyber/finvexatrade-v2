import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet } from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function VerifyResetCodePage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const { email, emailAddressId } = useLocalSearchParams();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

 const handleVerify = async () => {
  if (!isLoaded) {
    Alert.alert("Clerk not ready. Please try again.");
    return;
  }

  if (!emailAddressId) {
    Alert.alert("Missing Information", "Email address ID is required.");
    return;
  }

  if (!code) {
    Alert.alert("Please enter the verification code.");
    return;
  }

  try {
    setLoading(true);

    const attempt = await signIn.attemptFirstFactor({
      strategy: "reset_password_email_code",
      code,
      emailAddressId,
    });

    if (attempt.status === "needs_new_password") {
      router.push({
        pathname: "/(auth)/reset-password",
        params: {
          email,
          emailAddressId,
        },
      });
    } else if (attempt.status === "complete") {
      Alert.alert("You are already signed in.");
      router.replace("/");
    } else {
      console.log("Unexpected status:", attempt.status);
      Alert.alert("Unexpected Status", "Please try again.");
    }
  } catch (err) {
    console.error("Verification error:", err);
    Alert.alert("Verification Failed", "Invalid code or expired. Try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify Reset Code</Text>
        <Text style={styles.description}>Enter the code sent to {email}</Text>

        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Enter Code"
          style={styles.input}
          placeholderTextColor="#999"
        />

        <TouchableOpacity onPress={handleVerify} style={styles.button} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Verifying..." : "Verify Code"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  container: { width: "90%", padding: 20 },
  title: { fontSize: 22, color: "#fff", marginBottom: 10 },
  description: { color: "#ccc", marginBottom: 20 },
  input: {
    height: 50,
    borderColor: "#444",
    borderWidth: 1,
    color: "#fff",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#fff",
    padding: 15,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: { color: "#000", fontWeight: "600" },
});
