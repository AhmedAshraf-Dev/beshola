import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../Theme";
import { isRTL } from "../../utils/operation/isRTL";

const ChatHeader = ({ activeRoom, setActiveRoom, setOpen }) => {
  return (
    <View
      style={{
        padding: 12,
        backgroundColor: theme.accent,
        flexDirection: isRTL() ? "row-reverse" : "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text style={{ color: theme.body, fontSize: 16, fontWeight: "600" }}>
        {activeRoom ? activeRoom : "Chat Rooms"}
      </Text>

      <Pressable
        onPress={() => {
          if (activeRoom) setActiveRoom(null);
          else setOpen(false);
        }}
      >
        <Ionicons name="close" size={22} color={theme.body} />
      </Pressable>
    </View>
  );
};

export default ChatHeader;
