import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useContext } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { CompareContext } from "../../../context/CompareProvider";
import { theme } from "../../Theme";
import { useSelector } from "react-redux";

export default function SheetCard({
  item,
  isCompareItem,
  handleCompareToggle,
}) {
  const fieldsType = useSelector((state) => state.menuItem.fieldsType);

  const active = isCompareItem(item, fieldsType);

  return (
    <View
      className="flex-row items-center p-3 mb-3 rounded-xl"
      style={{
        backgroundColor: theme.card,
        borderColor: theme.border,
        borderWidth: 1,
      }}
    >
      <Image
        source={{ uri: item.companyItemImage }}
        className="w-16 h-16 rounded-lg"
      />

      <View className="flex-1 mx-3">
        <Text className="text-sm font-semibold text-text">
          {item.menuItemName}
        </Text>
        <Text className="text-xs text-text opacity-70 mt-1">
          {item.location}
        </Text>
      </View>

      <TouchableOpacity
        disabled={active}
        onPress={() => {
          handleCompareToggle(item, fieldsType);
        }}
        className="px-3 py-2 rounded-full"
        style={{
          backgroundColor: active ? theme.success : theme.accent,
          opacity: active ? 0.8 : 1,
        }}
      >
        <MaterialCommunityIcons
          name={active ? "check" : "compare"}
          size={20}
          color={theme.body}
        />
      </TouchableOpacity>
    </View>
  );
}
