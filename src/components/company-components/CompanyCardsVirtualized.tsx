import React, { useMemo, useRef, useState } from "react";
import { View, FlatList, useWindowDimensions } from "react-native";
import MenuCardView from "./CompanyCardView";
import { getItemPackage } from "./getItemPackage";
import SuggestCardContainer from "../suggest/SuggestCardContainer";
import { useSchemas } from "../../../context/SchemaProvider";
import { useMenu } from "../../../context/MenuProvider";
import PropertyCard from "../cards/PropertyCard";
import CompanyCardView from "./CompanyCardView";

const chunkArray = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

const CompanyCardsFlatList = ({
  rows = [],
  fieldsType,
  cartState,
  menuItemsState,
  selectedItems,
  setSelectedItems,
}) => {
  const { width } = useWindowDimensions();
  const { recommendedState } = useSchemas();
  // const { setVisibleItems } = useMenu();

  // Breakpoints -> number of columns
  const numColumns = useMemo(() => {
    if (width >= 1280) return 3;
    if (width >= 768) return 2;
    return 1;
  }, [width]);

  // Layout constants
  const GAP = 16;
  const PADDING_HORIZONTAL = 16;

  // cell width/height (for grid items)
  const { cellWidth, cellHeight, suggestionWidth } = useMemo(() => {
    const totalGap = GAP * (numColumns - 1);
    const totalPadding = PADDING_HORIZONTAL * 4 + 3;
    const availableWidth = width - totalGap - totalPadding;
    const cw = availableWidth / numColumns;
    return {
      cellWidth: cw,
      cellHeight: cw * 1.05, // tweak aspect ratio as you like
      suggestionWidth: availableWidth, // full-width content area (without outer padding)
    };
  }, [width, numColumns]);

  // Build "rows" data (each element is either a row or a suggestion full-row)
  const displayRows = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    const chunked = chunkArray(rows, numColumns); // [[...], [...], ...]
    const out = [];

    chunked.forEach((rowItems, rowIndex) => {
      out.push({ type: "row", items: rowItems, rowIndex });

      // after every 2 rows insert a suggestion (so after 2 full rows)
      if ((rowIndex + 1) % 2 === 0) {
        out.push({ type: "suggestion", rowIndex });
      }
    });

    return out;
  }, [rows, numColumns]);

  const renderRow = ({ item }) => {
    // if (item.type === "suggestion") {
    //   // full-width suggestion: keep same horizontal padding as rows
    //   return (
    //     <View
    //       style={{
    //         width: "100%",
    //         marginBottom: GAP,
    //         marginTop: GAP / 2,
    //       }}
    //     >
    //       <View
    //         style={{
    //           width: suggestionWidth,
    //         }}
    //       >
    //         <SuggestCardContainer
    //           schemaActions={recommendedState.actions}
    //           shownNodeMenuItemIDs={[]}
    //           suggestContainerType={0}
    //         />
    //       </View>
    //     </View>
    //   );
    // }

    // Normal row: render items horizontally
    if (item.type === "row") {
      return (
        <View
          style={{
            flexDirection: "row",
            marginBottom: GAP,
            gap: GAP,
          }}
        >
          {item.items.map((rowItem, idx) => (
            <View
              key={`${rowItem[fieldsType.idField] ?? idx}-${idx}`}
              style={{
                width: numColumns == 1 ? "100%" : cellWidth,
                // height: cellHeight,
                // marginRight: idx < item.items.length - 1 ? GAP : 0,
              }}
            >
              <CompanyCardView
                itemPackage={getItemPackage(
                  rowItem,
                  cartState.rows,
                  menuItemsState.schema,
                  fieldsType
                )}
                schemaActions={menuItemsState.actions}
                setSelectedItems={setSelectedItems}
                selectedItems={selectedItems}
              />
              {/* <PropertyCard /> */}
            </View>
          ))}

          {/* If last row has fewer items, render invisible placeholders to keep layout consistent */}
          {item.items.length < numColumns &&
            Array.from({ length: numColumns - item.items.length }).map(
              (_, k) => (
                <View
                  key={`placeholder-${k}`}
                  style={{
                    width: cellWidth,
                    // height: cellHeight,
                    marginLeft: GAP,
                    opacity: 0,
                  }}
                />
              )
            )}
        </View>
      );
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const ids: string[] = [];

    viewableItems.forEach((vi) => {
      if (vi.item.type === "row") {
        // Only push IDs from rows that are actually in the viewport
        ids.push(
          ...vi.item.items.map((rowItem) => rowItem[fieldsType.idField])
        );
      }
    });
    // setVisibleItems(ids);
  }).current;
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // only count item if at least 50% visible
    minimumViewTime: 100, // optional: ms in view before counting
  }).current;
  return (
    <FlatList
      data={displayRows}
      renderItem={renderRow}
      keyExtractor={(entry, i) =>
        entry.type === "row"
          ? `row-${entry.rowIndex}`
          : `suggest-${entry.rowIndex}-${i}`
      }
      numColumns={1}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig} // ✅ attach here
      // windowSize={5}
      // initialNumToRender={6}
      // maxToRenderPerBatch={6}
      key={numColumns}
      removeClippedSubviews={true} // Unmount components when outside of window
      initialNumToRender={2} // Reduce initial render amount
      maxToRenderPerBatch={1} // Reduce number in each render batch
      updateCellsBatchingPeriod={100} // Increase time between renders
      windowSize={7} // Reduce the window size
    />
  );
};

export default CompanyCardsFlatList;
