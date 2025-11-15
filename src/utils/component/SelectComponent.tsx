import React from "react";
import { View, Text } from "react-native";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "../../../components/ui";
import { AntDesign } from "@expo/vector-icons";
import LoadingScreen from "../../kitchensink-components/loading/LoadingScreen";
import { Chase } from "react-native-animated-spinkit";
import { useSelector } from "react-redux";
import { useDeviceInfo } from "./useDeviceInfo";

// ✅ Custom Select Item with two lines (label + optional subtitle)
export const CustomSelectItem = ({ label, subtitle, ...props }) => {
  return (
    <SelectItem {...props} label={label}>
      <View className="flex-col">
        <Text className="text-base text-text">{label}</Text>
        {subtitle ? (
          <Text className="text-xs text-gray-500">{subtitle}</Text>
        ) : null}
      </View>
    </SelectItem>
  );
};

export default function SelectComponent({
  selectedValue,
  onValueChange,
  mapData,
  idField,
  labelField,
  subtitleField, // 👈 field name for subtitle
  IconComponent = (
    <SelectIcon as={AntDesign} name="down" className="mr-3 text-text" />
  ),
  valueField = "",
  loading = false,
  subtitle, // 👈 optional subtitle above input
}) {
  const localization = useSelector((state) => state.localization.localization);
  const { os } = useDeviceInfo();

  return (
    <Select
      value={selectedValue}
      onValueChange={onValueChange}
      className="flex-1"
    >
      <SelectTrigger
        variant="unstyled"
        size="sm"
        className={`${os === "web" ? "!py-2" : ""} flex-1 flex-row items-center h-11 justify-between px-3 bg-transparent border border-border rounded-md`}
      >
        <View className="flex-col flex-1">
          {subtitle && (
            <Text className="text-text text-md font-bold mb-1">{subtitle}</Text>
          )}
          <SelectInput
            placeholder={localization.inputs.select.placeholder}
            value={selectedValue}
            className="text-base text-text"
            style={{ direction: "inherit" }}
          />
        </View>
        {IconComponent}
      </SelectTrigger>

      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>

          {/* ✅ Loading state */}
          {loading && <LoadingScreen LoadingComponent={<Chase size={40} />} />}

          {/* ✅ No items */}
          {mapData?.length === 0 && !loading && (
            <Text className="text-center mt-4 text-text">
              {localization.Hum_screens.menu.noItems}
            </Text>
          )}

          {/* ✅ Render custom rows */}
          {mapData?.map((item) => (
            <CustomSelectItem
              key={item[idField]}
              value={valueField.length > 0 ? item[valueField] : item}
              label={item[labelField]}
              subtitle={subtitleField ? item[subtitleField] : ""}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
