import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { RectButton, TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../../Theme";
import { AddItemToCart } from "../../kitchensink-components/cart/AddItemToCart";
import { isRTL } from "../operation/isRTL";
import Animated from "react-native-reanimated";

const deleteActionStyles = StyleSheet.create({
  actionButton: {
    backgroundColor: theme.error,
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
    width: 70,
    height: "100%",
  },
});
const SCREEN_WIDTH = Dimensions.get("window").width;

export const RenderDeleteAction = (progress, dragX, deleteItem) => {
  return (
    <View
      style={[
        deleteActionStyles.actionButton,
        isRTL() && { left: 1, position: "absolute" }, // apply left only in LTR
      ]}
    >
      <Animated.View
      // style={{ transform: [{ translateX: trans }] }}
      >
        <TouchableOpacity
          onPress={deleteItem}
          className={"px-2 text-body  rounded-full py-2"}
        >
          <AntDesign name="delete" size={18} className="!text-body" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};
