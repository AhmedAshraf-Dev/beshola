import React from "react";
import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../Theme";
import { isRTL } from "../../utils/operation/isRTL";

const roomsList = [
  { id: "support", name: "Support", icon: "help-circle" },
  { id: "sales", name: "Sales", icon: "pricetag" },
  { id: "tech", name: "Technical", icon: "construct" },
];

const ChatRoomsList = ({ openRoom }) => {
  return (
    <View style={{ flex: 1, padding: 12 }}>
      {roomsList.map((r) => (
        <Pressable
          key={r.id}
          onPress={() => openRoom(r.id)}
          style={{
            flexDirection: isRTL() ? "row-reverse" : "row",
            alignItems: "center",
            padding: 12,
            backgroundColor: theme.border,
            borderRadius: 12,
            marginBottom: 10,
          }}
        >
          <Ionicons
            name={r.icon}
            size={22}
            color={theme.text}
            style={{
              marginRight: isRTL() ? 0 : 10,
              marginLeft: isRTL() ? 10 : 0,
            }}
          />
          <Text style={{ color: theme.text, fontSize: 15 }}>{r.name}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default ChatRoomsList;
