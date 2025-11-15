import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React, { createContext, useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { HStack, VStack } from "../../../components/ui";
import { theme } from "../../Theme";
import { formatCount } from "../../utils/operation/formatCount";

/* ---------------- Context ---------------- */
const InvoiceContext = createContext();
const useInvoice = () => useContext(InvoiceContext);

export const InvoiceProvider = ({ value, children }) => (
  <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
);

/* ---------------- Main Wrapper ---------------- */
const Invoice = ({ children }) => {
  return <View className="bg-body p-4 rounded-lg w-full">{children}</View>;
};

/* ---------------- Subcomponents ---------------- */
Invoice.BranchAndAddress = ({ selectedNode, nodeFieldName, getAddress }) => {
  const localization = useSelector((state) => state.localization.localization);

  return (
    <View className="flex-row justify-between">
      {selectedNode && selectedNode[nodeFieldName] && (
        <View>
          <Text className="text-base font-semibold mt-5 mb-2">
            {localization.checkout.branch}
          </Text>
          <Text className="text-sm text-primary-custom">
            {selectedNode[nodeFieldName]}
          </Text>
        </View>
      )}
      {getAddress && (
        <View>
          <Text className="text-base font-semibold mt-5 mb-2">
            {localization.checkout.address}
          </Text>
          <Text className="text-sm text-primary-custom">{getAddress()}</Text>
        </View>
      )}
    </View>
  );
};

Invoice.UsingPointsAndCredits = ({
  usingCredits,
  usingPoints,
  creditField,
  pointsField,
  row,
}) => {
  const localization = useSelector((state) => state.localization.localization);

  if (usingCredits <= 0 && usingPoints <= 0) return null;

  return (
    <View>
      <Text className="text-base font-semibold mt-2 mb-2">
        {localization.checkout.paymentOptions}
      </Text>
      <VStack>
        {usingCredits > 0 && (
          <HStack space="xs" className="items-center">
            <FontAwesome
              name="credit-card"
              size={14}
              color={theme.accentHover}
            />
            <Text className="text-text text-sm">
              {creditField.parameterTitel}: {formatCount(usingCredits)}
              {localization.menu.currency}
            </Text>
          </HStack>
        )}
        {usingPoints > 0 && (
          <HStack space="xs" className="items-center mt-1">
            <FontAwesome name="star" size={14} color="#facc15" />
            <Text className="text-primary-custom text-sm">
              {pointsField.parameterTitel}:{" "}
              {formatCount(row[pointsField.parameterField])}
            </Text>
            <Text>
              {`= ${formatCount(usingPoints)}`}
              {localization.menu.currency}
            </Text>
          </HStack>
        )}
      </VStack>
    </View>
  );
};

Invoice.PaymentRow = ({
  paymentRow,
  paymentMethodsFieldsType,
  flatListRef,
}) => {
  const localization = useSelector((state) => state.localization.localization);
  const paymentRowName = paymentRow?.[paymentMethodsFieldsType.idField]
    ? paymentRow?.[paymentMethodsFieldsType.name]
    : localization[paymentRow?.[paymentMethodsFieldsType.name]];
  return (
    paymentRowName && (
      <TouchableOpacity
        className="flex-row items-center mt-2 justify-between p-4 rounded-xl border border-green-500 bg-green-50"
        ref={flatListRef}
      >
        <View className="flex-row items-center">
          <FontAwesome5 size={18} color={"#22c55e"} />
          <Text className="text-base text-gray-700">{paymentRowName}</Text>
        </View>
        <MaterialIcons name="check-circle" size={20} color="#22c55e" />
      </TouchableOpacity>
    )
  );
};

Invoice.RequiredAmount = ({ requiredAmount }) => {
  const localization = useSelector((state) => state.localization.localization);

  return (
    <View className="mt-6 space-y-2">
      <Text
        className="text-lg font-bold text-text"
        style={{ direction: "inherit" }}
      >
        {localization.checkout.requiredAmount}
      </Text>

      <View className="flex-row justify-between items-center bg-yellow-50 border border-yellow-300 p-4 rounded-xl">
        <Text className="text-base font-medium text-yellow-800">
          {localization.checkout.youWillPay}
        </Text>
        <Text className="text-xl font-bold text-yellow-700">
          {requiredAmount.toFixed(2)}
          {localization.menu.currency}
        </Text>
      </View>
    </View>
  );
};

export default Invoice;
