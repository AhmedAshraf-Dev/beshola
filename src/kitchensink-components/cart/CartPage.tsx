import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
// import { LocalizationContext } from "../../../context/LocalizationContext";
import { Chase } from "react-native-animated-spinkit";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import useFetchWithoutBaseUrl from "../../../components/hooks/APIsFunctions/UseFetchWithoutBaseUrl";
import { useCart } from "../../../context/CartProvider";
import { useNetwork } from "../../../context/NetworkContext";
import { useSchemas } from "../../../context/SchemaProvider";
import { useWS } from "../../../context/WSProvider";
import GoBackHeader from "../../components/header/GoBackHeader";
import SuggestCardContainer from "../../components/suggest/SuggestCardContainer";
import AddressLocationCollapsible from "../../utils/component/AddressLocationCollapsible";
import PrivacyCheckbox from "../../utils/component/PrivacyCheckbox";
import { getField } from "../../utils/operation/getField";
import { isRTL } from "../../utils/operation/isRTL";
import { ConnectToWS } from "../../utils/WS/ConnectToWS";
import { WSMessageHandler } from "../../utils/WS/handleWSMessage";
import LoadingScreen from "../loading/LoadingScreen";
import CardCartItem from "./CardCartItem";
import Checkout from "./Checkout";
import InvoiceSummary from "./InvoiceSummary";
import PaymentMethods from "./PaymentMethods";
import PaymentOptions from "./PaymentOptions";
const ITEM_HEIGHT = 330;
const CartPage = () => {
  const [shownNodeMenuItemIDs, setShownNodeMenuItemIDs] = useState([]);
  const { cartState, cartReducerDispatch, cartFieldsType, row, setRow } =
    useCart();
  const [openCheckout, setOpenCheckout] = useState(false);
  const navigation = useNavigation();
  const localization = useSelector((state) => state.localization.localization);
  const [cartInfo, setCartInfo] = useState({});
  const { _wsMessageCartInfo, setWSMessageCartInfo } = useWS();
  const [cartInfo_WS_Connected, setCartInfoWS_Connected] = useState(false);
  const [summaryRow, setSummaryRow] = useState({});

  const {
    cartInfoState,
    fastWayState,
    paymentMethodsState,
    recommendedState,
    cartSchemaState,
  } = useSchemas();
  const dataSourceAPI = (query) =>
    buildApiUrl(query, {
      pageIndex: 1,
      pageSize: 1000,
    });

  const getAction =
    paymentMethodsState.actions &&
    paymentMethodsState.actions?.find(
      (action) => action?.dashboardFormActionMethodType?.toLowerCase() === "get"
    );
  const paymentMethodsUrl = useMemo(
    () => (getAction ? dataSourceAPI(getAction) : null),
    [getAction]
  );
  const { data: paymentMethods, isLoading } =
    useFetchWithoutBaseUrl(paymentMethodsUrl);

  const getCustomerCartAction = cartInfoState?.actions?.find(
    (action) => action.dashboardFormActionMethodType === "Get"
  );
  const cartInfoUrl = useMemo(
    () => buildApiUrl(getCustomerCartAction, {}),
    [getCustomerCartAction]
  );

  const { data: GetCustomerCartInfo, isLoading: cartInfoLoading } =
    useFetchWithoutBaseUrl(cartInfoUrl);

  // Get schema parameters
  ////cart
  const {
    rows: cartRows,
    totalCount: cartTotalCount,
    loading: cartLoading,
  } = cartState;

  const params = cartInfoState.schema?.dashboardFormSchemaParameters ?? [];

  const cartInfoFieldsType = {
    idField: cartInfoState.schema.idField,
    dataSourceName: cartInfoState.schema.dataSourceName,
    proxyRoute: cartInfoState.schema.projectProxyRoute,
    totalAmount: getField(params, "totalAmount", false),
    invoiceItemsTaxAmount: getField(params, "invoiceItemsTaxAmount", false),
    invoiceTaxAmount: getField(params, "invoiceTaxAmount", false),
    totalFeesAmount: getField(params, "totalFeesAmount", false),
    otherFeesAmount: getField(params, "otherFeesAmount", false),
    feesAmount: getField(params, "feesAmount", false),
    netAmount: getField(params, "netAmount", false),
    invoiceItemsDiscountAmount: getField(
      params,
      "invoiceItemsDiscountAmount",
      false
    ),
    invoiceDiscountAmount: getField(params, "invoiceDiscountAmount", false),
    totalDiscountAmount: getField(params, "totalDiscountAmount", false),
    totalTaxAmount: getField(params, "totalTaxAmount", false),
    totalShipmentsNeeded: getField(params, "totalShipmentsNeeded", false),
    shipmentFees: getField(params, "shipmentFees", false),
    otherFees: getField(params, "otherFees", false),
    netPayAmount: getField(params, "netPayAmount", false),
    creditField: getField(params, "inputWithLabel", false),
    pointsField: getField(params, "additionalInputWithLabel", false),
  };
  useEffect(() => {
    setCartInfo(GetCustomerCartInfo);
  }, [GetCustomerCartInfo]);

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
      fieldsType: cartInfoFieldsType,
      rows: [cartInfo],
      totalCount: 0,
      callbackReducerUpdate: cartCallbackReducerUpdate,
    });
    handlerCartWSMessage.process();
  }, [_wsMessageCartInfo]);

  const pressHandler = () => {
    if (Platform.OS === "web") {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      navigation.navigate("Home");
    }
  };
  // useEffect(() => {
  //   if (cartRows.length === 0) {
  //     setCartInfo({});
  //   } else {
  //     setCartInfo(GetCustomerCartInfo);
  //   }
  // }, [cartRows]);

  // const oldCartButton = (
  //   <TouchableOpacity className="p-1">
  //     <View className="relative">
  //       <MaterialCommunityIcons
  //         name="clipboard-clock-outline"
  //         size={28}
  //         color="black"
  //       />
  //       {oldCartCount > 0 && (
  //         <View className={`absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 items-center justify-center ${
  //           I18nManager.isRTL ? "-left-1" : "-right-1"
  //         }`}>
  //           <Text className="text-white text-[10px] font-bold">
  //             {oldCartCount}
  //           </Text>
  //         </View>
  //       )}
  //     </View>
  //   </TouchableOpacity>
  // );
  const postCheckoutAction =
    cartInfoState?.actions &&
    cartInfoState?.actions?.find(
      (action) => action.dashboardFormActionMethodType === "Post"
    );
  const BottomButtons = () => {
    return (
      <View className="flex-row items-center justify-between bg-body py-4 border-t border-card px-2">
        <TouchableOpacity
          className="flex-1 bg-card py-3 me-2 rounded-lg"
          onPress={pressHandler}
        >
          <Text className="text-center text-text">
            {localization.Hum_screens.cart.addItemsButton}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            cartRows.length < 1 ? "bg-card" : "bg-accent"
          } flex-1 py-3 rounded-lg`}
          disabled={cartRows.length < 1 || cartInfoLoading == true}
          onPress={() => setOpenCheckout(true)}
        >
          <Text
            className={`text-center ${
              cartRows.length < 1 ? "text-text" : "text-body"
            }`}
          >
            {localization.Hum_screens.cart.checkoutButton}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const visibleHeight = event.nativeEvent.layoutMeasurement.height;

    const startIndex = Math.floor(offsetY / ITEM_HEIGHT);
    const endIndex = Math.min(
      cartRows.length - 1,
      Math.floor((offsetY + visibleHeight) / ITEM_HEIGHT)
    );

    const currentlyVisible = cartRows.slice(startIndex, endIndex + 1);

    setShownNodeMenuItemIDs(
      currentlyVisible.map((item) => item[cartFieldsType.nodeMenuItemID])
    );
  };
  useEffect(() => {
    if (shownNodeMenuItemIDs.length === 0 && cartRows.length > 0) {
      setShownNodeMenuItemIDs([cartRows[0][cartFieldsType.nodeMenuItemID]]);
    }
  }, [cartRows, cartLoading]);
  return (
    <View className="flex-1 bg-body">
      <Checkout
        postAction={postCheckoutAction}
        openCheckout={openCheckout}
        proxyRoute={cartFieldsType.proxyRoute}
        setOpenCheckout={setOpenCheckout}
        row={{
          ...row,
          ...summaryRow,
        }}
        setRow={setRow}
      />
      <GoBackHeader
        title={localization.Hum_screens.cart.header.title}
        subTitle={localization.Hum_screens.cart.header.subTitle}
        // rightComponent={<OldCartButton projectUrl={GetProjectUrl("")} />}
      />

      {/* Main layout

      <GoBackHeader
        title={localization.Hum_screens.cart.header.title}
        subTitle={localization.Hum_screens.cart.header.subTitle}
        rightComponent={<OldCartButton projectUrl={GetProjectUrl()} />}
      />
      */}
      <ScrollView className="flex-1 py-2 px-2 !overflow-scroll">
        <View className="w-full flex flex-col md:!flex-row gap-4">
          {/* LEFT COLUMN - CART + SUGGESTIONS */}

          {/* RIGHT COLUMN - PAYMENT */}
          <View className="flex-1 md:!order-5">
            <ScrollView
              contentContainerStyle={{}}
              className="!overflow-scroll"
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              <View className="overflow-y-auto" style={{ maxHeight: 690 }}>
                {cartRows.length > 0 &&
                  cartRows.map((item, index) => {
                    return (
                      <View className="mb-2" key={item[cartFieldsType.idField]}>
                        <CardCartItem
                          schemaActions={cartSchemaState.actions}
                          fieldsType={cartFieldsType}
                          item={item}
                        />
                      </View>
                    );
                  })}
                {cartRows.length === 0 && !cartLoading && (
                  <View className="items-center justify-center py-10">
                    <Text className="font-semibold text-lg text-accent">
                      {localization.Hum_screens.cart.emptyCart}
                    </Text>
                  </View>
                )}
              </View>
              {cartLoading && cartRows.length === 0 && (
                <View className="p-8 flex-row justify-center items-center">
                  <LoadingScreen LoadingComponent={<Chase size={40} />} />
                </View>
              )}
            </ScrollView>

            {/* Suggestions */}
            <View>
              <Text
                className="text-lg font-bold mt-6 mb-2"
                style={{ direction: isRTL() ? "rtl" : "ltr" }}
              >
                {localization.Hum_screens.cart.suggests}
              </Text>
              <View key={shownNodeMenuItemIDs}>
                <SuggestCardContainer
                  suggestContainerType={0}
                  schema={{}}
                  schemaActions={recommendedState.actions}
                  shownNodeMenuItemIDs={shownNodeMenuItemIDs}
                  // key={shownNodeMenuItemIDs}
                />
              </View>
            </View>
          </View>
          <View className="md:!w-[40%] lg:!w-[30%] md:!order-1">
            <View>
              <AddressLocationCollapsible />
            </View>
            {getAction && (
              <PaymentMethods
                paymentMethods={paymentMethods?.dataSource}
                row={row}
                isLoading={isLoading}
              />
            )}

            {/* <ShippingOptions /> */}
            <PaymentOptions
              InvoiceSummaryInfo={summaryRow}
              rootRow={row}
              setRootRow={setRow}
              schemaFieldsTypes={cartInfoFieldsType}
            />
            <View className="my-2">
              <PrivacyCheckbox
                row={row}
                setRow={setRow}
                fastWayState={fastWayState}
              />
            </View>

            <InvoiceSummary
              InvoiceSummaryInfo={cartInfo}
              summaryRow={summaryRow}
              setSummaryRow={setSummaryRow}
              schemaFieldsTypes={cartInfoFieldsType}
              row={row}
            />
            <View className="md:flex hidden">
              <BottomButtons />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="md:hidden flex">
        <BottomButtons />
      </View>
    </View>
  );
};

export default CartPage;
