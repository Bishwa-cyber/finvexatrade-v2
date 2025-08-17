import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TermsPolicyPage: React.FC = () => {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<"terms" | "privacy" | null>(null);

  const toggleSection = (section: "terms" | "privacy") => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backButtonText}></Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.pageTitle}>Terms of Service & Privacy Policy</Text>

        <TouchableOpacity onPress={() => toggleSection("terms")} style={styles.accordionHeader}>
          <Text style={styles.accordionTitle}>Terms of Service</Text>
          <Ionicons
            name={activeSection === "terms" ? "chevron-up" : "chevron-down"}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>

        {activeSection === "terms" && (
          <View style={styles.accordionContent}>
            <Text style={styles.accordionText}>
              1. Introduction: By using our app, you agree to comply with all applicable laws and these Terms of Service.
            </Text>
            <Text style={styles.accordionText}>
              2. Account Responsibility: You are responsible for maintaining the confidentiality of your account credentials.
            </Text>
            <Text style={styles.accordionText}>
              3. Prohibited Use: You agree not to misuse the services or assist others in doing so.
            </Text>
            <Text style={styles.accordionText}>
              4. Changes: We reserve the right to update these terms at any time without prior notice.
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={() => toggleSection("privacy")} style={styles.accordionHeader}>
          <Text style={styles.accordionTitle}>Privacy Policy</Text>
          <Ionicons
            name={activeSection === "privacy" ? "chevron-up" : "chevron-down"}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>

        {activeSection === "privacy" && (
          <View style={styles.accordionContent}>
            <Text style={styles.accordionText}>
              1. Data Collection: We collect information such as email, name, and device information to provide our service.
            </Text>
            <Text style={styles.accordionText}>
              2. Data Usage: Your data is used to enhance app functionality, improve user experience, and ensure security.
            </Text>
            <Text style={styles.accordionText}>
              3. Third-Party Services: We may share necessary information with third-party services for authentication and analytics.
            </Text>
            <Text style={styles.accordionText}>
              4. Data Retention: We retain your personal data only for as long as necessary.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TermsPolicyPage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000ff",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  backButton: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#000000",
  },
  backButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  accordionContent: {
    paddingVertical: 10,
  },
  accordionText: {
    color: "#ddd",
    fontSize: 14,
    marginBottom: 8,
  },
});