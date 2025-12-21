import React from "react";
import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../Theme";
import { isRTL } from "../../utils/operation/isRTL";

const ChatInput = ({ input, setInput, sendMessage }) => {
  return (
    <View
      style={{
        flexDirection: isRTL() ? "row-reverse" : "row",
        padding: 8,
        borderTopWidth: 1,
        borderColor: theme.border,
      }}
    >
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type a message…"
        onSubmitEditing={sendMessage}
        returnKeyType="send"
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 20,
          paddingHorizontal: 12,
          height: 40,
          color: theme.text,
        }}
      />
      <Pressable
        onPress={sendMessage}
        style={{
          marginLeft: isRTL() ? 0 : 8,
          marginRight: isRTL() ? 8 : 0,
          justifyContent: "center",
        }}
      >
        <Ionicons name="send" size={24} color={theme.accent} />
      </Pressable>
    </View>
  );
};

export default ChatInput;
