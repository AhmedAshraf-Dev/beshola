import { createSlice } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    locations: [],
    currentLocation: {}, //location of device
    selectedLocation: {}, //selected location from addresses
    customerSelectedLocation: {}, //pin selected location from addresses
    selectedNodePickup: {}, //selected node in case pickup
    selectedNodeAddresses: {}, //selected node in case specific address
    favoriteLocation: { lat: "", long: "" },
    workingHours: [],
    contacts: [],
    orderStatus: "closed",
    selectedTab: 0,
  },
  reducers: {
    updateLocations: (state, action) => {
      if (action.payload.type === "add") {
        state.locations.push(action.payload.location);
      }
    },
    updateSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
      if (action.payload == 0) {
        state.selectedLocation = {};
      } else {
        state.selectedLocation = state.customerSelectedLocation;
      }
    },
    updateCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
    },
    updateSelectedLocation: (state, action) => {
      // if (state.selectedTab == 0) {
      //   state.selectedLocation = {};
      // } else {
      state.selectedLocation = action.payload;
      state.customerSelectedLocation = action.payload;
      // }
    },

    updateWorkingHours: (state, action) => {
      state.workingHours = action.payload;
    },
    updateContacts: (state, action) => {
      state.contacts = action.payload;
    },
    updateSelectedNode: (state, action) => {
      if (state.selectedTab == 0) {
        state.selectedNodePickup = action.payload;
      } else {
        state.selectedNodeAddresses = action.payload;
      }
    },
    updateFavoriteLocation: (state, action) => {
      state.favoriteLocation = action.payload;
    },
    updateOrderStatus: (state, action) => {
      state.orderStatus = action.payload;
    },
  },
});
export const selectSelectedNode = (state) =>
  state?.location?.selectedTab == 0
    ? state.location?.selectedNodePickup
    : state.location?.selectedNodeAddresses;
export const selectSelectedLocation = (state) =>
  state?.location?.selectedTab == 0 ? {} : state.selectedLocation;
export const selectCurrentLocation = (state) =>
  state?.location?.currentLocation;
export const selectOrderStatus = (state) => state?.orderStatus;
export const {
  updateLocations,
  updateCurrentLocation,
  updateSelectedTab,
  updateSelectedLocation,
  updateSelectedNode,
  updateFavoriteLocation,
  updateWorkingHours,
  updateOrderStatus,
  updateContacts,
} = locationSlice.actions;

export default locationSlice.reducer;
