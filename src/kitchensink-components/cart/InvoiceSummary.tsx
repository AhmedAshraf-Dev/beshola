import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useNetwork } from "../../../context/NetworkContext";
import { useWS } from "../../../context/WSProvider";
import { ConnectToWS } from "../../utils/WS/ConnectToWS";
import { WSMessageHandler } from "../../utils/WS/handleWSMessage";
import { isRTL } from "../../utils/operation/isRTL";
import { useSchemas } from "../../../context/SchemaProvider";
import Invoice from "./InvoiceProvider";
import { getField } from "../../utils/operation/getField";
import { covertPointsToCredits } from "../../utils/operation/covertPointsToCredits";
// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function InvoiceSummary({
  row = null,
  summaryRow,
  setSummaryRow,
  InvoiceSummaryInfo,
  schemaFieldsTypes,
  isExpanded = true,
}) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [cartInfo, setCartInfo] = useState({});
  const { _wsMessageCartInfo, setWSMessageCartInfo } = useWS();
  const [cartInfo_WS_Connected, setCartInfoWS_Connected] = useState(false);
  const localization = useSelector((state) => state.localization.localization);
  const { cartInfoState } = useSchemas();

  const creditField = schemaFieldsTypes.creditField;

  const pointsField = schemaFieldsTypes.pointsField;
  const usingCredits = parseFloat(row?.[creditField?.parameterField]) || 0;
  const usingPoints =
    covertPointsToCredits(parseFloat(row?.[pointsField?.parameterField])) || 0;
  //look here if InvoiceSummaryInfo found do run that and replace GetCustomerCartInfo by that InvoiceSummaryInfo

  useEffect(() => {
    setCartInfo(InvoiceSummaryInfo);
  }, [InvoiceSummaryInfo]);

  const {
    status: { isConnected: isOnline },
  } = useNetwork();
  // 🌐 WebSocket connect effect
  useEffect(() => {
    if (cartInfo_WS_Connected) return;
    let cleanup;
    ConnectToWS(setWSMessageCartInfo, setCartInfoWS_Connected)
      .then(() => console.log("🔌 Cart WebSocket connected"))
      .catch((e) => console.error("❌ Cart WebSocket error", e));
    return () => {
      if (cleanup) cleanup(); // Clean up when component unmounts or deps change
      console.log("🧹 Cleaned up WebSocket handler");
    };
  }, [cartInfo_WS_Connected, isOnline]);

  // ✅ Callback to update reducer
  const cartCallbackReducerUpdate = async (cartInfo_ws_updatedRows) => {
    setCartInfo(() =>
      cartInfo_ws_updatedRows.rows.length > 0
        ? cartInfo_ws_updatedRows.rows[0]
        : {}
    );
  };

  // 📨 WebSocket message handler
  useEffect(() => {
    if (!_wsMessageCartInfo) return;

    const handlerCartWSMessage = new WSMessageHandler({
      _WSsetMessage: _wsMessageCartInfo,
      fieldsType: schemaFieldsTypes,
      rows: [cartInfo],
      totalCount: 0,
      callbackReducerUpdate: cartCallbackReducerUpdate,
    });
    handlerCartWSMessage.process();
  }, [_wsMessageCartInfo]);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const getValue = (field) => {
    const key = field?.parameterField;
    const value = key && cartInfo ? cartInfo[key] : null;
    return typeof value !== "undefined" && value !== null ? value : -1;
  };

  const isPositive = (value) => (value > 0 ? true : false);
  useEffect(() => {
    setSummaryRow({ ...summaryRow, ...cartInfo });
  }, [cartInfo]);
  return (
    <View className="mt-1 mb-6 border border-accent rounded-xl p-2">
      {/* Expandable Section */}
      {expanded && (
        <View className="space-y-1 mt-2 p-4">
          {/* Total Amount */}
          {schemaFieldsTypes.totalAmount && (
            <SummaryLine
              label={schemaFieldsTypes.totalAmount.parameterTitel}
              value={
                getValue(schemaFieldsTypes.netAmount) >= 0
                  ? getValue(schemaFieldsTypes.netAmount)
                  : 0
              }
            />
          )}
          <View className="border-b border-gray-300 my-2" />

          {/* Discounts */}
          {schemaFieldsTypes.totalDiscountAmount &&
            isPositive(getValue(schemaFieldsTypes.totalDiscountAmount)) && (
              <View style={{ direction: "inherit" }}>
                <Text
                  className="font-bold text-base mb-1"
                  style={{ direction: "inherit" }}
                >
                  {localization.Hum_screens.cart.paymentSummary.discounts}:
                </Text>
                {getValue(schemaFieldsTypes.invoiceDiscountAmount) >= 0 && (
                  <SummaryLine
                    label={
                      schemaFieldsTypes.invoiceDiscountAmount.parameterTitel
                    }
                    setDash={true}
                    value={getValue(schemaFieldsTypes.invoiceDiscountAmount)}
                  />
                )}
                {getValue(schemaFieldsTypes.invoiceItemsDiscountAmount) >=
                  0 && (
                  <SummaryLine
                    label={
                      schemaFieldsTypes.invoiceItemsDiscountAmount
                        .parameterTitel
                    }
                    setDash={true}
                    value={getValue(
                      schemaFieldsTypes.invoiceItemsDiscountAmount
                    )}
                  />
                )}
                <View
                  className="flex-row justify-between py-2"
                  style={{ direction: "inherit" }}
                >
                  <Text className="font-bold" style={{ direction: "inherit" }}>
                    {isRTL() ? " ◀ " : " ➤ "}
                    {schemaFieldsTypes.totalDiscountAmount.parameterTitel}
                  </Text>
                  <Text className="font-bold" style={{ color: "#16a34a" }}>
                    {getValue(schemaFieldsTypes.totalDiscountAmount)}
                    {localization.menu.currency}{" "}
                  </Text>
                </View>
                <View className="border-b border-gray-300 my-2" />
              </View>
            )}
          {/* totalTaxAmount */}
          {schemaFieldsTypes.totalTaxAmount &&
            isPositive(getValue(schemaFieldsTypes.totalTaxAmount)) && (
              <View style={{ direction: "inherit" }}>
                <Text
                  className="font-bold text-base mb-1"
                  style={{ direction: "inherit" }}
                >
                  {localization.Hum_screens.cart.paymentSummary.taxes}:
                </Text>
                {getValue(schemaFieldsTypes.invoiceTaxAmount) >= 0 && (
                  <SummaryLine
                    label={schemaFieldsTypes.invoiceTaxAmount.parameterTitel}
                    setDash={true}
                    value={getValue(schemaFieldsTypes.invoiceTaxAmount)}
                  />
                )}
                {getValue(schemaFieldsTypes.invoiceItemsTaxAmount) >= 0 && (
                  <SummaryLine
                    label={
                      schemaFieldsTypes.invoiceItemsTaxAmount.parameterTitel
                    }
                    setDash={true}
                    value={getValue(schemaFieldsTypes.invoiceItemsTaxAmount)}
                  />
                )}
                <View
                  className="flex-row justify-between py-2"
                  style={{ direction: "inherit" }}
                >
                  <Text className="font-bold" style={{ direction: "inherit" }}>
                    {isRTL() ? " ◀ " : " ➤ "}{" "}
                    {schemaFieldsTypes.totalTaxAmount.parameterTitel}
                  </Text>
                  <Text className="font-bold" style={{ color: "#dc2626" }}>
                    {getValue(schemaFieldsTypes.totalTaxAmount)}
                    {localization.menu.currency}{" "}
                  </Text>
                </View>
                <View className="border-b border-gray-300 my-2" />
              </View>
            )}
          {/* totalFeesAmount */}
          {schemaFieldsTypes.totalFeesAmount &&
            isPositive(getValue(schemaFieldsTypes.totalFeesAmount)) && (
              <View style={{ direction: "inherit" }}>
                <Text
                  className="font-bold text-base mb-1"
                  style={{ direction: "inherit" }}
                >
                  {localization.Hum_screens.cart.paymentSummary.fees}:
                </Text>
                {schemaFieldsTypes.feesAmount &&
                  getValue(schemaFieldsTypes.feesAmount) >= 0 && (
                    <SummaryLine
                      label={schemaFieldsTypes.feesAmount.parameterTitel}
                      setDash={true}
                      value={getValue(schemaFieldsTypes.feesAmount)}
                    />
                  )}
                {getValue(schemaFieldsTypes.otherFeesAmount) >= 0 &&
                  schemaFieldsTypes.otherFeesAmount && (
                    <SummaryLine
                      label={schemaFieldsTypes.otherFeesAmount.parameterTitel}
                      setDash={true}
                      value={getValue(schemaFieldsTypes.otherFeesAmount)}
                    />
                  )}
                {getValue(schemaFieldsTypes.shipmentFees) >= 0 && (
                  <SummaryLine
                    label={schemaFieldsTypes.shipmentFees.parameterTitel}
                    setDash={true}
                    value={getValue(schemaFieldsTypes.shipmentFees)}
                  />
                )}
                <View
                  className="flex-row justify-between py-2"
                  style={{ direction: "inherit" }}
                >
                  <Text className="font-bold" style={{ direction: "inherit" }}>
                    {isRTL() ? " ◀ " : " ➤ "}{" "}
                    {schemaFieldsTypes.totalFeesAmount.parameterTitel}
                  </Text>
                  <Text className="font-bold">
                    {getValue(schemaFieldsTypes.totalFeesAmount)}
                    {localization.menu.currency}{" "}
                  </Text>
                </View>
                <View className="border-b border-gray-300 my-2" />
              </View>
            )}
          {/* Final Total */}
          {row && (
            <View className="flex-row justify-between items-center bg-yellow-100 py-3 px-2 border !border-yellow-400 mt-2">
              <Text className="font-bold text-lg">
                {schemaFieldsTypes.netAmount.parameterTitel} :
              </Text>
              <Text className="font-bold text-lg">
                {getValue(schemaFieldsTypes.netAmount) >= 0
                  ? getValue(schemaFieldsTypes.netAmount)
                  : 0}
                {localization.menu.currency}{" "}
              </Text>
            </View>
          )}
        </View>
      )}
      {row && (
        <Invoice.UsingPointsAndCredits
          creditField={creditField}
          pointsField={pointsField}
          row={row}
          usingCredits={usingCredits}
          usingPoints={usingPoints}
        />
      )}
      {schemaFieldsTypes.netPayAmount &&
        getValue(schemaFieldsTypes.netPayAmount) >= 0 && (
          <TouchableOpacity
            onPress={toggleExpanded}
            activeOpacity={0.7}
            className="mt-1 mb-2 rounded-xl p-2 !bg-accent flex-row justify-between items-center"
          >
            <Text className="text-lg font-bold text-body">
              {cartInfoState.schema.dashboardFormSchemaInfoDTOView.schemaHeader}
            </Text>

            <Text
              className="text-lg font-bold text-body"
              key={`${schemaFieldsTypes.netPayAmount.parameterField}-${getValue(
                schemaFieldsTypes.netPayAmount
              )}`}
            >
              {Number(getValue(schemaFieldsTypes.netPayAmount)).toFixed(2) ||
                "0.00"}
              {localization.menu.currency}{" "}
            </Text>
          </TouchableOpacity>
        )}
    </View>
  );
}
// schemaFieldsTypes.net amount &&
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
