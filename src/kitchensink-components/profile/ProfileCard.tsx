import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { useSelector } from "react-redux";
import useFetch from "../../../components/hooks/APIsFunctions/useFetch";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  HStack,
  Text,
  VStack,
} from "../../../components/ui";
import { useAuth } from "../../../context/auth";
import { useNetwork } from "../../../context/NetworkContext";
import { useSchemas } from "../../../context/SchemaProvider";
import { useWS } from "../../../context/WSProvider";
import LanguageSelector from "../../components/language/LanguageSelector";
import PaymentOptionsActions from "../../Schemas/MenuSchema/PaymentOptionsActions.json";
import CreditsSchema from "../../Schemas/Profile/CreditsSchema.json";
import { theme } from "../../Theme";
import { formatCount } from "../../utils/operation/formatCount";
import { getField } from "../../utils/operation/getField";
import { isRTL } from "../../utils/operation/isRTL";
import { ConnectToWS } from "../../utils/WS/ConnectToWS";
import { WSMessageHandler } from "../../utils/WS/handleWSMessage";

export const ProfileCard = ({ profileInfo }) => {
  const { userGust, user } = useAuth();
  const { _wsMessageAccounting, setWSMessageAccounting } = useWS();
  const { menuItemsState, setMenuItemsState } = useSchemas();
  const [WS_Connected, setWS_Connected] = useState(false);
  const { signupState } = useSchemas();
  const fieldsType = useSelector((state: any) => state.menuItem.fieldsType);
  const allParams = signupState.schema.dashboardFormSchemaParameters;

  // Get the parameterField values for phoneNumber and confirmPassword
  const fullNameField = getField(allParams, "hiddenFullName");
  const {
    status: { isConnected: isOnline },
  } = useNetwork();
  useEffect(() => {
    if (WS_Connected) return;
    let cleanup;
    ConnectToWS(
      setWSMessageAccounting,
      setWS_Connected,
      fieldsType.dataSourceName,
    )
      .then(() => console.log("🔌 WebSocket setup done"))
      .catch((e) => console.error("❌ WebSocket setup error", e));
    return () => {
      if (cleanup) cleanup(); // Clean up when component unmounts or deps change
      console.log("🧹 Cleaned up WebSocket handler");
    };
  }, [WS_Connected, isOnline]);

  // 🧠 Reducer callback to update rows
  const callbackReducerUpdate = async (ws_updatedRows) => {
    // await reducerDispatch({
    //   type: "WS_OPE_ROW",
    //   payload: {
    //     rows: ws_updatedRows.rows,
    //     totalCount: ws_updatedRows.totalCount,
    //   },
    // });
  };

  // 📨 React to WebSocket messages only when valid

  const creditField = getField(
    CreditsSchema.dashboardFormSchemaParameters,
    "credit",
    false,
  );

  const pointsField = getField(
    CreditsSchema.dashboardFormSchemaParameters,
    "points",
    false,
  );
  const getAction =
    PaymentOptionsActions &&
    PaymentOptionsActions.find(
      (action) => action.dashboardFormActionMethodType.toLowerCase() === "get",
    );
  const { data, error, isLoading } = useFetch(
    `/${getAction.routeAdderss}`,
    CreditsSchema.projectProxyRoute,
  );
  useEffect(() => {
    if (!_wsMessageAccounting) return;
    const _handleWSMessage = new WSMessageHandler({
      _WSsetMessage: _wsMessageAccounting,
      fieldsType,
      rows: [data],
      totalCount: 0,
      callbackReducerUpdate,
    });
    _handleWSMessage.process();
    setWSMessageAccounting(null);
  }, [_wsMessageAccounting]);
  return (
    <HStack className="flex-row justify-between">
      <HStack space="md" className="items-center">
        <Avatar className="bg-body">
          <AvatarFallbackText>
            {profileInfo?.[fullNameField]}
          </AvatarFallbackText>
          <AvatarImage
            source={{
              uri: "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
            }}
          />
        </Avatar>
        <VStack>
          <Text className="!text-text text-lg">
            {profileInfo?.[fullNameField]}
          </Text>
          {data && !isLoading && (
            <VStack>
              <HStack space="xs" className="items-center">
                <FontAwesome
                  name="credit-card"
                  size={14}
                  color={theme.accentHover}
                />
                <View style={{ direction: "inherit" }}>
                  <Text
                    className="text-primary-custom text-sm"
                    style={{ direction: "inherit" }}
                  >
                    {/* {creditField.parameterTitel}
                    {isRTL() ? "\u00A0:\u00A0" : "\u00A0:\u00A0"} */}
                    {formatCount(data[creditField.parameterField])}
                  </Text>
                </View>
              </HStack>
              <HStack space="xs" className="items-center">
                <MaterialCommunityIcons
                  name="star-four-points"
                  size={14}
                  className="!text-yellow-400"
                />

                <Text className="text-primary-custom text-sm">
                  {isRTL() ? (
                    <>
                      {formatCount(data[pointsField.parameterField])}
                      {/* :{" "}
                      {pointsField.parameterTitel} */}
                    </>
                  ) : (
                    <>
                      {/* {pointsField.parameterTitel} */}
                      {/* :{" "} */}
                      {formatCount(data[pointsField.parameterField])}
                    </>
                  )}
                </Text>
              </HStack>
            </VStack>
          )}
        </VStack>
      </HStack>
      <View
        className={
          Platform.OS === "web"
            ? "max-w-36 max-h-32 sm:max-w-52"
            : "min-w-[120px] !max-h-[60px] flex-row items-center justify-center"
        }
      >
        <LanguageSelector />
      </View>
    </HStack>
  );
};
