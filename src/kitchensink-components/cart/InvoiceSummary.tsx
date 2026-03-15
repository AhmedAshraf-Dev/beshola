import React, { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { isRTL } from "../../utils/operation/isRTL";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function PricePlanSummary({
  plan,
  schemaFieldsTypes,
  isExpanded = true,
}) {
  const [expanded, setExpanded] = useState(isExpanded);
  const localization = useSelector((state) => state.localization.localization);

  const getValue = (field) => {
    const key = field?.parameterField;
    const value = key && plan ? plan[key] : null;
    return value !== undefined && value !== null ? Number(value).toFixed(2) : 0;
  };

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  return (
    <View className="mt-1 mb-6 border border-accent rounded-xl p-2">
      {expanded && (
        <View className="space-y-1 mt-2 p-4">
          {/* Total Price */}
          {schemaFieldsTypes.totalPrice && (
            <SummaryLine
              label={schemaFieldsTypes.totalPrice.parameterTitel}
              value={getValue(schemaFieldsTypes.totalPrice)}
            />
          )}

          {/* Down Payment */}
          {schemaFieldsTypes.downPayment && (
            <SummaryLine
              label={schemaFieldsTypes.downPayment.parameterTitel}
              value={getValue(schemaFieldsTypes.downPayment)}
            />
          )}

          {/* Discount */}
          {schemaFieldsTypes.discount && (
            <SummaryLine
              label={schemaFieldsTypes.discount.parameterTitel}
              value={`${getValue(schemaFieldsTypes.discount)} %`}
            />
          )}

          {/* Cashback */}
          {schemaFieldsTypes.cashback && (
            <SummaryLine
              label={schemaFieldsTypes.cashback.parameterTitel}
              value={getValue(schemaFieldsTypes.cashback)}
            />
          )}

          {/* Maintenance Fees */}
          {schemaFieldsTypes.maintenanceFees && (
            <SummaryLine
              label={schemaFieldsTypes.maintenanceFees.parameterTitel}
              value={getValue(schemaFieldsTypes.maintenanceFees)}
            />
          )}

          {/* Insurance Fees */}
          {schemaFieldsTypes.insuranceFees && (
            <SummaryLine
              label={schemaFieldsTypes.insuranceFees.parameterTitel}
              value={getValue(schemaFieldsTypes.insuranceFees)}
            />
          )}

          {/* Tax */}
          {schemaFieldsTypes.tax && (
            <SummaryLine
              label={schemaFieldsTypes.tax.parameterTitel}
              value={`${getValue(schemaFieldsTypes.tax)} %`}
            />
          )}

          {/* Plan Dates */}
          {(schemaFieldsTypes.startDate || schemaFieldsTypes.endDate) && (
            <SummaryLine
              label="Plan Period"
              value={`${plan?.[schemaFieldsTypes.startDate?.parameterField]} → ${
                plan?.[schemaFieldsTypes.endDate?.parameterField]
              }`}
            />
          )}

          {/* Remarks */}
          {schemaFieldsTypes.remarks &&
            plan?.[schemaFieldsTypes.remarks?.parameterField] && (
              <SummaryLine
                label={schemaFieldsTypes.remarks.parameterTitel}
                value={plan?.[schemaFieldsTypes.remarks.parameterField]}
              />
            )}
        </View>
      )}

      {/* Expand Button */}
      <TouchableOpacity
        onPress={toggleExpanded}
        activeOpacity={0.7}
        className="mt-1 mb-2 rounded-xl p-2 !bg-accent flex-row justify-between items-center"
      >
        <Text className="text-lg font-bold text-body">Price Plan Summary</Text>

        <Text className="text-lg font-bold text-body">
          {getValue(schemaFieldsTypes.totalPrice)}
          {localization.menu.currency}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const SummaryLine = ({ label, value, setDash = false }) => {
  const localization = useSelector((state) => state.localization.localization);
  const dash = setDash && "-";
  return (
    <View
      className="flex-row justify-between py-2"
      style={{ direction: "inherit" }}
    >
      <Text className="text-base" style={{ direction: "inherit" }}>
        {dash}
        {label}:
      </Text>
      <Text
        className="text-base"
        key={`${value}`}
        style={{ direction: "inherit" }}
      >
        {value}
        {localization.menu.currency}
      </Text>
    </View>
  );
};
