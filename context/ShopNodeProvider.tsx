// WSContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedNode } from "../src/reducers/LocationReducer";

// Create context
export const ShopNodeContext = createContext(null);

// Context provider component
export const ShopNodeProvider = ({ children }) => {
  const reduxSelectedNode = useSelector(selectSelectedNode);
  const [selectedNode, setSelectedNode] = useState(reduxSelectedNode || {});
  return (
    <ShopNodeContext.Provider
      value={{
        selectedNode,
        setSelectedNode,
      }}
    >
      {children}
    </ShopNodeContext.Provider>
  );
};

// Custom hook to consume the context
export const useShopNode = () => useContext(ShopNodeContext);
