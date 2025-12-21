import React, { useEffect, useReducer, useState } from "react";
import { ScrollView } from "react-native";
import { Chase } from "react-native-animated-spinkit";
import { useSelector } from "react-redux";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import LoadData from "../../../components/hooks/APIsFunctions/LoadData";
import { HStack, Text } from "../../../components/ui";
import { useNetwork } from "../../../context/NetworkContext";
import { useSchemas } from "../../../context/SchemaProvider";
import { useShopNode } from "../../../context/ShopNodeProvider";
import { useWS } from "../../../context/WSProvider";
import { createRowCache } from "../../components/Pagination/createRowCache";
import { getRemoteRows } from "../../components/Pagination/getRemoteRows";
import {
  initialState,
  VIRTUAL_PAGE_SIZE,
} from "../../components/Pagination/initialState";
import reducer from "../../components/Pagination/reducer";
import { updateRows } from "../../components/Pagination/updateRows";
import { RenderSuggestCards } from "../../components/suggest/RenderSuggestCards";
import { getField } from "../../utils/operation/getField";
import { ConnectToWS } from "../../utils/WS/ConnectToWS";
import { WSMessageHandler } from "../../utils/WS/handleWSMessage";
import LoadingScreen from "../loading/LoadingScreen";
import { useAuth } from "../../../context/auth";
const FaovertMenuItems = () => {
  const { status, isOnline } = useNetwork();
  const [WS_Connected, setWS_Connected] = useState(false);
  const [currentSkip, setCurrentSkip] = useState(1);
  const { _wsMessageFav, setWSMessageFav } = useWS();
  const { favState, setFavState } = useSchemas();
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, favState.schema.idField)
  );
  const { userGust } = useAuth();

  const localization = useSelector((state) => state.localization.localization);

  const parameters = favState.schema?.dashboardFormSchemaParameters ?? [];
  const getAction =
    favState.actions &&
    favState.actions?.find(
      (action) => action.dashboardFormActionMethodType === "Get"
    );
  const reduxSelectedLocation = useSelector(
    (state: any) => state.location?.selectedLocation
  );
  const reduxSelectedNode = useSelector(
    (state: any) => state.location?.selectedNode
  );

  const [selectedLocation, setSelectedLocation] = useState(
    reduxSelectedLocation || null
  );
  const { selectedNode } = useShopNode();
  const favFieldsType = {
    imageView: getField(parameters, "menuItemImage"),
    text: getField(parameters, "menuItemName"),
    description: getField(parameters, "menuItemDescription"),
    price: getField(parameters, "price"),
    isAvailable: getField(parameters, "isAvailable"),
    discount: getField(parameters, "discount"),
    priceAfterDiscount: getField(parameters, "priceAfterDiscount"),
    rewardPoints: getField(parameters, "rewardPoints"),
    idField: favState.schema.idField,
    dataSourceName: favState.schema.dataSourceName,
    cardAction: getField(parameters, "cardAction"),
    isFav: getField(parameters, "isFav"),
  };
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,

      // ...row,
    });
  };
  const cache = createRowCache(VIRTUAL_PAGE_SIZE);
  const { rows, skip, totalCount, loading } = state;

  useEffect(() => {
    if (userGust) return;
    LoadData(
      state,
      dataSourceAPI,
      getAction,
      cache,
      updateRows(reducerDispatch, cache, state),
      reducerDispatch
    );
  }, [currentSkip, userGust]);
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isScrolledToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isScrolledToBottom && rows.length < totalCount && !loading) {
      getRemoteRows(currentSkip, VIRTUAL_PAGE_SIZE * 2, reducerDispatch); //todo change dispatch by reducerDispatch
      setCurrentSkip(currentSkip + 1);
    }
  };
  useEffect(() => {
    if (!selectedNode) return;
    setWS_Connected(false);
  }, [selectedNode, isOnline]);
  // 🌐 Setup WebSocket connection on mount or WS_Connected change
  useEffect(() => {
    if (WS_Connected) return;
    let cleanup;
    ConnectToWS(setWSMessageFav, setWS_Connected, favFieldsType.dataSourceName)
      .then(() => console.log("🔌 WebSocket setup done"))
      .catch((e) => {});
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

  // 📨 React to WebSocket messages only when valid
  useEffect(() => {
    if (!_wsMessageFav) return;
    const _handleWSMessage = new WSMessageHandler({
      _WSsetMessage: _wsMessageFav,
      fieldsType: favFieldsType,
      rows,
      totalCount,
      callbackReducerUpdate,
    });
    _handleWSMessage.process();
    //setWSMessageMenuItem(_wsMessageMenuItem);
  }, [_wsMessageFav]);
  if (loading) {
    return <LoadingScreen LoadingComponent={<Chase size={40} />} />;
  }
  return (
    <>
      <HStack className="flex-1 items-center justify-between">
        <Text>{localization.Hum_screens.home.faovert}</Text>
        <Text className="text-primary-custom">{rows.length}</Text>
      </HStack>
      {/* <HStack className="flex-wrap flex-row flex mx-2 mb-6"> */}
      {/* {favoriteItems.map((favoriteItem) => (
          // <TouchableOpacity
          //   onPress={() =>
          //     navigation.navigate("DetailsProductScreen", favoriteItem)
          //   }
          //   key={favoriteItem[fieldsType.idField]}
          //   className="relative w-1/3 md:w-1/4 aspect-square shrink border-[4px] border-card rounded-lg"
          // >
          //   <Card style={{ borderRadius: 12 }}>
          //     <VStack className="items-center">
          //       <Image
          //         source={GetMediaUrl(
          //           favoriteItem[fieldsType.imageView],
          //           "publicImage"
          //         )}
          //         className="!size-12 md:!size-28 aspect-square rounded-full"
          //         resizeMode="cover"
          //         alt=""
          //       />
          //       <Text className="mt-2 text-sm font-bold">
          //         {favoriteItem[fieldsType.text]}
          //       </Text>
          //     </VStack>
          //     <Icon
          //       as={() => (
          //         <AntDesign
          //           name="heart"
          //           size={16}
          //           className="absolute bottom-1 left-1 !text-red-500"
          //         />
          //       )}
          //     />
          //   </Card>
          // </TouchableOpacity>
          <SuggestCard
            key={favoriteItem[fieldsType.idField]}
            item={favoriteItem}
            schemaActions={SuggestCardSchemaActions}
          />
        ))} */}
      <ScrollView
        horizontal
        className="mt-2"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 12,
          alignItems: "flex-start",
        }}
      >
        <RenderSuggestCards
          items={rows}
          schemaActions={favState.actions}
          suggestContainerType={0}
          suggestFieldsType={favFieldsType}
        />
      </ScrollView>
      {/* </HStack> */}
    </>
  );
};

export default FaovertMenuItems;
