import React, { useState } from "react";
import { View, Text, Platform } from "react-native";
import { isRTL } from "../../utils/operation/isRTL";

const DiagonalRibbon = ({
  diagonalKey,
  text,
  color,
  txtColor,
  parentWidth,
  parentHeight,
}) => {
  const [labelWidth, setLabelWidth] = useState(0);
  const [labelHeight, setLabelHeight] = useState(0);
  if (!parentWidth || !parentHeight) return null;

  // Calculate offset based on parent dimensions (diagonal proportion)
  const diagonal = Math.sqrt(parentWidth ** 2 + parentHeight ** 2);
  const offset = diagonal * 0.025; // 5% of diagonal
  const isWeb = Platform.OS === "web";
  //492.1320571383589 == -40 624.79836747546 21.867942861641104 562 96
  return (
    <View
      key={diagonalKey}
      onLayout={(e) => {
        setLabelWidth(e.nativeEvent.layout.width);
        setLabelHeight(e.nativeEvent.layout.height);
      }}
      style={{
        position: "absolute",
        top: 0,

        left: isWeb || isRTL() ? 0 : "100%",
        zIndex: 999,

        transform: [
          {
            // Horizontal translation depends on RTL
            translateX: isWeb
              ? !isRTL()
                ? parentWidth - labelWidth / 2 - offset
                : -(labelWidth / 2) + labelHeight / 2
              : isRTL()
                ? -(parentWidth - labelWidth / 2 - offset)
                : -(labelWidth / 2) + labelHeight,
          },
          // {
          //   // Vertical translation along diagonal
          //   translateY: offset,
          // },
          {
            rotate: isRTL() ? "-45deg" : "45deg",
          },
        ],

        backgroundColor: color,
        paddingHorizontal: 20,
        paddingVertical: 4,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 12,
          textAlign: "center",
          color: txtColor,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default DiagonalRibbon;
