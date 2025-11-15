import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export default function ErrorScreen() {
  const navigation = useNavigation();
  const [seconds, setSeconds] = useState(10);
  const [disabled, setDisabled] = useState(true);
  const localization = useSelector((state) => state.localization.localization);

  useEffect(() => {
    if (seconds === 0) {
      setDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const handleNavigate = () => {
    navigation.replace("Home"); // ✅ Change if needed
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{localization.ErrorScreen.title}</Text>
      <Text style={styles.subtitle}>{localization.ErrorScreen.subtitle}</Text>
      <Text style={styles.message}>{localization.ErrorScreen.description}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={
            disabled
              ? localization.ErrorScreen.buttonText.replace("{sec}", seconds)
              : localization.ErrorScreen.goBackButton
          }
          onPress={handleNavigate}
          disabled={disabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignSelf: "center",
    width: "90%",
    borderRadius: 8,
  },
  title: {
    color: "#dc2626",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  message: {
    color: "#1f2937",
    fontSize: 15,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 24,
  },
});
