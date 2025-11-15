import { View, Text, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";

export default function LocationButton({ latitude, longitude }) {
  const handleOpenMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };
  return (
    <View>
      <TouchableOpacity
        onPress={handleOpenMap}
        className="bg-accent my-2 px-4 py-2 rounded-lg items-center justify-center"
      >
        {/* ✅ Icon instead of text */}
        <Entypo name="location-pin" size={22} className="!text-body" />
      </TouchableOpacity>
    </View>
  );
}
