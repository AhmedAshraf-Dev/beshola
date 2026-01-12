import { Entypo, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { useCart } from "../../../context/CartProvider";
import AddressLocationSchema from "../../Schemas/AddressLocation/AddressLocation.json";
import NearestBranches from "../../Schemas/AddressLocation/NearestBranches.json";
import PaymentMethodsSchema from "../../Schemas/MenuSchema/PaymentMethods.json";
import OrdersSchemaActions from "../../Schemas/OrdersSchema/OrdersSchemaActions.json";
import { theme } from "../../Theme";
import ImageCardActions from "../../components/cards/ImageCardActions";
import StepHeader from "../../components/splash/StepHeader";
import AnimatedStarRatingInput from "../../utils/component/StarRatingInput";
import { covertPointsToCredits } from "../../utils/operation/covertPointsToCredits";
import { getField } from "../../utils/operation/getField";
import { isRTL } from "../../utils/operation/isRTL";
import Invoice, { InvoiceProvider } from "../cart/InvoiceProvider";
import InvoiceSummary from "../cart/InvoiceSummary";
import PurchaseCardDetils from "./PurchaseCardDetils";
import PurchaseCardDetails from "./PurchaseCardDetils";
import { parseDate, setdateTime } from "../../utils/operation/dateutilies";
import DetilsButtonCollops from "../../utils/component/DetilsButtonCollops";
import DiagonalRibbon from "../../components/cards/DiagonalRibbon";
const PurchaseCard = ({ schemas, item }) => {
  const localization = useSelector((state) => state.localization.localization);
  const parametersFirstSchema = schemas[0].dashboardFormSchemaParameters;
  const parametersSecondSchema = schemas[1].dashboardFormSchemaParameters;
  const [child, setChild] = useState(null);
  const selectedNode = useSelector(
    (state) => state.location.selectedNodePickup,
  );
  const selectedTab = useSelector((state) => state.location.selectedTab);
  const ordersFieldsType = {
    orderType: getField(parametersFirstSchema, "orderType"),
    orderState: getField(parametersFirstSchema, "orderState"),
    details: getField(parametersFirstSchema, "detailsCell", false),
    invoiceNumber: getField(parametersFirstSchema, "invoiceNumber"),
    requestedDatetime: getField(parametersFirstSchema, "datetime", false),

    isPaid: getField(parametersFirstSchema, "isPaid"),
    totalAmount: getField(parametersSecondSchema, "totalAmount", false),
    otherFeesAmount: getField(parametersSecondSchema, "otherFeesAmount", false),
    invoiceItemsTaxAmount: getField(
      parametersSecondSchema,
      "invoiceItemsTaxAmount",
      false,
    ),
    invoiceTaxAmount: getField(
      parametersSecondSchema,
      "invoiceTaxAmount",
      false,
    ),
    totalFeesAmount: getField(parametersSecondSchema, "totalFeesAmount", false),
    feesAmount: getField(parametersSecondSchema, "feesAmount", false),
    netAmount: getField(parametersSecondSchema, "netAmount", false),
    invoiceItemsDiscountAmount: getField(
      parametersSecondSchema,
      "invoiceItemsDiscountAmount",
      false,
    ),
    invoiceDiscountAmount: getField(
      parametersSecondSchema,
      "invoiceDiscountAmount",
      false,
    ),
    totalDiscountAmount: getField(
      parametersSecondSchema,
      "totalDiscountAmount",
      false,
    ),
    totalTaxAmount: getField(parametersSecondSchema, "totalTaxAmount", false),
    totalShipmentsNeeded: getField(
      parametersSecondSchema,
      "totalShipmentsNeeded",
      false,
    ),

    netPayAmount: getField(parametersSecondSchema, "netPayAmount", false),

    shipmentFees: getField(parametersSecondSchema, "shipmentFees", false),
    otherFees: getField(parametersSecondSchema, "otherFees", false),
    creditField: getField(parametersSecondSchema, "accountCreditUsed", false),
    displayAddress: getField(parametersSecondSchema, "displayAddress", false),
    displayNode: getField(parametersSecondSchema, "displayNode"),
    orderTypeIndex: getField(parametersSecondSchema, "orderTypeIndex"),
    pointsField: getField(parametersSecondSchema, "loyaltyPointsUsed", false),
    customerRate: getField(parametersSecondSchema, "customerRate"),
    customerReview: getField(parametersSecondSchema, "customerReview"),
    idField: schemas[0].idField,
    itemidField: schemas[1].idField,
    dataSourceName: schemas[0].dataSourceName,
    proxyRoute: schemas[0].projectProxyRoute,
    paymentMethodID: getField(parametersSecondSchema, "paymentMethodID"),
    paymentMethodName: getField(parametersSecondSchema, "paymentMethodName"),
  };
  // const getAddress = () => {
  //   return `${selectedLocation[displayLookupParamAddress.lookupDisplayField]}`;
  // };
  // Get the correct step labels based on orderType
  const getStepLabels = (orderType) => {
    const pickupSteps = localization.Hum_screens.orders.pickupSteps;
    const deliverySteps = localization.Hum_screens.orders.deliverySteps;
    return orderType === 0 ? pickupSteps : deliverySteps;
  };
  const labels = getStepLabels(item[ordersFieldsType.orderType]);
  const [parentWidth, setParentWidth] = React.useState(0);
  const [parentHeight, setParentHeight] = React.useState(0);
  return (
    <View
      onLayout={(e) => {
        setParentWidth(e.nativeEvent.layout.width);
        setParentHeight(e.nativeEvent.layout.height);
      }}
      // key={item[ordersFieldsType.idField]}
      className="!bg-body p-4 rounded-xl mb-2 overflow-hidden"
    >
      <View>
        <Text style={styles.date}>
          {setdateTime(item[ordersFieldsType.requestedDatetime.parameterField])}
        </Text>
      </View>

      <StepHeader
        currentPosition={item[ordersFieldsType.orderState]}
        labels={labels}
        customKey={`${item[ordersFieldsType.idField]}-${
          ordersFieldsType.orderState
        }-${item[ordersFieldsType.orderState]}`}
      />
      {/* <View className="mb-4">
        <Invoice.BranchAndAddress
          nodeFieldName={displayLookupParamNode}
          getAddress={getAddress}
          selectedNode={selectedNode}
        />
      </View> */}
      {child && child}
      <DetilsButtonCollops
        DetailsComponent={
          <PurchaseCardDetails
            purchaseCardItem={item}
            ordersFieldsType={ordersFieldsType}
          />
        }
        child={child}
        setChild={setChild}
      />
      {ordersFieldsType.isPaid && item[ordersFieldsType.isPaid] && (
        <DiagonalRibbon
          diagonalKey={`${item[ordersFieldsType.idField]}-${
            ordersFieldsType.isPaid
          }-${item[ordersFieldsType.isPaid]}`}
          text={localization.Hum_screens.orders.paid}
          color={theme.accentHover}
          parentWidth={parentWidth}
          parentHeight={parentHeight}
          txtColor={theme.body}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  date: {
    fontSize: 14,
    fontWeight: 800,
    textAlign: "center",
    textShadowRadius: 2,
  },
});
export default PurchaseCard;
