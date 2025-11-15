import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import {
  TourGuideProvider,
  TourGuideZone,
  useTourGuideController,
} from "rn-tourguide";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const { canStart, start, stop } = useTourGuideController();

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem("@hasSeenGuide");
      if (!seen && canStart) {
        await AsyncStorage.setItem("@hasSeenGuide", "true");
        start();
      }
    })();
  }, [canStart, start]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎉 Welcome to My App!</Text>

      <TourGuideZone zone={1} text="Tap this button to explore new content!">
        <TouchableOpacity
          style={styles.button}
          onPress={() => alert("Exploring!")}
        >
          <Text style={styles.buttonText}>Explore</Text>
        </TouchableOpacity>
      </TourGuideZone>

      <TourGuideZone zone={2} text="Here you can access your profile page.">
        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={() => alert("Profile!")}
        >
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </TourGuideZone>

      <TourGuideZone zone={3} text="Tap here to finish the walkthrough.">
        <TouchableOpacity style={styles.finishButton} onPress={() => stop()}>
          <Text style={styles.finishText}>Finish</Text>
        </TouchableOpacity>
      </TourGuideZone>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <TourGuideProvider preventOutsideInteraction androidStatusBarVisible>
      <HomeScreen />
    </TourGuideProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F7FB",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  secondary: {
    backgroundColor: "#43A047",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  finishButton: {
    backgroundColor: "#F4511E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  finishText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
