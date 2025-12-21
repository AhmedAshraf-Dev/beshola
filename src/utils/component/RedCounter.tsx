import React from "react";
import { I18nManager, Platform, Text, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { isRTL } from "../operation/isRTL";
import { theme } from "../../Theme";

const RedCounter = ({
  count,
  colors = { backgroundColor: "red", color: theme.body },
}) => {
  const className = "-end-2 -top-2";
  return (
    <View
      style={{
        position: "absolute",
        width: moderateScale(18),
        backgroundColor: colors.backgroundColor,
        height: moderateScale(18),
        borderRadius: moderateScale(9),
        justifyContent: "center",
        alignItems: "center",
      }}
      className={className}
    >
      <Text
        style={{
          fontSize: moderateScale(10),
          fontWeight: "bold",
          color: colors.color,
        }}
      >
        {count}
      </Text>
    </View>
  );
};

export default RedCounter;
