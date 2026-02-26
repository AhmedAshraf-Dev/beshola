import { View, useWindowDimensions } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";
import { Input, InputField } from "../../../../components/ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RangeSlider from "./CustomInputs/RangeSlider";

export default function MeddleRangeParameter({
  fieldName,
  control,
  placeholder,
  invalidInput,
  value: range = { min: 0, max: 500 },
}) {
  const { width } = useWindowDimensions();

  // ✅ Responsive slider width
  const sliderWidth = width > 768 ? width * 0.5 : width * 0.9;

  const min = range.min;
  const max = range.max;

  // ✅ Smart Dynamic Step
  const rangeSize = max - min;
  let step = 1;

  if (rangeSize <= 20) step = 1;
  else if (rangeSize <= 100) step = 5;
  else if (rangeSize <= 500) step = 10;
  else step = 50;

  return (
    <GestureHandlerRootView>
      <View className="px-4 py-6 w-full">
        <Controller
          control={control}
          name={fieldName}
          defaultValue={{ min, max }}
          render={({ field: { onChange, value } }) => {
            const currentMin = value?.min ?? min;
            const currentMax = value?.max ?? max;

            return (
              <>
                {/* Slider */}
                <RangeSlider
                  min={min}
                  max={max}
                  sliderWidth={sliderWidth}
                  step={step}
                  value={{ min: currentMin, max: currentMax }}
                  onValueChange={(val) => onChange(val)}
                />

                {/* Dynamic Width Inputs */}
                <View className="flex flex-row justify-between mt-6 items-center">
                  {/* Min Input */}
                  <Input
                    variant="outline"
                    size="lg"
                    isInvalid={invalidInput}
                    isReadOnly
                    style={{
                      minWidth: 60,
                      width: Math.max(60, String(currentMin).length * 14),
                    }}
                  >
                    <InputField
                      keyboardType="numeric"
                      value={`${currentMin}`}
                      onChangeText={(text) => {
                        const newMin = Number(text) || min;
                        onChange({
                          min: newMin,
                          max: currentMax,
                        });
                      }}
                      placeholder="Min"
                    />
                  </Input>

                  {/* Max Input */}
                  <Input
                    variant="outline"
                    size="lg"
                    isInvalid={invalidInput}
                    isReadOnly
                    style={{
                      minWidth: 60,
                      width: Math.max(60, String(currentMax).length * 14),
                    }}
                  >
                    <InputField
                      keyboardType="numeric"
                      value={`${currentMax}`}
                      onChangeText={(text) => {
                        const newMax = Number(text) || max;
                        onChange({
                          min: currentMin,
                          max: newMax,
                        });
                      }}
                      placeholder="Max"
                    />
                  </Input>
                </View>
              </>
            );
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
}
