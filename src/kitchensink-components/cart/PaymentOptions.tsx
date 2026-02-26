import { default as React, useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { GetProjectUrl } from "../../../request";
import { theme } from "../../Theme";
import { initialState } from "../../components/Pagination/initialState";
import reducer from "../../components/Pagination/reducer";
import FormContainer from "../../components/form-container/FormContainer";
import { ConnectToWS } from "../../utils/WS/ConnectToWS";
import { WSMessageHandler } from "../../utils/WS/handleWSMessage";
import { CollapsibleSection } from "../../utils/component/Collapsible";
import { getField } from "../../utils/operation/getField";
// import { LocalizationContext } from "../../../context/LocalizationContext";
import useFetch from "../../../components/hooks/APIsFunctions/useFetch";
import { useNetwork } from "../../../context/NetworkContext";
import { cleanObject } from "../../utils/operation/cleanObject";
import { ImageBackground } from "../../../components/ui";
import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { useSchemas } from "../../../context/SchemaProvider";
import { covertPointsToCredits } from "../../utils/operation/covertPointsToCredits";
import { useShopNode } from "../../../context/ShopNodeProvider";

const PaymentOptions = ({
  InvoiceSummaryInfo,
  rootRow,
  setRootRow,
  schemaFieldsTypes,
}) => {
  const [row, setRow] = useState({});
  const [_WSsetMessage, setWSsetMessage] = useState("{}");
  const [WS_Connected, setWS_Connected] = useState(false);
  const { paymentOptionsState } = useSchemas();
  const creditField = schemaFieldsTypes.creditField;

  const pointsField = schemaFieldsTypes.pointsField;
  const wsAction =
    paymentOptionsState?.actions &&
    paymentOptionsState?.actions.find(
      (action) => action.dashboardFormActionMethodType.toLowerCase() === "ws",
    );
  const getAction =
    paymentOptionsState.actions &&
    paymentOptionsState.actions.find(
      (action) => action.dashboardFormActionMethodType.toLowerCase() === "get",
    );
  const { data, error, isLoading } = useFetch(
    `/${getAction?.routeAdderss}`,
    paymentOptionsState.schema.projectProxyRoute,
  );
  useEffect(() => {
    if (!isLoading && data) {
      setRow(data);
    }
  }, [isLoading, data]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    clearErrors,
  } = useForm({});

  const paymentOptionsFieldsType = {
    idField: paymentOptionsState.schema.idField,
    dataSourceName: paymentOptionsState.schema.dataSourceName,
  };
  const {
    status: { isConnected: isOnline },
  } = useNetwork();
  const { selectedNode } = useShopNode();
  useEffect(() => {
    setWS_Connected(false);
  }, [selectedNode]);
  // 🌐 WebSocket connect effect
  useEffect(() => {
    if (WS_Connected || !wsAction) return;
    let cleanup;
    ConnectToWS(
      setWSsetMessage,
      setWS_Connected,
      paymentOptionsFieldsType.dataSourceName,
      {},
      wsAction,
    )
      .then(() => console.log("🔌 Cart WebSocket connected"))
      .catch((e) => console.error("❌ Cart WebSocket error", e));
    return () => {
      if (cleanup) cleanup(); // Clean up when component unmounts or deps change
      console.log("🧹 Cleaned up WebSocket handler");
    };
  }, [WS_Connected, isOnline]);

  // ✅ Callback to update reducer
  const paymentOptionsCallbackReducerUpdate = async (ws_updatedRow) => {
    setRow(ws_updatedRow.rows[0]);
  };

  // 📨 WebSocket message handler
  useEffect(() => {
    if (!_WSsetMessage) return;

    const handlerCartWSMessage = new WSMessageHandler({
      _WSsetMessage, // match param name
      fieldsType: paymentOptionsFieldsType,
      rows: [row],
      totalCount: 0,
      callbackReducerUpdate: paymentOptionsCallbackReducerUpdate,
    });
    handlerCartWSMessage.process();
  }, [_WSsetMessage]);
  useEffect(() => {
    const subscription = watch((formValues) => {
      // Clean object is optional if you want to remove empty/undefined values
      const cleanedValues = cleanObject(formValues);

      setRootRow({ ...rootRow, ...cleanedValues });
    });

    return () => subscription.unsubscribe();
  }, [watch, rootRow, setRootRow]);
  // useEffect(() => {
  //   const usingCredits =
  //     parseFloat(rootRow?.[creditField?.parameterField]) || 0;
  //   const usingPoints =
  //     covertPointsToCredits(
  //       parseFloat(rootRow?.[pointsField?.parameterField])
  //     ) || 0;

  //   const payNetAmount =
  //     InvoiceSummaryInfo[schemaFieldsTypes.netPayAmount.parameterField];

  //   if (usingCredits + usingPoints > payNetAmount) {
  //     // ✅ First, calculate the reduced usingPoints and set it,
  //     // then reduce the usingCredits by using setValue, and also update rootRow.

  //     let adjustedPoints = usingPoints;
  //     let adjustedCredits = usingCredits;
  //     let total = usingCredits + usingPoints;

  //     // Step 1: Remove points first if total exceeds payNetAmount
  //     if (total > payNetAmount) {
  //       const excess = total - payNetAmount;

  //       if (adjustedPoints >= excess) {
  //         // If points can cover the excess, just reduce points
  //         adjustedPoints -= excess;
  //       } else {
  //         // Otherwise, remove all points and reduce remaining from credits
  //         const remainingExcess = excess - adjustedPoints;
  //         adjustedPoints = 0;
  //         adjustedCredits = Math.max(0, adjustedCredits - remainingExcess);
  //       }
  //     }

  //     // Ensure both are non-negative
  //     adjustedPoints = Math.max(0, adjustedPoints);
  //     adjustedCredits = Math.max(0, adjustedCredits);

  //     // ✅ Update form values
  //     setValue(pointsField?.parameterField, adjustedPoints);
  //     setValue(creditField?.parameterField, adjustedCredits);

  //     // ✅ Update rootRow
  //     setRootRow((prev) => ({
  //       ...prev,
  //       [pointsField?.parameterField]: adjustedPoints,
  //       [creditField?.parameterField]: adjustedCredits,
  //     }));
  //   }
  // }, [InvoiceSummaryInfo]);

  return (
    getAction && (
      <View className="mt-6 border border-border bg-body rounded-xl p-2 w-full">
        <CollapsibleSection
          title={
            paymentOptionsState.schema.dashboardFormSchemaInfoDTOView
              .schemaHeader
          }
          icon={null}
          setheader={true}
          iconColor={theme.body}
          textColor={theme.body}
          buttonClassName={
            "rounded-xl p-2 !bg-accent text-lg font-bold text-body"
          }
        >
          <View className="overflow-auto w-full flex-1">
            <View className="w-fit max-w-full shrink">
              <FormContainer
                tableSchema={paymentOptionsState.schema}
                row={{ ...InvoiceSummaryInfo, ...row }}
                errorResult={{}}
                control={control}
              />
            </View>
          </View>
        </CollapsibleSection>
      </View>
    )
  );
};

export default PaymentOptions;
