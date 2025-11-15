import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function DetilsButtonCollops({
  child,
  setChild,
  DetailsComponent,
}) {
  const localization = useSelector((state) => state.localization.localization);

  return (
    <View className="justify-center items-center flex-row">
      <TouchableOpacity
        onPress={() => setChild(child ? null : DetailsComponent)}
        className="mt-3 bg-accentHover px-4 py-2 rounded-lg self-start flex-row items-center"
      >
        {/* ✅ Text stays the same */}
        <Text className="text-body font-medium me-2">
          {child
            ? localization.Hum_screens.orders.hideDetails
            : localization.Hum_screens.orders.showDetails}
        </Text>

        {/* ✅ Icon added behind the text */}
        {child ? (
          <Entypo name="chevron-small-up" size={22} color="#fff" />
        ) : (
          <Entypo name="chevron-small-down" size={22} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}
