import React, { useEffect, useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { useSelector } from "react-redux";
import { useSchemas } from "../../../context/SchemaProvider";
import { theme } from "../../Theme";
import ChatInput from "./ChatInput";
import MessageItem from "./MessageItem";

const initialMessages = {
  support: [{ id: "s1", text: "Hello! How can I help?", fromBot: true }],
  sales: [
    { id: "sa1", text: "Welcome! Looking for our prices?", fromBot: true },
    { id: "sa2", type: "component", component: "MenuFilter" },
  ],
  tech: [{ id: "t1", text: "Technical support online!", fromBot: true }],
};

const ChatMessages = ({ activeRoom }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const flatRef = useRef(null);
  const { menuItemsState } = useSchemas();
  const fieldsType = useSelector((s) => s.menuItem?.fieldsType);

  useEffect(() => {
    const t = setTimeout(() => {
      if (flatRef.current && flatRef.current.scrollToEnd)
        flatRef.current.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(t);
  }, [messages, activeRoom]);

  const appendMessageToRoom = (roomId, msg) => {
    setMessages((prev) => ({
      ...prev,
      [roomId]: prev[roomId] ? [...prev[roomId], msg] : [msg],
    }));
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = {
      id: `${activeRoom}-u-${Date.now()}`,
      text: input,
      fromBot: false,
    };
    appendMessageToRoom(activeRoom, userMsg);
    setInput("");

    setTimeout(() => {
      appendMessageToRoom(activeRoom, {
        id: `${activeRoom}-b-${Date.now()}`,
        text: "Here’s something based on your request!",
        fromBot: true,
      });
      if (activeRoom === "sales") {
        appendMessageToRoom(activeRoom, {
          id: `sa-filter-${Date.now()}`,
          type: "component",
          component: "MenuFilter",
        });
      }
    }, 800);
  };

  const renderItem = ({ item }) => (
    <MessageItem
      item={item}
      activeRoom={activeRoom}
      appendMessageToRoom={appendMessageToRoom}
      setBotTyping={setBotTyping}
      setSelectedItems={setSelectedItems}
      fieldsType={fieldsType}
      menuItemsState={menuItemsState}
      selectedItems={selectedItems}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatRef}
        data={messages[activeRoom]}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        renderItem={renderItem}
        removeClippedSubviews
      />

      {botTyping && (
        <View style={{ paddingHorizontal: 12, marginBottom: 6 }}>
          <Text style={{ color: theme.text, fontStyle: "italic" }}>
            Bot is typing…
          </Text>
        </View>
      )}

      <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} />
    </View>
  );
};

export default ChatMessages;
