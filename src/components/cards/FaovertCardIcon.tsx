import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { scale } from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import { updateFavoriteItems } from "../../reducers/MenuItemReducer";
import FavoriteMenuItemsSchemaActions from "../../Schemas/MenuSchema/FavoriteMenuItemsSchemaActions.json";
import { theme } from "../../Theme";
import { onApply } from "../form-container/OnApply";
import { RunsSpacialAction } from "../../utils/operation/RunsSpacialAction";
import { Text } from "react-native";
export default function FaovertCardIcon({
  fieldsType,
  item,
  withAbsolutePos = true,
}) {
  const favoriteItems = useSelector((state) => state.menuItem.favoriteItems);
  const [isFavorite, setIsFavorite] = useState(item[fieldsType.isFav]);
  const dispatch = useDispatch();
  useEffect(() => {
    setIsFavorite(item[fieldsType.isFav]);
  }, [item]);
  async function handleFavoritePress() {
    const req = await RunsSpacialAction(
      "fav",
      item[fieldsType.idField],
      !isFavorite,
      FavoriteMenuItemsSchemaActions,
      fieldsType.proxyRoute,
    );
    if (req)
      if (isFavorite) {
        dispatch(updateFavoriteItems({ items: [item], ope: "delete" }));
      } else {
        dispatch(updateFavoriteItems({ items: [item], ope: "add" }));
      }
  }
  return (
    <TouchableOpacity
      onPress={handleFavoritePress}
      key={`${item[fieldsType.idField]}-${fieldsType.isFav}-${
        item[fieldsType.isFav]
      }`}
      style={{
        // position: "absolute",
        // top: scale(8),
        // left: scale(8),
        backgroundColor: theme.body,
        borderRadius: 20,
        padding: 6,
        zIndex: 10,
        opacity: 0.8,
      }}
      className={withAbsolutePos ? "absolute top-2 left-2" : "items-center"}
    >
      <FontAwesome5
        key={`${item[fieldsType.idField]}-${fieldsType.isFav}-${
          item[fieldsType.isFav]
        }`}
        name="heart"
        solid={isFavorite} // filled if favorite
        size={20}
        color="red"
      />
    </TouchableOpacity>
  );
}
