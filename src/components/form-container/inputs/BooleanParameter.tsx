import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import {
  Input,
  InputField,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "../../../../components/ui";
import { useSelector } from "react-redux";

const BooleanParameter = ({
  value: defaultValue,
  fieldName,
  enable,
  control,
}) => {
  const localization = useSelector((state) => state.localization.localization);
  // ✅ Boolean options
  const options = localization.inputs.boolean;

  // ✅ Default = Yes (true)
  const [localValue, setLocalValue] = useState(
    defaultValue ?? options[0].value,
  );

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== localValue) {
      setLocalValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <View>
      <Controller
        control={control}
        name={fieldName}
        defaultValue={localValue}
        render={({ field: { onChange: formOnChange } }) => (
          <View>
            <RadioGroup
              value={localValue}
              onChange={(newValue) => {
                setLocalValue(newValue);
                formOnChange(newValue);
              }}
              isDisabled={!enable}
              style={{ paddingHorizontal: 16, paddingVertical: 8 }}
            >
              {options.map((item, index) => (
                <Radio value={item.value} key={index}>
                  <RadioIndicator>
                    <RadioIcon
                      as={() => (
                        <MaterialIcons
                          name="radio-button-checked"
                          size={20}
                          color="black"
                        />
                      )}
                    />
                  </RadioIndicator>
                  <RadioLabel>{item.text}</RadioLabel>
                </Radio>
              ))}
            </RadioGroup>

            {/* Hidden sync input (optional but safe) */}
            <Input className="w-0 h-0 opacity-0">
              <InputField
                value={String(localValue)}
                onChangeText={(text) => {
                  const parsedValue = text === "true";
                  setLocalValue(parsedValue);
                  formOnChange(parsedValue);
                }}
              />
            </Input>
          </View>
        )}
      />
    </View>
  );
};

export default BooleanParameter;
