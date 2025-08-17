import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { Image } from "react-native";
export default function SignupForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

   const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("That email address is already in use. Please try another.");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.log(err);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

 if (pendingVerification) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={[styles.description, { marginBottom: 20 }]}>
          Enter the code sent to your email
        </Text>

        {error ? (
          <Text style={[styles.footerText, { color: "red", textAlign: "center" }]}>
            {error}
          </Text>
        ) : null}

        <TextInput
          value={code}
          placeholder="Enter verification code"
          placeholderTextColor="#6b7280"
          onChangeText={setCode}
          style={styles.input}
          keyboardType="number-pad"
        />

        <TouchableOpacity onPress={onVerifyPress} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Verify</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Didn't get the code?</Text>
          <TouchableOpacity onPress={onSignUpPress}>
            <Text style={styles.link}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

 return (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.card}>
      <Image 
                source={require("../../assets/images/tradelogo1.png")} 
                style={styles.logo}
                resizeMode="contain"
              />
      <Text style={styles.title}>Create an Account</Text>
      <Text style={[styles.description, { marginBottom: 40 }]}>
        Enter your details below to create your account
      </Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="your@example.com"
        placeholderTextColor="#6b7280"
        keyboardType="email-address"
        autoCapitalize="none"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#6b7280"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={[styles.footerText, { color: "red" }]}>{error}</Text> : null}

      <TouchableOpacity onPress={onSignUpPress} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>

    <Link href="/(legal)/terms-policy">
      <Text style={styles.policyText}>
        By signing up, you agree to our{" "}
        <Text style={styles.link}>Terms of Service</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </Link>
  </SafeAreaView>
);
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#000000",
  },
  card: {
    backgroundColor: "#000000",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#ffffffff",
  },
  description: {
    fontSize: 14,
    color: "#ffffffff",
    textAlign: "center",
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#f1f3f6ff",
  },
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
    marginTop: 10,
    backgroundColor: "#f7f8fbff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "black",
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  footerText: {
    marginTop: 2,
    fontSize: 14,
    color: "#6b7280",
  },
  link: {
    color: "#3b82f6",
    marginLeft: 4,
  },
  logo: {
  width: 100,
  height: 100,
  marginBottom: 32,
  alignSelf: 'center',
},

  policyText: {
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 12,
    color: "#6b7280",
  },
});
