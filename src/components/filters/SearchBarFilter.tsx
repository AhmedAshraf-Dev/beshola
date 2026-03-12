import { Button, Menu } from "@/components/ui";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View } from "react-native";
import Sheet from "../../utils/component/Sheet";
import MenuFilter from "./MenuFilter";
import { useSearch } from "../../../context/SearchProvider";
const SearchBarFilter = ({ schema, setRow, row }: any) => {
  const navigation = useNavigation();
  const [openSheet, setOpenSheet] = useState(false);
  // console.log(schema, "schema from search bar filter");
  const searchFilter = schema?.dashboardFormSchemaParameters?.find(
    (item: any) => item?.isIDField && item?.parameterType === "collapse",
  );
  const { filtersMap } = useSearch();

  return (
    <View>
      <Menu
        className="mx-4 self-center rounded-xl"
        placement="top"
        offset={5}
        onclick
        disabledKeys={["Settings"]}
        useRNModal={true}
        trigger={({ ...triggerProps }) => {
          return (
            <Button
              {...triggerProps}
              size="sm"
              className="rounded-full !bg-text"
              onPress={() => {
                // Navigate to "MenuFilter" and pass the params
                // navigation.navigate("MenuFilter");
                setOpenSheet(true);
              }}
            >
              <MaterialIcons
                name="filter-list"
                size={24}
                className="!text-body"
              />
            </Button>
          );
        }}
      />
      <Sheet
        isOpen={openSheet}
        onClose={() => {
          setOpenSheet(false);
        }}
      >
        {/* <></> */}
        <MenuFilter filtersMap={filtersMap} />
      </Sheet>
    </View>
  );
};

export default SearchBarFilter;
