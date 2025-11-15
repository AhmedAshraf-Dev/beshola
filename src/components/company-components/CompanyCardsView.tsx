import React, { useLayoutEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import MenuCardView from "./CompanyCardView";
// import { createRowCache } from "@devexpress/dx-react-grid";
import { useNavigation } from "@react-navigation/native";
import ActionBar from "../cards/ActionBar";
import HeaderParent from "../header/HeaderParent";
// import { createRowCache } from "../Pagination/createRowCache";
import { useSelector } from "react-redux";
import { VStack } from "../../../components/ui";
import { useCart } from "../../../context/CartProvider";
import { useMenu } from "../../../context/MenuProvider";
import { useSchemas } from "../../../context/SchemaProvider";
import { SetResponsiveContainer } from "../../utils/component/SetResponsiveContainer";
import SkeletonWrapper from "../../utils/component/SkeletonLoading.web";
import SkeletonMenuCardWeb from "../skeletonLoading/SkeletonMenuCardWeb";
import { getItemPackage } from "./getItemPackage";
import MenuItemsVirtualized from "./CompanyCardsVirtualized";
import { getItemsLoadingCount } from "../../utils/operation/getItemsLoadingCount";
import RenderLoadingItems from "../../utils/component/RenderLoadingItems";
import OrderBy from "./OrderBy";
import { MenuTabs, SearchTabs } from "./SearchTabs";
import CompanyCardsFlatList from "./CompanyCardsVirtualized";
const CompanyCardsView = ({}: any) => {
  const { cartState, cartFieldsType } = useCart();
  const { menuItemsState } = useSchemas();

  const { handleScroll, state } = useMenu();
  const { rows, skip, totalCount, loading } = state;
  const [selectedItems, setSelectedItems] = useState([]);
  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);
  const navigation = useNavigation();
  const localization = useSelector((state) => state.localization.localization);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        selectedItems.length > 0 ? (
          <ActionBar
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        ) : (
          SetResponsiveContainer(<HeaderParent />, false)
        ),
    });
  }, [selectedItems, navigation]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      className="!overflow-scroll"
      scrollEventThrottle={16}
      // contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View className="my-5 flex-row justify-between items-center bg-surface p-3 rounded-2xl shadow-sm border border-outline-20">
        <View className="flex-1">
          <SearchTabs />
        </View>
      </View>

      {/* {rows.length === 0 && !loading && (
        <View className="w-full flex-row justify-center items-center">
          <Text className="text-xl text-accent font-bold">
            {localization.Hum_screens.menu.noItems}
          </Text>
        </View>
      )} */}
      {/*!for web*/}
      <CompanyCardsFlatList
        rows={[
          {
            nodeMenuItemID: "f6d053b4-b873-4cea-b28f-21f369e78a1c",
            sku: "1233",
            price: 30.0,
            rewardPoints: 0.0,
            discount: 0.0,
            taxTypeID: "00000000-0000-0000-0000-000000000000",
            taxAmount: 0,
            size: 0,
            preparingTimeAmountPerMinute: 0,
            isFav: false,
            isActive: true,
            isAvailable: true,
            nodeID: "2421d86a-0043-441b-988a-e7cfad6273a7",
            node_Name: "MainNode",
            nodeAddress: "Minia/Default Street/Default Zone/1/1/A ",
            priceAfterDiscount: 30.0,
            menuItemID: "5ca158be-2685-4757-8866-0563808e21e1",
            rate: 5.0,
            numberOfOrders: 0,
            numberOfReviews: 0,
            numberOfLikes: 1,
            numberOfDislikes: 0,
            companyItemImage:
              "MenuItemImages\\MenuItemImages.jpg?v1/1/0001 12:00:00 AM?v1/1/0001 12:00:00 AM",
            menuCategoryName: "Foods",
            indexOflike: 1,
            pricePlans: [
              {
                name: "3BR Standard",
                price: "EGP 2,000,000",
                area: 150,
                paymentPlan: "10% downpayment - 6 years installments",
                deliveryDate: "2026",
              },
              {
                name: "3BR Premium",
                price: "EGP 2,300,000",
                area: 165,
                paymentPlan: "15% downpayment - 7 years installments",
                deliveryDate: "2027",
              },
              {
                name: "4BR Duplex",
                price: "EGP 3,000,000",
                area: 210,
                paymentPlan: "20% downpayment - 8 years installments",
                deliveryDate: "2028",
              },
            ],
            menuCategoryID: "b7d65f7f-f87a-4fa6-beaa-d799ba77b9ce",
            menuItemName: "test123",
            menuItemDescription: "hghjasfjkhas",
            canReturn: true,
            keywords: "ttt,trtrt,test123",
            weightKg: 0,
            lengthCm: 0,
            widthCm: 0,
            heightCm: 0,
            packageDegree: 0,
            volume: 0,
            rating: 4.5,
            verified: true,
            companyName: "Beshola",
            propertyType: "Apartment",
            bedrooms: 3,
            bathrooms: 2,
            area: 165,
            location: "New Cairo, Egypt",
            viewers: 24,
          },
        ]}
        fieldsType={fieldsType}
        cartState={cartState}
        menuItemsState={menuItemsState}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <RenderLoadingItems
        SkeletonComponent={SkeletonMenuCardWeb}
        loading={loading}
        classNameContainer={
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-3"
        }
        rows={rows}
      />
    </ScrollView>
  );
};

// const schemaActions =

export default CompanyCardsView;
