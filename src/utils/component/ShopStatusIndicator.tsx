import React, { act, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  convertUTCToLocalTime,
  getMinutesFromTime,
} from "../operation/handleLocalTime";
import { isRTL } from "../operation/isRTL";
import { theme } from "../../Theme";
import { useSchemas } from "../../../context/SchemaProvider";
import { ConnectToWS } from "../WS/ConnectToWS";
import { WSMessageHandler } from "../WS/handleWSMessage";
import { useWS } from "../../../context/WSProvider";
import {
  selectSelectedNode,
  updateOrderStatus,
  updateSelectedNode,
} from "../../reducers/LocationReducer";
import { updateOrderStatusLive } from "../operation/updateOrderStatusLive";

const ShopStatusIndicator = () => {
  const orderStatus = useSelector((state) => state.location.orderStatus);
  const workingHours = useSelector((state) => state.location.workingHours);
  const selectedNode = useSelector((state) => state.location.selectedNode);
  const localization = useSelector((state) => state.localization.localization);
  const node = useSelector(selectSelectedNode);
  const [node_WS_Connected, setNodeWS_Connected] = useState(false);
  const { _wsMessageNode, setWSMessageNode } = useWS();
  const [minutesToClose, setMinutesToClose] = useState<number>(0);
  const { nearestBranchesState } = useSchemas();
  const dispatch = useDispatch();

  const nodeFieldTypes = {
    idField: nearestBranchesState.schema.idField,
    dataSourceName: nearestBranchesState.schema.dataSourceName,
  };
  const activeNode =
    nearestBranchesState.schema.dashboardFormSchemaParameters.find(
      (pram) => pram.parameterType == "active",
    )?.parameterField;
  const wsAction =
    nearestBranchesState.actions &&
    nearestBranchesState.actions.find(
      (action) => action.dashboardFormActionMethodType === "ws",
    );
  useEffect(() => {
    updateOrderStatusLive(workingHours, dispatch, setMinutesToClose);
    return () => clearInterval(6000);
  }, [workingHours, selectedNode]); // ✅ removed orderStatus here
  //ws
  useEffect(() => {
    // 🌐 WebSocket connect effect

    if (node_WS_Connected) return;
    let cleanup;
    ConnectToWS(
      setWSMessageNode,
      setNodeWS_Connected,
      nodeFieldTypes.dataSourceName,
      [node],
      wsAction,
    )
      .then(() => {})
      .catch((e) => {
        console.error("❌ node WebSocket error", e);
      });
    return () => {
      if (cleanup) cleanup(); // Clean up when component unmounts or deps change
    };
  }, [node_WS_Connected]);

  // ✅ Callback to update reducer
  const nodeCallbackReducerUpdate = async (node_ws_updatedRows) => {
    dispatch(
      updateSelectedNode(
        node_ws_updatedRows.rows.length > 0 ? node_ws_updatedRows.rows[0] : {},
      ),
    );
  };

  // 📨 WebSocket message handler
  useEffect(() => {
    if (!_wsMessageNode) return;

    const handlerCartWSMessage = new WSMessageHandler({
      _WSsetMessage: _wsMessageNode, // match param name
      fieldsType: nodeFieldTypes,
      rows: [node],
      totalCount: 1,
      callbackReducerUpdate: nodeCallbackReducerUpdate,
    });
    handlerCartWSMessage.process();
  }, [_wsMessageNode]);
  // Only display when closed or near close
  //if (orderStatus !== "closed" && orderStatus !== "nearClosed") return null;

  const [shopState, setShopState] = useState(localization.workingHours.closed);
  const [shopStateColor, setShopStateColor] = useState(theme.error);
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateOrderStatusLive(workingHours, dispatch, setMinutesToClose);
    }, 60000); // every 1 minute

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);
  useEffect(() => {
    if (orderStatus === "closed") {
      setShopState(localization.workingHours.closed);
      setShopStateColor(theme.error);
    } else if (!node[activeNode]) {
      setShopState(localization.workingHours.emergenClosed);
      setShopStateColor(theme.error);
      dispatch(updateOrderStatus("closed"));
    } else if (orderStatus === "nearClosed") {
      setShopState(
        localization.workingHours.nearClosed.replace(
          "{minutesToClose}",
          minutesToClose,
        ) + ` ${minutesToClose} ${localization.workingHours.minutes}`,
      );
      setShopStateColor(theme.accent);
    }
  }, [orderStatus, minutesToClose, node]); // recalc when status changes

  return (
    orderStatus !== "open" && (
      <View
        key={`${shopState}`}
        style={[styles.container, { backgroundColor: "rgba(0,0,0,0.5)" }]}
        className={`${isRTL() ? "!left-5 " : "!right-5 "}`}
      >
        <Ionicons name="time" size={24} color={shopStateColor} />
        <Text
          key={`${shopState}`}
          style={[styles.text, { color: shopStateColor }]}
        >
          {shopState}
        </Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    zIndex: 999,
  },
  text: {
    marginLeft: 6,
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ShopStatusIndicator;
