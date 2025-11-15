import { Box, Input, InputField, InputSlot } from "@/components/ui";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { useSelector } from "react-redux";
import { isRTL } from "../../utils/operation/isRTL";
import { useSchemas } from "../../../context/SchemaProvider";
import { useMenu } from "../../../context/MenuProvider";

const Searchbar = ({}) => {
  const { searchBarState } = useSchemas();
  const localization = useSelector((state) => state.localization.localization);
  const firstPram = searchBarState.schema.dashboardFormSchemaParameters[0];
  const { menuItemRow, setMenuItemRow } = useMenu();

  const handleSearch = (value) => {
    setMenuItemRow({ ...menuItemRow, [firstPram.parameterField]: value });
  };

  return (
    <Box className="w-full">
      {searchBarState.schema && (
        <Input
          variant="rounded"
          size="sm"
          className={`w-full h-10 border-border bg-surface flex-row ${
            isRTL() ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <InputField
            value={menuItemRow[firstPram.parameterField]}
            onChangeText={handleSearch}
            placeholder={localization.Hum_screens.menu.search.placeholder}
            style={{ textAlign: isRTL() ? "right" : "left" }}
          />
          <InputSlot className="rounded-full h-6 w-6 m-1.5 bg">
            {/* <InputIcon> */}
            <FontAwesome name="search" size={24} className="text-text" />
            {/* </InputIcon> */}
          </InputSlot>
        </Input>
      )}
    </Box>
  );
};

export default Searchbar;
