import { StyleSheet } from "react-native";
import { theme } from "../../Theme";

export const styles = StyleSheet.create({
  loadScreenOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: theme.body, // or "rgba(255,255,255,0.8)" for transparent overlay
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    marginTop: 10,
    fontSize: 12,
    color: "#888", // light gray
    textAlign: "center",
  },
  network: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    zIndex: 1000,
    elevation: 5, // Android shadow
  },
  networktText: {
    marginLeft: 6,
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: theme.body,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  splash: {
    flex: 1,
    backgroundColor: "#F9FAFB", // light background
  },
  networkContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    zIndex: 1000,
    elevation: 5, // Android shadow
  },
  networkText: {
    marginLeft: 6,
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  splashBody: {
    flex: 1,
    justifyContent: "center", // center vertically
    alignItems: "center", // center horizontally
    paddingHorizontal: 20,
    maxWidth: 600, // limit body width
    alignSelf: "center", // center the body container
    width: "100%",
  },

  splashFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#E5E7EB", // light divider line
    backgroundColor: "#fff",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: theme.primary,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: theme.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: theme.body,
    fontSize: 16,
  },
  skipText: {
    color: theme.primary,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  videoContainer: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 30,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  modernButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
