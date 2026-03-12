// WSContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import reducer from "../src/components/Pagination/reducer";
import { initialState } from "../src/components/Pagination/initialState";
import { getField } from "../src/utils/operation/getField";
import { ConnectToWS } from "../src/utils/WS/ConnectToWS";
import { useNetwork } from "./NetworkContext";
import { useWS } from "./WSProvider";
import { WSMessageHandler } from "../src/utils/WS/handleWSMessage";
import { buildApiUrl } from "../components/hooks/APIsFunctions/BuildApiUrl";
import { useSelector } from "react-redux";
import { prepareLoad } from "../src/utils/operation/loadHelpers";
import { createRowCache } from "../src/components/Pagination/createRowCache";
import { useShopNode } from "./ShopNodeProvider";
import { useSchemas } from "./SchemaProvider";
import { useAuth } from "./auth";
import { onApply } from "../src/components/form-container/OnApply";
// Create context
export const CartContext = createContext(null);

// Context provider component
export const CartProvider = ({ children }) => {
  const { status, isOnline } = useNetwork();
  const { _wsMessageCart, setWSMessageCart } = useWS();
  const { cartSchemaState, nearestBranchesState } = useSchemas();
  const [cartState, cartReducerDispatch] = useReducer(
    reducer,
    initialState(4000, cartSchemaState?.schema?.idField), //!make pagination
  );
  const { userGust } = useAuth();
  const [reRequest, setReRequest] = useState(false);

  const [row, setRow] = useState({});

  const [cart_WS_Connected, setCartWS_Connected] = useState(false);
  const {
    rows: cartRows,
    totalCount: cartTotalCount,
    loading: cartLoading,
  } = cartState;
  const nodeIdField = nearestBranchesState.schema.idField;
  const parameters =
    cartSchemaState?.schema?.dashboardFormSchemaParameters ?? [];
  const getCustomerCartAction =
    cartSchemaState.actions &&
    cartSchemaState.actions?.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );
  const reduxSelectedLocation = useSelector(
    (state: any) => state.location?.selectedLocation,
  );
  const paymentRow = useSelector((state) => state.payment.paymentRow);

  const reduxSelectedNode = useSelector(
    (state: any) => state.location?.selectedNode,
  );

  const [selectedLocation, setSelectedLocation] = useState(
    reduxSelectedLocation || null,
  );
  const { cartInfoState, fastWayState } = useSchemas();
  const { selectedNode } = useShopNode();
  const cartFieldsType = {
    imageView: getField(parameters, "menuItemImage"),
    text: getField(parameters, "menuItemName"),
    description: getField(parameters, "menuItemDescription"),
    price: getField(parameters, "price"),
    rate: getField(parameters, "rate"),
    likes: getField(parameters, "likes"),
    dislikes: getField(parameters, "dislikes"),
    orders: getField(parameters, "orders"),
    reviews: getField(parameters, "reviews"),
    isAvailable: getField(parameters, "isAvailable"),
    nodeMenuItemID: getField(parameters, "nodeMenuItemID"),
    menuCategoryID: getField(parameters, "menuCategoryID"),
    idField: cartSchemaState?.schema?.idField,
    dataSourceName: cartSchemaState?.schema?.dataSourceName,
    cardAction: getField(parameters, "cardAction"),
    discount: getField(parameters, "discount"),
    priceAfterDiscount: getField(parameters, "priceAfterDiscount"),
    note: getField(parameters, "note"),
    proxyRoute: cartSchemaState?.schema?.projectProxyRoute,
  };
  // const postAction =
  //   fastWayState.actions &&
  //   fastWayState.actions.find(
  //     (action) => action.dashboardFormActionMethodType === "Post",
  //   );
  // const isInitial = useRef(true);
  // useEffect(() => {
  //   if (isInitial.current) {
  //     isInitial.current = false; // Skip the first run
  //     return;
  //   }
  //   if (cartRows.length === 0) return;
  //   const runEffect = async () => {
  //     try {
  //       const req = await onApply(
  //         { ...row, ...paymentRow, ...reduxSelectedLocation },
  //         null,
  //         true,
  //         postAction,
  //       );
  //       // You can use `req` if needed
  //       // console.log("API response:", req);
  //     } catch (error) {
  //       console.error("Error in onApply:", error);
  //     }
  //   };

  //   runEffect();
  // }, [row, paymentRow, reduxSelectedLocation, selectedNode]);
  // const selectedNodeRef = useRef(selectedNode);
  // useEffect(() => {
  //   // if (!selectedNode) return;
  //   // if (selectedNodeRef.current !== selectedNode) {
  //   //   selectedNodeRef.current = selectedNode;
  //   //   cartReducerDispatch({
  //   //     type: "RESET_SERVICE_LIST",
  //   //     payload: { lastQuery: "" },
  //   //   });
  //   // }
  //   prepareLoad({
  //     state: cartState,
  //     dataSourceAPI: cartDataSourceAPI,
  //     getAction: getCustomerCartAction,
  //     cache: createRowCache(4000),
  //     reducerDispatch: cartReducerDispatch,
  //     abortController: false,
  //     reRequest: true,
  //   });
  //   setReRequest(false);
  // }, [selectedNode]);
  // useEffect(() => {
  //   setCartWS_Connected(false);
  // }, [selectedNode, isOnline]);
  // useEffect(() => {
  //   // 🌐 WebSocket connect effect

  //   if (cart_WS_Connected) return;
  //   let cleanup;
  //   ConnectToWS(
  //     setWSMessageCart,
  //     setCartWS_Connected,
  //     cartFieldsType.dataSourceName,
  //   )
  //     .then(() => {})
  //     .catch((e) => {
  //       console.error("❌ Cart WebSocket error", e);
  //     });
  //   return () => {
  //     if (cleanup) cleanup(); // Clean up when component unmounts or deps change
  //   };
  // }, [cart_WS_Connected]);

  // // ✅ Callback to update reducer
  // const cartCallbackReducerUpdate = async (cart_ws_updatedRows) => {
  //   await cartReducerDispatch({
  //     type: "WS_OPE_ROW",
  //     payload: {
  //       rows: cart_ws_updatedRows.rows,
  //       totalCount: cart_ws_updatedRows.totalCount,
  //     },
  //   });
  // };

  // // 📨 WebSocket message handler
  // useEffect(() => {
  //   if (!_wsMessageCart) return;

  //   const handlerCartWSMessage = new WSMessageHandler({
  //     _WSsetMessage: _wsMessageCart, // match param name
  //     fieldsType: cartFieldsType,
  //     rows: cartRows,
  //     totalCount: cartTotalCount,
  //     callbackReducerUpdate: cartCallbackReducerUpdate,
  //   });
  //   handlerCartWSMessage.process();
  // }, [_wsMessageCart]);

  // const cartDataSourceAPI = (query, skip, take) => {
  //   return buildApiUrl(query, {
  //     pageIndex: skip + 1,
  //     pageSize: take,
  //     // ...row,
  //   });
  // };
  // const loadData = useCallback(() => {
  //   prepareLoad({
  // state: cartState,
  // dataSourceAPI: cartDataSourceAPI,
  // getAction: getCustomerCartAction,
  // cache: createRowCache(4000),
  // reducerDispatch: cartReducerDispatch,
  // abortController: false,
  // reRequest: true,
  //   });
  // }, [
  //   cartDataSourceAPI,
  //   getCustomerCartAction,
  //   cartReducerDispatch,
  //   cartState,
  //   selectedNode,
  // ]);
  // useEffect(() => {
  //   if (userGust) return;
  //   if (isOnline) {
  //     resetAndReload(); // Reload only when back online
  //   }
  // }, [selectedNode[nodeIdField], isOnline]);

  // const resetAndReload = useCallback(() => {
  //   cartReducerDispatch({
  //     type: "RESET_SERVICE_LIST",
  //     payload: { lastQuery: "" },
  //   });
  //   setTimeout(() => {
  //     console.log("====================================");
  //     console.log("run loadData");
  //     console.log("====================================");
  //     loadData();
  //   }, 0);
  // }, [loadData]);
  return (
    <CartContext.Provider
      value={{
        cartState,
        cartReducerDispatch,
        cartFieldsType,
        row,
        setRow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to consume the context
export const useCart = () => useContext(CartContext);
