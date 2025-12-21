import React from "react";
import { useSelector } from "react-redux";
import { Box, Input, InputField, InputSlot } from "@/components/ui";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { isRTL } from "../../utils/operation/isRTL";
import { useSchemas } from "../../../context/SchemaProvider";
import { useSearch } from "../../../context/SearchProvider";
import { theme } from "../../Theme";

const Searchbar = () => {
  // const { searchBarState } = useSchemas();
  const localization = useSelector((state) => state.localization.localization);
  // const firstPram = searchBarState.schema.dashboardFormSchemaParameters[0];
  // const { menuItemRow, setMenuItemRow } = useSearch();

  const handleSearch = (value: string) => {
    // setMenuItemRow({ ...menuItemRow, [firstPram.parameterField]: value });
  };

  // if (!searchBarState.schema) return null;

  return (
    <Box className="w-full">
      <Input
        variant="rounded"
        size="sm"
        className={`w-full h-10 flex-row items-center px-3`}
        style={{
          flexDirection: isRTL() ? "row-reverse" : "row",
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
        }}
      >
        {/* Text Input */}
        <InputField
          // value={menuItemRow[firstPram.parameterField]}
          onChangeText={handleSearch}
          placeholder={localization.Hum_screens.menu.search.placeholder}
          style={{
            flex: 1,
            color: theme.text,
            textAlign: isRTL() ? "right" : "left",
            fontSize: 14,
          }}
        />

        {/* Search Icon */}
        <InputSlot
          className="rounded-full h-6 w-6 flex items-center justify-center"
          style={{
            backgroundColor: theme.primary + "20", // subtle background
          }}
        >
          <FontAwesome name="search" size={16} color={theme.text} />
        </InputSlot>
      </Input>
    </Box>
  );
};

export default Searchbar;
