import React from "react";
import { StyleSheet, View, Text } from "react-native";
import StepIndicator from "react-native-step-indicator";
import { theme } from "../../Theme";

const pickupIcons = ["🧾", "👨‍🍳", "🛍", "🏍"];
// const deliveryIcons = ["🧾", "🛠", "🚚", "✅"];
// You can customize these icons based on each label
const statusIcons = [
  "🧾",
  "🛠",
  "📦",
  "🚗",
  "🚚",
  "✅",

  // Header flow
  // Welcome: "👋",
  // Language: "🌐",
  // Intro: "📖",
];
// const statusIcons = {
//   // Order flow
//   ordered: "🧾", // You can change this to 🛒 or 📝 if preferred
//   Preparing: "🛠",
//   Prepared: "📦",
//   "Picked Up": "🚗",
//   "Out for Delivery": "🚚",
//   Delivered: "✅",

//   // Header flow
//   Welcome: "👋",
//   Language: "🌐",
//   Intro: "📖",
// };
const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 35,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: theme.accentHover,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: theme.accentHover,
  stepStrokeUnFinishedColor: theme.primary,
  separatorFinishedColor: theme.accentHover,
  separatorUnFinishedColor: theme.primary,
  stepIndicatorFinishedColor: theme.accentHover,
  stepIndicatorUnFinishedColor: theme.body,
  stepIndicatorCurrentColor: theme.body,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: theme.accentHover,
  stepIndicatorLabelFinishedColor: theme.body,
  stepIndicatorLabelUnFinishedColor: theme.primary,
  labelColor: theme.primary,
  labelSize: 12,
  currentStepLabelColor: theme.accentHover,
};

const StepHeader = ({
  currentPosition = 0,
  labels,
  customKey,
  withIcons = true,
}) => {
  // detect mode by number of steps
  const isPickup = labels.length === 4; // 4 items (incl. empty string) => pickup
  const icons = pickupIcons;
  const renderStepIndicator = ({ position }) => {
    const icon = icons[position] || position;
    return <Text style={{ fontSize: 16 }}>{icon}</Text>;
  };

  return (
    <View style={styles.container} key={customKey}>
      <StepIndicator
        customStyles={customStyles}
        direction="horizontal"
        currentPosition={currentPosition}
        labels={labels.filter((item) => item.length > 0)}
        stepCount={labels.filter((item) => item.length > 0).length}
        renderStepIndicator={withIcons && renderStepIndicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    width: "100%",
    backgroundColor: theme.body,
  },
});

export default StepHeader;
