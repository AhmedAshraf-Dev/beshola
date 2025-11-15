import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { Box, HStack } from "../../../components/ui";
import { useDeviceInfo } from "../../utils/component/useDeviceInfo";
import Searchbar from "../search-bar/Searchbar";
import MenuCardsView from "./CompanyCardsView";
import { MenuTabs } from "./SearchTabs";
import SearchBarFilter from "../filters/SearchBarFilter";
import CompanyCardsView from "./CompanyCardsView";

const SearchView = ({}: any) => {
  const { width, height, os, modelName } = useDeviceInfo();

  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setKey((r) => r + 1);
    // Do your refresh logic here, e.g., reset row or re-fetch data
    // Simulate API delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const Content = (
    <>
      <HStack space="2xl" className="items-center md:my-2 !bg-surface">
        <View style={{ flex: 1 }}>
          <Searchbar />
        </View>
        {/* Optional filters */}
        <View style={{ flex: 0, minWidth: 50 }}>
          <SearchBarFilter />
        </View>
      </HStack>

      <Box
        className="md:px-0 -mt-4"
        style={{ paddingBottom: os === "web" ? 0 : 180 }}
        key={key}
      >
        <CompanyCardsView isRefreshed={key} />
      </Box>
    </>
  );

  return os === "web" ? (
    <>{Content}</>
  ) : (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {Content}
    </ScrollView>
  );
};

export default SearchView;
