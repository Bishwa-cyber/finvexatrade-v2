import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#000000",
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: "#000000ff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 4,
  },
  header: {
    marginBottom: 20,
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
  socialButtons: {
    marginBottom: 20,
  },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#444547ff",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "#171718ff",
  },
  outlineButtonText: {
    fontWeight: "600",
    color: "#ffffffff",
    marginLeft: 8,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: "#6b7280",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#f1f3f6ff",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 14,
    color: "#6b7280",
  },
  link: {
    color: "#3b82f6",
  },
  policyText: {
  position: "absolute",
  bottom: -25, // Adjust based on your bottom navigation height
  left: 0,
  right: 0,
  textAlign: "center",
  fontSize: 12,
  color: "#6b7280",
},
// Add to your auth.styles.js
buttonDisabled: {
  opacity: 0.6,
},

logo: {
  width: 100,
  height: 100,
  marginBottom: 32,
  alignSelf: 'center',
},

});
