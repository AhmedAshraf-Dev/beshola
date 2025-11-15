import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import { VStack } from "../../../components/ui";
import { useNetwork } from "../../../context/NetworkContext";
import { useSchemas } from "../../../context/SchemaProvider";
import { useWS } from "../../../context/WSProvider";
import OrderCard from "../../components/cards/OrderCard";
import { createRowCache } from "../../components/Pagination/createRowCache";
import { getRemoteRows } from "../../components/Pagination/getRemoteRows";
import {
  initialState,
  OFF_SET_SCROLL,
  VIRTUAL_PAGE_SIZE,
} from "../../components/Pagination/initialState";
import reducer from "../../components/Pagination/reducer";
import OrderCardSkeleton from "../../components/skeletonLoading/OrderCardSkeleton";
import SkeletonWrapper from "../../utils/component/SkeletonLoading.web";
import { getItemsLoadingCount } from "../../utils/operation/getItemsLoadingCount";
import { prepareLoad } from "../../utils/operation/loadHelpers";
import { ConnectToWS } from "../../utils/WS/ConnectToWS";
import { WSMessageHandler } from "../../utils/WS/handleWSMessage";
import RenderLoadingItems from "../../utils/component/RenderLoadingItems";
import CompanyCardsView from "../../components/company-components/CompanyCardsView";
import CompanyCardsFlatList from "../../components/company-components/CompanyCardsVirtualized";
import { useCart } from "../../../context/CartProvider";
import { useMenu } from "../../../context/MenuProvider";
export default function RequestsScreen({}) {
  const {
    status: { isConnected: isOnline },
  } = useNetwork();
  const itemsLoadingCount = useMemo(() => getItemsLoadingCount(), []);

  const { orderState } = useSchemas();
  const localization = useSelector((state) => state.localization.localization);
  const { _wsMessageOrders, setWSMessageOrders } = useWS();
  const [WS_Connected, setWS_Connected] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [reqError, setReqError] = useState(null);
  const [disable, setDisable] = useState(null);
  const [row, setRow] = useState(null);
  const [col, setCol] = useState({});
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, orderState.schema[0].idField)
  );
  const [currentSkip, setCurrentSkip] = useState(1);
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,

      ...row,
    });
  };
  const cache = createRowCache(VIRTUAL_PAGE_SIZE);
  const getAction =
    orderState.actions &&
    orderState.actions.find(
      (action) => action.dashboardFormActionMethodType === "Get"
    );

  const { rows, skip, totalCount, loading } = state;
  useEffect(() => {
    prepareLoad({
      state,
      dataSourceAPI,
      getAction,
      cache,
      reducerDispatch,
    });

    // Call LoadData with the controller
  }, [currentSkip]);
  //WS
  useEffect(() => {
    setWS_Connected(false);
  }, [isOnline]);
  // 🌐 Setup WebSocket connection on mount or WS_Connected change
  useEffect(() => {
    if (WS_Connected) return;
    let cleanup;
    ConnectToWS(setWSMessageOrders, setWS_Connected)
      .then(() => console.log("🔌 WebSocket setup done"))
      .catch((e) => {
        console.error("❌ Cart WebSocket error", e);
      });
    return () => {
      if (cleanup) cleanup(); // Clean up when component unmounts or deps change
      console.log("🧹 Cleaned up WebSocket handler");
    };
  }, [WS_Connected]);

  // 🧠 Reducer callback to update rows
  const callbackReducerUpdate = async (ws_updatedRows) => {
    await reducerDispatch({
      type: "WS_OPE_ROW",
      payload: {
        rows: ws_updatedRows.rows,
        totalCount: ws_updatedRows.totalCount,
      },
    });
  };
  const fieldsType = {
    idField: orderState.schema[0].idField,
    dataSourceName: orderState.schema[0].dataSourceName,
  };

  // 📨 React to WebSocket messages only when valid
  useEffect(() => {
    if (!_wsMessageOrders) return;
    const _handleWSMessage = new WSMessageHandler({
      _WSsetMessage: _wsMessageOrders,
      fieldsType,
      rows,
      totalCount,
      callbackReducerUpdate,
    });
    _handleWSMessage.process();
    //setWSMessageMenuItem(_wsMessageMenuItem);
  }, [_wsMessageOrders]);
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - OFF_SET_SCROLL;

    if (isScrolledToBottom && rows.length < totalCount && !loading) {
      getRemoteRows(currentSkip, VIRTUAL_PAGE_SIZE * 2, reducerDispatch); //todo change dispatch by reducerDispatch
      setCurrentSkip(currentSkip + 1);
    }
  };
  //
  const { cartState, cartFieldsType } = useCart();
  const { menuItemsState } = useSchemas();

  const { menustate } = useMenu();
  const [selectedItems, setSelectedItems] = useState([]);
  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 20,
        marginTop: 10,
      }}
      className="!overflow-scroll"
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {!loading && rows?.length === 0 && (
        <View className="w-full flex-row justify-center items-center">
          <Text className="text-xl text-accent font-bold">
            {localization.Hum_screens.orders.noOrders}
          </Text>
        </View>
      )}
      <VStack className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <CompanyCardsFlatList
          fieldsType={fieldsType}
          cartState={cartState}
          menuItemsState={menuItemsState}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          rows={[
            {
              nodeMenuItemID: "f6d053b4-b873-4cea-b28f-21f369e78a1c",
              sku: "1233",
              price: 30.0,
              rewardPoints: 0.0,
              discount: 0.0,
              taxTypeID: "00000000-0000-0000-0000-000000000000",
              taxAmount: 0,
              size: 0,
              preparingTimeAmountPerMinute: 0,
              isFav: false,
              isActive: true,
              isAvailable: true,
              nodeID: "2421d86a-0043-441b-988a-e7cfad6273a7",
              node_Name: "MainNode",
              nodeAddress: "Minia/Default Street/Default Zone/1/1/A ",
              priceAfterDiscount: 30.0,
              menuItemID: "5ca158be-2685-4757-8866-0563808e21e1",
              rate: 5.0,
              numberOfOrders: 0,
              numberOfReviews: 0,
              numberOfLikes: 1,
              numberOfDislikes: 0,
              companyItemImage:
                "MenuItemImages\\MenuItemImages.jpg?v1/1/0001 12:00:00 AM?v1/1/0001 12:00:00 AM",
              menuCategoryName: "Foods",
              indexOflike: 1,
              pricePlans: [
                {
                  name: "3BR Standard",
                  price: "EGP 2,000,000",
                  area: 150,
                  paymentPlan: "10% downpayment - 6 years installments",
                  deliveryDate: "2026",
                },
                {
                  name: "3BR Premium",
                  price: "EGP 2,300,000",
                  area: 165,
                  paymentPlan: "15% downpayment - 7 years installments",
                  deliveryDate: "2027",
                },
                {
                  name: "4BR Duplex",
                  price: "EGP 3,000,000",
                  area: 210,
                  paymentPlan: "20% downpayment - 8 years installments",
                  deliveryDate: "2028",
                },
              ],
              menuCategoryID: "b7d65f7f-f87a-4fa6-beaa-d799ba77b9ce",
              menuItemName: "test123",
              menuItemDescription: "hghjasfjkhas",
              canReturn: true,
              keywords: "ttt,trtrt,test123",
              weightKg: 0,
              lengthCm: 0,
              widthCm: 0,
              heightCm: 0,
              packageDegree: 0,
              volume: 0,
              rating: 4.5,
              verified: true,
              companyName: "Beshola",
              propertyType: "Apartment",
              bedrooms: 3,
              bathrooms: 2,
              area: 165,
              location: "New Cairo, Egypt",
              viewers: 24,
            },
            {
              nodeMenuItemID: "f6d053b4-b873-4cea-b28f-21f369e78a1c",
              sku: "1233",
              price: 30.0,
              rewardPoints: 0.0,
              discount: 0.0,
              taxTypeID: "00000000-0000-0000-0000-000000000000",
              taxAmount: 0,
              size: 0,
              preparingTimeAmountPerMinute: 0,
              isFav: false,
              isActive: true,
              isAvailable: true,
              nodeID: "2421d86a-0043-441b-988a-e7cfad6273a7",
              node_Name: "MainNode",
              nodeAddress: "Minia/Default Street/Default Zone/1/1/A ",
              priceAfterDiscount: 30.0,
              menuItemID: "5ca158be-2685-4757-8866-0563808e21e1",
              rate: 5.0,
              numberOfOrders: 0,
              numberOfReviews: 0,
              numberOfLikes: 1,
              numberOfDislikes: 0,
              companyItemImage:
                "MenuItemImages\\MenuItemImages.jpg?v1/1/0001 12:00:00 AM?v1/1/0001 12:00:00 AM",
              menuCategoryName: "Foods",
              indexOflike: 1,
              pricePlans: [
                {
                  name: "3BR Standard",
                  price: "EGP 2,000,000",
                  area: 150,
                  paymentPlan: "10% downpayment - 6 years installments",
                  deliveryDate: "2026",
                },
                {
                  name: "3BR Premium",
                  price: "EGP 2,300,000",
                  area: 165,
                  paymentPlan: "15% downpayment - 7 years installments",
                  deliveryDate: "2027",
                },
                {
                  name: "4BR Duplex",
                  price: "EGP 3,000,000",
                  area: 210,
                  paymentPlan: "20% downpayment - 8 years installments",
                  deliveryDate: "2028",
                },
              ],
              menuCategoryID: "b7d65f7f-f87a-4fa6-beaa-d799ba77b9ce",
              menuItemName: "test123",
              menuItemDescription: "hghjasfjkhas",
              canReturn: true,
              keywords: "ttt,trtrt,test123",
              weightKg: 0,
              lengthCm: 0,
              widthCm: 0,
              heightCm: 0,
              packageDegree: 0,
              volume: 0,
              rating: 3,
              verified: true,
              companyName: "Porto",
              propertyType: "Villa",
              bedrooms: 6,
              bathrooms: 3,
              area: 250,
              location: "Elso3na,Egypt",
              viewers: 74,
            },
          ]}
        />
      </VStack>
      <RenderLoadingItems
        SkeletonComponent={OrderCardSkeleton}
        loading={loading}
        classNameContainer={
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3"
        }
        rows={rows}
      />
    </ScrollView>
  );
}
