// WSContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import reducer from "../src/components/Pagination/reducer";
import {
  initialState,
  OFF_SET_SCROLL,
  VIRTUAL_PAGE_SIZE,
} from "../src/components/Pagination/initialState";
import { getField } from "../src/utils/operation/getField";
import { ConnectToWS } from "../src/utils/WS/ConnectToWS";
import { useNetwork } from "./NetworkContext";
import { useWS } from "./WSProvider";
import { WSMessageHandler } from "../src/utils/WS/handleWSMessage";
import { buildApiUrl } from "../components/hooks/APIsFunctions/BuildApiUrl";
import { useSelector } from "react-redux";
import { prepareLoad } from "../src/utils/operation/loadHelpers";
import { createRowCache } from "../src/components/Pagination/createRowCache";
import NodeMenuItemsSchema from "../src/Schemas/MenuSchema/NodeMenuItemsSchema.json";
import FavoriteMenuItemsSchema from "../src/Schemas/MenuSchema/FavoriteMenuItemsSchema.json";
import NodeMenuItemsSchemaActions from "../src/Schemas/MenuSchema/NodeMenuItemsSchemaActions.json";
import { useNavigation } from "@react-navigation/native";
import { getRemoteRows } from "../src/components/Pagination/getRemoteRows";
import ActionBar from "../src/components/cards/ActionBar";
import { SetResponsiveContainer } from "../src/utils/component/SetResponsiveContainer";
import HeaderParent from "../src/components/header/HeaderParent";
import { useShopNode } from "./ShopNodeProvider";
// Create context
export const MenuContext = createContext(null);

// Context provider component
export const MenuProvider = ({ children }) => {
  const [menuItemRow, setMenuItemRow] = useState({});
  const [reRequest, setReRequest] = useState(false);
  const languageRow = useSelector((state) => state.localization.languageRow);
  const { _wsMessageMenuItem, setWSMessageMenuItem } = useWS();
  const [WS_Connected, setWS_Connected] = useState(false);
  const previousRowRef = useRef({});

  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);
  const reduxSelectedLocation = useSelector(
    (state: any) => state.location?.selectedLocation
  );
  const reduxSelectedNode = useSelector(
    (state: any) => state.location?.selectedNode
  );

  const [selectedLocation, setSelectedLocation] = useState(
    reduxSelectedLocation || null
  );
  //const [selectedNode, setSelectedNode] = useState(reduxSelectedNode || null);
  // const selectedNode = selectSelectedNode(store.getState());
  // Add this ref:
  const previousControllerRef = useRef(null);
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, NodeMenuItemsSchema.idField)
  );
  const [currentSkip, setCurrentSkip] = useState(1);
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      ...menuItemRow,
    });
  };
  const cache = createRowCache(VIRTUAL_PAGE_SIZE);
  const getAction =
    NodeMenuItemsSchemaActions &&
    NodeMenuItemsSchemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get"
    );

  const { rows, skip, totalCount, loading } = state;
  const {
    status: { isConnected: isOnline },
  } = useNetwork();
  const { selectedNode, setSelectedNode } = useShopNode();
  const selectedNodeRef = useRef(selectedNode);
  useEffect(() => {
    // if (!selectedNode) return;
    if (selectedNodeRef.current !== selectedNode) {
      selectedNodeRef.current = selectedNode;
      reducerDispatch({
        type: "RESET_SERVICE_LIST",
        payload: { lastQuery: "" },
      });
    }
    const controller = new AbortController();
    prepareLoad({
      state,
      dataSourceAPI,
      getAction,
      cache,
      reducerDispatch,
      abortController: controller,
    });
    setReRequest(false);
    previousControllerRef.current = controller;
    return () => controller.abort();
    // Call LoadData with the controller
  }, [menuItemRow, selectedNode, currentSkip]);

  useEffect(() => {
    if (!selectedNode) return;
    setWS_Connected(false);
  }, [selectedNode]);
  // 🌐 Setup WebSocket connection on mount or WS_Connected change
  useEffect(() => {
    if (WS_Connected) return;

    let cleanup;
    ConnectToWS(setWSMessageMenuItem, setWS_Connected)
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
    if (!_wsMessageMenuItem) return;
    const _handleWSMessage = new WSMessageHandler({
      _WSsetMessage: _wsMessageMenuItem,
      fieldsType,
      rows,
      totalCount,
      callbackReducerUpdate,
    });
    _handleWSMessage.process();
    //setWSMessageMenuItem(_wsMessageMenuItem);
  }, [_wsMessageMenuItem]);
  useEffect(() => {
    if (!menuItemRow) return;
    if (JSON.stringify(previousRowRef.current) === JSON.stringify(menuItemRow))
      return;

    const prevRow = previousRowRef.current || {};
    const changedProps = Object.keys(menuItemRow).filter(
      (key) => menuItemRow[key] !== prevRow[key]
    );

    const changedKey = changedProps.length === 1 ? changedProps[0] : null;

    // Abort previous request only if same key changed
    if (
      changedKey &&
      previousControllerRef.current &&
      Object.keys(previousRowRef.current).length > 0
    ) {
      previousControllerRef.current.abort();
    }

    // Save current row for next comparison
    previousRowRef.current = menuItemRow;

    // Reset list and pagination
    reducerDispatch({ type: "RESET_SERVICE_LIST" });
    setCurrentSkip(1);
  }, [menuItemRow]);
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
  // const loadData = useCallback(() => {
  //   console.log("dataSourceAPI",menuItemRow,selectedNode);
  //   prepareLoad({
  //     state: state,
  //     dataSourceAPI: dataSourceAPI,
  //     getAction: getAction,
  //     cache: createRowCache(4000),
  //     reducerDispatch: reducerDispatch,
  //     abortController: false,
  //     reRequest: true,
  //   });
  // }, [dataSourceAPI, getAction, reducerDispatch, state, selectedNode]);
  // useEffect(() => {
  //   if (isOnline) {
  //     resetAndReload(); // Reload only when back online
  //   }
  // }, [ selectedNode]);
  // const resetAndReload = useCallback(() => {
  // reducerDispatch({
  //   type: "RESET_SERVICE_LIST",
  //   payload: { lastQuery: "" },
  // });
  //   setTimeout(() => {
  //     loadData();
  //   }, 0);
  // }, [loadData]);
  return (
    <MenuContext.Provider
      value={{
        menuItemRow,
        setMenuItemRow,
        state,
        reducerDispatch,
        handleScroll,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

// Custom hook to consume the context
export const useMenu = () => useContext(MenuContext);
