import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, HStack, Pressable, Text } from "../../../components/ui";
import { initialState, VIRTUAL_PAGE_SIZE } from "../Pagination/initialState";
import reducer from "../Pagination/reducer";
// import { createRowCache } from "@devexpress/dx-react-grid";
// import { createRowCache } from "../Pagination/createRowCache";
import { Flow } from "react-native-animated-spinkit";
import { ScrollView } from "react-native-gesture-handler";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import LoadData from "../../../components/hooks/APIsFunctions/LoadData";
import { useSearch } from "../../../context/SearchProvider";
import { useSchemas } from "../../../context/SchemaProvider";
import LoadingScreen from "../../kitchensink-components/loading/LoadingScreen";
import { isRTL } from "../../utils/operation/isRTL";
import { createRowCache } from "../Pagination/createRowCache";
import { getRemoteRows } from "../Pagination/getRemoteRows";
import { updateRows } from "../Pagination/updateRows";
import { ScreenWidth } from "../shared";
import { useTab } from "../../../context/TabsProvider";
export const SearchTabs = ({}: any) => {
  // Shop/GetMenuCategories?PageSize=11&PageNumber=1
  const {
    state,
    handleScroll,
    activeTab,
    setActiveTab,
    serviceTypesFieldsTypes,
  } = useTab();
  console.log("====================================");
  console.log(state, "searchBar");
  console.log("====================================");
  const { idField, tabDisplay: display } = serviceTypesFieldsTypes;
  //todo make sure when menu items change that depend on categoryId and filter and search by API and make caching
  //todo by in case offline make it with out api
  return (
    <Box className="border-b border-outline-50 md:border-b-0 md:border-transparent">
      <Box className="flex flex-row justify-between flex-wrap gap-5">
        <ScrollView
          onScroll={handleScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          inverted={isRTL()}
          contentContainerStyle={{
            direction: "inherit",
          }}
          key={activeTab}
        >
          <HStack
            space="lg"
            className={`mx-0.5 xl:gap-5 2xl:gap-6 flex ${
              isRTL() ? "flex-row" : "flex-row"
            } justify-center items-center w-full`}
            style={{ direction: "inherit", flexWrap: "nowrap" }}
          >
            {state.rows.map((tab) => {
              const isActive = activeTab?.[idField] === tab[idField];
              return (
                <Pressable
                  key={tab[idField]}
                  // ✅ Each tab is exactly half the screen width
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className={`px-4 py-2 mx-1 !w-1/3 rounded-full border ${
                    isActive
                      ? "border-accent bg-accent/10"
                      : "border-transparent hover:border-accent/40"
                  } transition-all duration-200`}
                  onPress={() => {
                    if (activeTab[idField] !== tab[idField]) {
                      console.log("====================================");
                      console.log(activeTab, tab, "setactive tabe");
                      console.log("====================================");
                      setActiveTab(tab);
                    }
                  }}
                >
                  <Text
                    size="sm"
                    className={`font-semibold ${
                      isActive ? "text-accent" : "text-dark_card"
                    }`}
                  >
                    {tab[display]}
                  </Text>
                </Pressable>
              );
            })}

            {state.loading && (
              <LoadingScreen LoadingComponent={<Flow size={40} />} />
            )}
          </HStack>
        </ScrollView>
      </Box>
    </Box>
  );
};
