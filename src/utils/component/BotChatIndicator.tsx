import React, { useState } from "react";
import {
  Pressable,
  View,
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  SlideInUp,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { isRTL } from "../operation/isRTL";
import { theme } from "../../Theme";

const BotChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! How can I help you today?", fromBot: true },
  ]);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), text: input, fromBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate bot typing
    setBotTyping(true);
    setTimeout(() => {
      const botMsg = {
        id: Date.now().toString(),
        text: "Okay, here's what I found for you…",
        fromBot: true,
      };
      setMessages((prev) => [...prev, botMsg]);
      setBotTyping(false);
    }, 1200);
  };

  return (
    <>
      {open && (
        <Animated.View
          entering={SlideInUp.duration(300)}
          exiting={SlideOutDown.duration(300)}
          style={{
            position: "absolute",
            bottom: 120,
            right: isRTL() ? undefined : 20,
            left: isRTL() ? 20 : undefined,
            width: 320,
            height: 420,
            borderRadius: 16,
            backgroundColor: theme.card,
            shadowColor: theme.overlay,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 6,
            zIndex: 999,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 12,
              backgroundColor: theme.accent,
            }}
          >
            <Text
              style={{ color: theme.body, fontSize: 16, fontWeight: "600" }}
            >
              Support Bot
            </Text>
            <Pressable onPress={() => setOpen(false)}>
              <Ionicons name="close" size={22} color={theme.body} />
            </Pressable>
          </View>

          {/* Messages */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 12 }}
              renderItem={({ item }) => (
                <Animated.View
                  entering={FadeIn.delay(50).duration(200)}
                  exiting={FadeOut.duration(100)}
                  style={{
                    alignSelf: item.fromBot ? "flex-start" : "flex-end",
                    backgroundColor: item.fromBot ? theme.border : theme.accent,
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 18,
                    marginVertical: 6,
                    maxWidth: "75%",
                  }}
                >
                  <Text
                    style={{
                      color: item.fromBot ? theme.text : theme.body,
                      fontSize: 14,
                    }}
                  >
                    {item.text}
                  </Text>
                </Animated.View>
              )}
            />

            {/* Typing indicator */}
            {botTyping && (
              <View
                style={{
                  alignSelf: "flex-start",
                  marginLeft: 10,
                  marginBottom: 4,
                }}
              >
                <Text style={{ fontStyle: "italic", color: theme.secondary }}>
                  Bot is typing...
                </Text>
              </View>
            )}

            {/* Input */}
            <View
              style={{
                flexDirection: "row",
                padding: 8,
                borderTopWidth: 1,
                borderColor: theme.border,
              }}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type a message…"
                onSubmitEditing={sendMessage} // <-- Send on Enter
                returnKeyType="send" // optional, shows "Send" button on keyboard
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: theme.border,
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  height: 40,
                }}
              />
              <Pressable
                onPress={sendMessage}
                style={{ marginLeft: 8, justifyContent: "center" }}
              >
                <Ionicons name="send" size={24} color={theme.accent} />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}

      {/* Floating button */}
      <Pressable
        onPress={() => setOpen(true)}
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
          right: isRTL() ? undefined : 20,
          left: isRTL() ? 20 : undefined,
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color={theme.body} />
      </Pressable>
    </>
  );
};

export default BotChat;
