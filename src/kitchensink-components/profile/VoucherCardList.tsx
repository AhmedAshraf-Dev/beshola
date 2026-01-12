import React, { useEffect, useReducer, useState } from "react";
import {
  Button,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import reducer from "../../components/Pagination/reducer";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import ScratchVoucherCard from "../../Schemas/MenuSchema/ScratchVoucherCard.json";
import ScratchVoucherCardActions from "../../Schemas/MenuSchema/ScratchVoucherCardActions.json";
import { prepareLoad } from "../../utils/operation/loadHelpers";
import { createRowCache } from "../../components/Pagination/createRowCache";
import { initialState } from "../../components/Pagination/initialState";
import { useSelector } from "react-redux";
import VoucherCard from "./VoucherCard";
import { isRTL } from "../../utils/operation/isRTL";

const VIRTUAL_PAGE_SIZE = 2;

const VoucherCardList = () => {
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, ScratchVoucherCard.idField),
  );
  const localization = useSelector((state) => state.localization.localization);
  const voucherLocale = localization.Hum_screens.profile.collapses.find(
    (collapse) => collapse.type === "vouchers",
  ).childrenText;

  const [currentPage, setCurrentPage] = useState(1);

  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: currentPage, // API usually expects 0-based index
      pageSize: take,
    });
  };

  const cache = createRowCache(VIRTUAL_PAGE_SIZE);
  const getAction =
    ScratchVoucherCardActions &&
    ScratchVoucherCardActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );

  const { rows, totalCount } = state;
  const totalPages = Math.ceil(totalCount / (VIRTUAL_PAGE_SIZE * 2));

  useEffect(() => {
    reducerDispatch({ type: "RESET_SERVICE_LIST" });
    prepareLoad({
      state,
      dataSourceAPI,
      getAction,
      cache,
      reducerDispatch,
    });
  }, [currentPage]);

  if (!rows.length)
    return (
      <Text style={{ direction: "inherit" }}>{voucherLocale.notFound}</Text>
    );

  // Responsive columns
  const screenWidth = Dimensions.get("window").width;
  const numColumns = screenWidth < 1460 ? 1 : 2;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          style={[
            styles.gridContainer,
            {
              flexDirection: "row",
              flexWrap: "wrap",
            },
          ]}
        >
          {rows.map((card, index) => (
            <View
              key={index}
              style={{
                width: `${100 / numColumns}%`,
                padding: 8,
              }}
            >
              <VoucherCard item={card} />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pagination Controls */}
      <View style={styles.paginationContainer}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <TouchableOpacity
            key={page}
            onPress={() => setCurrentPage(page)}
            style={[
              styles.pageButton,
              page === currentPage && styles.activePageButton,
            ]}
          >
            <Text
              style={[
                styles.pageButtonText,
                page === currentPage && styles.activePageButtonText,
              ]}
            >
              {page}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  gridContainer: {
    width: "100%",
  },
  paginationContainer: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "center",
    marginVertical: 10,
    flexWrap: "wrap",
    gap: 5,
  },
  pageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginHorizontal: 2,
  },
  activePageButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  pageButtonText: {
    color: "#000",
  },
  activePageButtonText: {
    color: "#fff",
  },
});

export default VoucherCardList;
