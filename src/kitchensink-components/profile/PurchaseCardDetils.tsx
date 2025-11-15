import { default as React, useEffect, useReducer, useState } from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import ImageCardActions from "../../components/cards/ImageCardActions";
import { createRowCache } from "../../components/Pagination/createRowCache";
import {
  initialState,
  VIRTUAL_PAGE_SIZE,
} from "../../components/Pagination/initialState";
import reducer from "../../components/Pagination/reducer";
import OrderCardItemSkeleton from "../../components/skeletonLoading/OrderCardItemSkeleton";
import CustomerSaleInvoicesItems from "../../Schemas/Profile/CustomerSaleInvoicesItems.json";
import CustomerSaleInvoicesItemsActions from "../../Schemas/Profile/CustomerSaleInvoicesItemsActions.json";
import SkeletonWrapper from "../../utils/component/SkeletonLoading.web";
import { covertPointsToCredits } from "../../utils/operation/covertPointsToCredits";
import { GetFieldsItemTypes } from "../../utils/operation/GetFieldsItemTypes";
import { prepareLoad } from "../../utils/operation/loadHelpers";
import Invoice, { InvoiceProvider } from "../cart/InvoiceProvider";
import InvoiceSummary from "../cart/InvoiceSummary";
import PurchaseButtonsActions from "./PurchaseButtonsActions";
export default function PurchaseCardDetails({
  purchaseCardItem,
  ordersFieldsType,
}) {
  const saleInvoiceItemTypes = GetFieldsItemTypes(CustomerSaleInvoicesItems);
  const [cart_WS_Connected, setCartWS_Connected] = useState(false);

  const getAddress = () => {
    return `${
      purchaseCardItem[ordersFieldsType.displayAddress.parameterField]
    }`;
  };
  const localization = useSelector((state) => state.localization.localization);

  const usingCredits =
    parseFloat(
      purchaseCardItem?.[ordersFieldsType?.creditField?.parameterField]
    ) || 0;
  const usingPoints =
    covertPointsToCredits(
      parseFloat(
        purchaseCardItem?.[ordersFieldsType?.pointsField?.parameterField]
      )
    ) || 0;
  const requiredAmount =
    purchaseCardItem[ordersFieldsType.netPayAmount.parameterField];
  const paymentMethodsFieldsType = {
    name: ordersFieldsType.paymentMethodName,
    idField: ordersFieldsType.paymentMethodID,
  };
  const [state, reducerDispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, saleInvoiceItemTypes.idField)
  );
  const [currentSkip, setCurrentSkip] = useState(1);
  const dataSourceAPI = (query, skip, take) => {
    return buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      [ordersFieldsType.idField]: purchaseCardItem[ordersFieldsType.idField],

      // ...row,
    });
  };
  const cache = createRowCache(VIRTUAL_PAGE_SIZE);
  const getAction =
    CustomerSaleInvoicesItemsActions &&
    CustomerSaleInvoicesItemsActions.find(
      (action) => action.dashboardFormActionMethodType === "Get"
    );

  const { rows, skip, totalCount, loading } = state;
  const totalPages = Math.ceil(totalCount / (VIRTUAL_PAGE_SIZE * 2));

  useEffect(() => {
    prepareLoad({
      state,
      dataSourceAPI,
      getAction,
      cache,
      reducerDispatch,
    });
    // Call LoadData with the controller
  });

  return (
    <InvoiceProvider value={{}}>
      <Invoice>
        <View className="mb-4">
          <Invoice.BranchAndAddress
            nodeFieldName={ordersFieldsType.displayNode}
            getAddress={
              purchaseCardItem[ordersFieldsType.orderTypeIndex] == 0
                ? false
                : getAddress
            }
            selectedNode={purchaseCardItem}
          />
        </View>
        {loading && (
          <View>
            <SkeletonWrapper
              isLoading={loading}
              SkeletonComponent={OrderCardItemSkeleton} // optional, if you have a custom skeleton
              skeletonProps={{ width: "100%", height: 200, overFlow: "hidden" }}
            ></SkeletonWrapper>
          </View>
        )}
        <FlatList
          data={rows}
          keyExtractor={(item) => item[saleInvoiceItemTypes.idField]}
          renderItem={({ item }) => (
            <View className="flex-col gap-2">
              <DisplayItem fieldsType={saleInvoiceItemTypes} item={item} />
              <PurchaseButtonsActions
                item={item}
                fieldsType={ordersFieldsType}
              />
            </View>
          )}
        />

        <InvoiceSummary
          summaryRow={{}}
          setSummaryRow={() => {}}
          InvoiceSummaryInfo={purchaseCardItem}
          schemaFieldsTypes={ordersFieldsType}
          isExpanded={false}
          row={null}
        />
        <Invoice.UsingPointsAndCredits
          creditField={ordersFieldsType.creditField}
          pointsField={ordersFieldsType.pointsField}
          row={purchaseCardItem}
          usingCredits={usingCredits}
          usingPoints={usingPoints}
        />
        <Invoice.PaymentRow
          flatListRef={{}}
          paymentMethodsFieldsType={paymentMethodsFieldsType}
          paymentRow={purchaseCardItem}
        />
        <Invoice.RequiredAmount requiredAmount={requiredAmount} />
        {/* <PurchaseButtonsActions item={item} /> */}
      </Invoice>
    </InvoiceProvider>
  );
}

export const DisplayItem = ({ fieldsType, item }) => {
  const localization = useSelector((state) => state.localization.localization);

  return (
    <View className="grid grid-cols-3 mb-3">
      <ImageCardActions
        fieldsType={fieldsType}
        item={item}
        style={{
          borderRadius: moderateScale(20),
        }}
        className="!size-28"
        showFaovertIcon={false}
      />
      <View className="flex-row justify-between items-center col-span-2">
        <View
          className="px-2 overflow-auto max-w-24 sm:max-w-32"
          style={{ direction: "inherit" }}
        >
          <Text className="font-medium">{item[fieldsType.text]}</Text>
          {item[fieldsType.note] && (
            <View className="flex-row items-center justify-between bg-note px-3 !bg-dark_card mt-2 w-[90%]">
              {/* Note Text - takes up available space */}
              <View className="flex-1 py-2">
                <Text
                  className="text-text !bg-body text-lg rounded-md"
                  key={`${item[fieldsType.idField]}-${fieldsType.note}-${
                    item[fieldsType.note]
                  }`}
                >
                  {item[fieldsType.note]}
                </Text>
              </View>
            </View>
          )}

          <Text className="text-sm" style={{ direction: "inherit" }}>
            {localization.checkout.quantity}: {item[fieldsType.cardAction]}
          </Text>
        </View>
        <View className="items-end">
          {item[fieldsType.discount] > 0 && (
            <Text className="text-sm line-through text-red-400">
              {item[fieldsType.price].toFixed(2)}
              {localization.menu.currency}{" "}
            </Text>
          )}
          {item[fieldsType.priceAfterDiscount] >= 0 && (
            <Text className="text-base font-semibold text-green-600">
              {item[fieldsType.priceAfterDiscount].toFixed(2)}
              {localization.menu.currency}{" "}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
