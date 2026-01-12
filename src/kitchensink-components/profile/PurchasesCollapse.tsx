import { FontAwesome } from "@expo/vector-icons";
import { default as React, useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  HStack,
} from "../../../components/ui";
import { createRowCache } from "../../components/Pagination/createRowCache";
import { initialState } from "../../components/Pagination/initialState";
import reducer from "../../components/Pagination/reducer";
import DynamicTable from "../../components/table/DynamicTable";
import CustomerSaleInvoicesActions from "../../Schemas/Profile/CustomerSaleInvoicesActions.json";
import SaleInvoiceSchema from "../../Schemas/Profile/SaleInvoiceSchema.json";
import { prepareLoad } from "../../utils/operation/loadHelpers";
import { FlatList } from "react-native-gesture-handler";
import PurchaseCard from "./PurchaseCard";
import { isRTL } from "../../utils/operation/isRTL";
import { theme } from "../../Theme";
import RenderLoadingItems from "../../utils/component/RenderLoadingItems";
import OrderCardSkeleton from "../../components/skeletonLoading/OrderCardSkeleton";
// Example data
// const orders = [
//   {
//     totalAmount: 1980.0,
//     invoiceItemsTaxAmount: 0.0,
//     invoiceTaxAmount: 0.0,
//     totalTaxAmount: 0.0,
//     feesAmount: 1375.0,
//     saleInvoiceID: "0",
//     requestedDatetime: "2025-08-27T11:14:25.5569851",
//     invoiceItemsDiscountAmount: 198.0,
//     invoiceDiscountAmount: 0.0,
//     totalDiscountAmount: 198.0,
//     netAmount: 3157.0,
//     invoiceNumber: "111425556",
//     shiftID: "8a6fac55-4817-46ed-ad59-bfad0a1e9cf3",
//     orderStateTypeID: "00000000-0000-0000-0000-000000000000",
//     customerName: null,
//     customerContact: "010",
//     otherCustomerContact: "",
//     orderState: null,
//     orderType: null,
//     orderTypeIndex: 0,
//     orderStateIndex: 0,
//     customerID: "303c1fd6-8036-4ae1-b2a0-fa08d76f4ce7",
//     customerContactID: "0626d7aa-a295-4f16-b069-dc64548ab36a",
//     otherCustomerContactID: null,
//     note: null,
//     isPaid: true,
//     usingCredit: "77",
//     usingPoints: "55",
//     paymentMethodName: "Cash",
//     paymentMethodID: null,
//   },
//   {
//     totalAmount: 500.0,
//     invoiceItemsTaxAmount: 0.0,
//     invoiceTaxAmount: 0.0,
//     totalTaxAmount: 0.0,
//     requestedDatetime: "2025-08-27T11:14:25.5569851",

//     saleInvoiceID: "1",

//     feesAmount: 1375.0,
//     invoiceItemsDiscountAmount: 0.0,
//     invoiceDiscountAmount: 0.0,
//     totalDiscountAmount: 0.0,
//     netAmount: 1875.0,
//   },
//   {
//     totalAmount: 2480.0,
//     invoiceItemsTaxAmount: 0.0,
//     invoiceTaxAmount: 0.0,
//     totalTaxAmount: 0.0,
//     feesAmount: 1375.0,
//     saleInvoiceID: "2",
//     requestedDatetime: "2025-08-27T11:14:25.5569851",

//     invoiceItemsDiscountAmount: 198.0,
//     invoiceDiscountAmount: 0.0,
//     totalDiscountAmount: 198.0,
//     netAmount: 3657.0,
//   },
// ];
const VIRTUAL_PAGE_SIZE = 2;

const PurchasesCollapse = ({ schemas = SaleInvoiceSchema }) => {
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, schemas[0].idField),
  );
  const localization = useSelector((state) => state.localization.localization);
  const [currentPage, setCurrentPage] = useState(1);
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: Math.floor((skip + currentPage) / take) + 1,

      pageSize: take,
    });
  };
  const cache = createRowCache(VIRTUAL_PAGE_SIZE);
  const getAction =
    CustomerSaleInvoicesActions &&
    CustomerSaleInvoicesActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );

  const { rows, skip, totalCount, loading } = state;
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
    // Call LoadData with the controller
  }, [currentPage]);
  const getCollapse = (type) =>
    localization.Hum_screens.profile.collapses.find(
      (collapse) => collapse.type === type,
    );

  return (
    <Accordion
      defaultValue="orders"
      className="bg-body"
      isCollapsible
      isMultiple
    >
      <AccordionItem value="orders">
        <AccordionContent>
          {rows.map((order) => (
            <PurchaseCard schemas={schemas} item={order} />
          ))}
          {rows.length === 0 && !loading && (
            <View className="w-full flex-row justify-center items-center">
              <Text className="text-xl text-accent font-bold">
                {getCollapse("purchases").childrenText.noItems}
              </Text>
            </View>
          )}
          <RenderLoadingItems
            SkeletonComponent={OrderCardSkeleton}
            loading={loading}
            classNameContainer={""}
            rows={rows}
          />
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
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
    flexDirection: "row",
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
export default PurchasesCollapse;
