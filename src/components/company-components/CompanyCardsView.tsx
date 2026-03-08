import React, { useLayoutEffect, useState } from "react";
import { ScrollView, View } from "react-native";

// import { createRowCache } from "@devexpress/dx-react-grid";
import { useNavigation } from "@react-navigation/native";
import ActionBar from "../cards/ActionBar";
import HeaderParent from "../header/HeaderParent";
// import { createRowCache } from "../Pagination/createRowCache";
import { useSelector } from "react-redux";
import { useCart } from "../../../context/CartProvider";
import { useSchemas } from "../../../context/SchemaProvider";
import { useSearch } from "../../../context/SearchProvider";
import RenderLoadingItems from "../../utils/component/RenderLoadingItems";
import { SetResponsiveContainer } from "../../utils/component/SetResponsiveContainer";
import SkeletonMenuCardWeb from "../skeletonLoading/SkeletonMenuCardWeb";
import CompanyCardsFlatList from "./CompanyCardsVirtualized";
import { SearchTabs } from "./SearchTabs";
import CompanyCard from "../cards/CompanyCard";
import CompanyCardView from "./CompanyCardView";
import { initCompanyRows } from "./tabsData";
const CompanyCardsView = ({}: any) => {
  const { cartState, cartFieldsType } = useCart();
  const { menuItemsState } = useSchemas();

  const { handleScroll, state } = useSearch();
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
        rows={state.rows}
        fieldsType={fieldsType}
        cartState={{ rows: [] }}
        menuItemsState={menuItemsState}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        CardComponent={CompanyCardView}
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
