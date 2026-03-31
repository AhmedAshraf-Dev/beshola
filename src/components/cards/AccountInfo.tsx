import { View, Text } from "react-native";
import React from "react";
import StarsIcons from "../../utils/component/StarsIcons";
import { theme } from "../../Theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AccountInfo({ fieldsType, item }) {
  const companyName = item[fieldsType.companyName] || "B-Souhool";
  return (
    <View className="flex-row w-full items-center">
      {/* Verified Icon with fixed width */}
      <View style={{ width: 20, alignItems: "center" }}>
        {item[fieldsType.companyName] && (
          <MaterialCommunityIcons
            name="check-decagram"
            size={18}
            color={theme.accentHover}
          />
        )}
      </View>

      {/* Company Info: takes the rest of the space */}
      <View className="flex-1 items-start ml-2">
        {fieldsType.companyName && companyName && (
          <Text
            numberOfLines={2}
            key={`${item[fieldsType.idField]}-${fieldsType.companyName}-${companyName}`}
            className="text-lg font-bold"
            style={{ color: theme.secondary }}
          >
            {companyName}
          </Text>
        )}

        {/* Stars */}
        <View className="flex-row items-center mt-1">
          <StarsIcons
            value={parseFloat(item[fieldsType.rate] || 3)}
            size={14}
            customKey={0}
          />
        </View>
      </View>
    </View>
  );
}
