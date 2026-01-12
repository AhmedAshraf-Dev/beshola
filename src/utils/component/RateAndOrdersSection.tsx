import { View, Text } from "react-native";
import React from "react";
import { Platform } from "react-native";
import { scale } from "react-native-size-matters";
import StarsIcons from "./StarsIcons";
import GetIconMenuItem from "./GetIconMenuItem";
import { formatCount } from "../operation/formatCount";
import { theme } from "../../Theme";

export default function RateAndOrdersSection({ fieldsType, item }) {
  const isWeb = Platform.OS === "web";

  return (
    <>
      {isWeb ? (
        <View
          className="flex flex-row items-center justify-center mt-2 w-full"
          style={{ flexWrap: "wrap" }} // allows wrap on small screens
        >
          {/* Column 1 - Stars (only shown if rating exists) */}
          {fieldsType.rate && item[fieldsType.rate] && (
            <View
              className="flex-row items-center me-4"
              key={`${item[fieldsType.idField]}-${fieldsType.rate}-${
                item[fieldsType.rate]
              }`}
            >
              <StarsIcons
                key={`${item[fieldsType.idField]}-${fieldsType.rate}-${
                  item[fieldsType.rate]
                }`}
                customKey={`${item[fieldsType.idField]}-${fieldsType.rate}-${
                  item[fieldsType.rate]
                }`}
                value={parseFloat(item[fieldsType.rate])}
                size={16}
              />
            </View>
          )}

          {/* Column 2 - Orders */}
          {fieldsType.orders && item[fieldsType.orders] && (
            <View
              className="flex-row items-center"
              key={`${item[fieldsType.idField]}-${fieldsType.orders}-${
                item[fieldsType.orders]
              }`}
            >
              <GetIconMenuItem
                count={formatCount(item[fieldsType.orders])}
                iconName={"orders"}
                size={18}
                style={{ marginHorizontal: scale(1), color: theme.accent }}
              />
            </View>
          )}
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: scale(8),
            width: "100%",
          }}
        >
          {/* Column 1 - Stars */}
          {fieldsType.rate && item[fieldsType.rate] && (
            <View
              key={`${item[fieldsType.idField]}-${fieldsType.rate}-${
                item[fieldsType.rate]
              }`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "50%",
                marginBottom: scale(4),
              }}
            >
              <StarsIcons
                value={parseFloat(item[fieldsType.rate])}
                size={scale(12)}
              />
            </View>
          )}

          {/* Column 2 - Orders */}
          {fieldsType.orders && item[fieldsType.orders] && (
            <View
              key={`${item[fieldsType.idField]}-${fieldsType.orders}-${
                item[fieldsType.orders]
              }`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "50%",
                marginBottom: scale(4),
              }}
            >
              <GetIconMenuItem
                count={formatCount(item[fieldsType.orders])}
                iconName="orders"
                size={scale(12)}
                style={{ marginHorizontal: scale(2), color: theme.accent }}
              />
            </View>
          )}
        </View>
      )}
    </>
  );
}
