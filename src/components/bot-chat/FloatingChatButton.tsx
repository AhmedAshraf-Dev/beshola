import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../Theme";
import RedCounter from "../../utils/component/RedCounter";
import { isRTL } from "../../utils/operation/isRTL";

const FloatingChatButton = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "absolute",
        bottom: 50,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.accent,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: theme.overlay,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 999,
        right: !isRTL() ? 20 : undefined,
        left: isRTL() ? 20 : undefined,
      }}
    >
      <Ionicons name="chatbubble-ellipses" size={28} color={theme.body} />
      <RedCounter
        count={3}
        colors={{ backgroundColor: theme.border, color: theme.text }}
      />
    </Pressable>
  );
};

export default FloatingChatButton;
