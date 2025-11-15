import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { ImageBackground } from "../../../../components/ui";
import { scale } from "react-native-size-matters";
import { theme } from "../../../Theme";

export default function WithImageBG({ children }) {
  return (
    <ImageBackground
      source={require("../../../../assets/display/VoucherCard.jpg")}
      style={styles.card}
      imageStyle={styles.image}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Centered Voucher Code */}
        <View style={styles.codeContainer}>{children}</View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  card: {
    width: 320,
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    resizeMode: "cover",
  },
  overlay: {
    // backgroundColor: "rgba(0, 0, 0, 0.35)",

    padding: 20,
    borderRadius: 16,
    width: "100%",
    height: "100%",
    justifyContent: "space-between", // This separates top and bottom elements
  },
  codeContainer: {
    // marginTop: 60,
    flex: 1,
    color: theme.body,
    justifyContent: "center",
    alignItems: "center",
  },
  code: {
    fontSize: scale(6),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  dateContainer: {
    marginTop: 50,
    alignItems: "center",
    paddingBottom: 10,
  },
  date: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
