import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  TextareaInput,
} from "../../../../components/ui";
import { useSelector } from "react-redux";
function SelectParameter({
  values = [],
  value: initValue,
  fieldName,
  enable = true,
  control,
  lookupDisplayField,
  lookupReturnField,
  isLookup = false,
  ...props
}) {
  const localization = useSelector((state) => state.localization.localization);
  useEffect(() => {
    if (values?.length > 0 && initValue.length <= 0) {
      // props?.setValue &&
      isLookup && props?.setValue(fieldName, values[0][lookupReturnField]);
    }
  }, [values, initValue]);
  return (
    <View>
      <Controller
        control={control}
        name={fieldName}
        defaultValue={
          // initValue
          values.find((item) => item?.[lookupReturnField] === initValue)?.[
            lookupReturnField
          ] ?? values?.[0]?.[lookupReturnField]
        }
        render={({ field: { onChange, value } }) => {
          const selectedItem =
            values.find((item) => item?.[lookupReturnField] === value) ||
            isLookup
              ? values?.[0]
              : "";

          return (
            <Select
              className="mx-2"
              onValueChange={(displayValue) => {
                const selected = values.find(
                  (item) => item?.[lookupDisplayField] === displayValue,
                );

                if (selected) {
                  onChange(selected[lookupReturnField]);
                }
              }}
            >
              <SelectTrigger
                variant="outline"
                size="sm"
                className="w-full h-11 flex flex-row justify-between"
              >
                <SelectInput
                  placeholder={localization.inputs.select.placeholder}
                  value={selectedItem?.[lookupDisplayField] || ""}
                  className="text-base text-text"
                />

                <SelectIcon
                  as={AntDesign}
                  name="down"
                  className="mr-3 text-text"
                />
              </SelectTrigger>

              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>

                  {values.map((item) => (
                    <SelectItem
                      key={item?.[lookupReturnField]}
                      label={item?.[lookupDisplayField]}
                      value={item?.[lookupDisplayField]}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default SelectParameter;
