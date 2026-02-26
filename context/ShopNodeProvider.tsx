// WSContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedLocation,
  selectSelectedNode,
  updateCurrentLocation,
} from "../src/reducers/LocationReducer";
import { requestLocationPermission } from "../src/utils/component/requestLocationPermission";

// Create context
export const ShopNodeContext = createContext(null);

// Context provider component
export const ShopNodeProvider = ({ children }) => {
  const reduxSelectedNode = useSelector(selectSelectedNode);
  const [selectedNode, setSelectedNode] = useState(reduxSelectedNode || {});
  const reduxSelectedLocation = useSelector(selectSelectedNode);
  const [selectedLocation, setSelectedLocation] = useState(
    reduxSelectedLocation || {},
  );

  const [locationLatitudePoint, setLocationLatitudePoint] = useState();
  const [locationLongtudePoint, setLocationLongtudePoint] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    let intervalId;

    const getAndSetLocation = async () => {
      const coords = await requestLocationPermission();
      if (coords) {
        console.log("coords", coords);

        dispatch(updateCurrentLocation(coords));
        setLocationLatitudePoint(coords.latitude);
        setLocationLongtudePoint(coords.longitude);
      }
    };

    // run once immediately
    getAndSetLocation();

    // run every 5 minutes
    intervalId = setInterval(getAndSetLocation, 5 * 60 * 1000);

    // cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ShopNodeContext.Provider
      value={{
        selectedNode,
        setSelectedNode,
        selectedLocation,
        setSelectedLocation,
        locationLatitudePoint,
        setLocationLatitudePoint,
        locationLongtudePoint,
        setLocationLongtudePoint,
      }}
    >
      {children}
    </ShopNodeContext.Provider>
  );
};

// Custom hook to consume the context
export const useShopNode = () => useContext(ShopNodeContext);
