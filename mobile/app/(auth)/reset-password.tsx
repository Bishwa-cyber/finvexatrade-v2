import { useSignIn } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";

export default function ResetPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const { email } = useLocalSearchParams();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!isLoaded) return;
    if (!newPassword) {
      Alert.alert("Please enter your new password.");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn.resetPassword({ password: newPassword });

      if (result.status === "complete") {
        Alert.alert("Password Updated", "You can now log in with your new password.");
        router.replace("/(auth)/sign-in");
      } else {
        Alert.alert("Error", "Unexpected status. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Reset Failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#747272"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TouchableOpacity
        onPress={handleResetPassword}
        style={styles.primaryButton}
        disabled={loading}
      >
        <Text style={styles.primaryButtonText}>
          {loading ? "Updating..." : "Update Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#000" },
  title: { fontSize: 22, color: "#fff", fontWeight: "700", marginBottom: 20 },
  input: {
    height: 44,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#444547ff",
    borderRadius: 8,
    backgroundColor: "#171718ff",
    color: "#fff",
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: "#f7f8fbff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: { color: "black", fontWeight: "600" },
});
