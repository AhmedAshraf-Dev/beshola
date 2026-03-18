import React, { useState } from "react";
import { Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Image,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { Card, Box } from "../../../components/ui";
import { theme } from "../../Theme";
import { getResponsiveImageSize } from "../../utils/component/getResponsiveImageSize";
import { addAlpha } from "../../utils/operation/addAlpha";
import ImageCardActions from "./ImageCardActions";
import AddressComponent from "./AddressComponent";
import PopupModal from "../../utils/component/PopupModal";

// ✅ Schemas
import AddAssetFilesSchema from "../../Schemas/MenuSchema/AddAssetFilesSchema.json";
import AddAssetFilesSchemaActions from "../../Schemas/MenuSchema/AddAssetFilesSchemaActions.json";
import PricePlanSchemaActions from "../../Schemas/MenuSchema/PricePlanSchemaActions.json";
import PricePlansSchema from "../../Schemas/MenuSchema/PricePlanSchema.json";
import { handleSubmitWithCallback } from "../../utils/operation/handleSubmitWithCallback";

const OwnAssetCard = ({
  itemPackage,
  selectedItems = [],
  setSelectedItems,
  schemaActions,
}) => {
  const [item] = useState(itemPackage);

  const fieldsType = useSelector((state) => state.menuItem.fieldsType);

  // ✅ Modal State (CLEAN)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // "files" | "price"
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [reqError, setReqError] = useState(false);

  // ✅ Form
  const { control, handleSubmit, formState } = useForm();
  const { errors } = formState;

  const imageSize = getResponsiveImageSize(0.2, { min: 30, max: 80 });

  // ✅ Dynamic Schema
  const getSchema = () => {
    if (modalType === "files") return AddAssetFilesSchema;
    if (modalType === "price") return PricePlansSchema;
    return null;
  };

  // ✅ Dynamic Title
  const getTitle = () => {
    if (modalType === "files") return "Add Files";
    if (modalType === "price") return "Add Price Plans";
    return "";
  };

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    const postAction = () => {
      if (modalType === "files") {
        return (
          AddAssetFilesSchemaActions &&
          AddAssetFilesSchemaActions.find(
            (action) => action.dashboardFormActionMethodType === "Post",
          )
        );
      } else if (modalType === "price") {
        return (
          PricePlanSchemaActions &&
          PricePlanSchemaActions.find(
            (action) => action.dashboardFormActionMethodType === "Post",
          )
        );
      }
    };
    try {
      await handleSubmitWithCallback({
        data,
        setDisable,
        action: postAction(),
        proxyRoute: postAction().projectProxyRoute,
        setReq: setReqError,
        onSuccess: (resultData) => {
          // AddAddressLocation(resultData);
          // setIsModalVisible(false);
          // dispatch(updateSelectedLocation(resultData));
          // setSelectedLocation(resultData);
        },
      });

      if (modalType === "files") {
        console.log("FILES DATA:", data);
        // 🔥 TODO: API call (add files)
      }

      if (modalType === "price") {
        console.log("PRICE PLANS DATA:", data);
        // 🔥 TODO: API call (add price plans)
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
      setModalType(null);
    }
  };

  return (
    <View className="mb-3">
      {/* ✅ Modal */}
      <PopupModal
        isOpen={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setModalType(null);
        }}
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        headerTitle={getTitle()}
        row={{}}
        schema={getSchema()}
        errors={errors}
        disable={loading}
      />

      {/* ✅ Card */}
      <Card
        className="items-center overflow-hidden border !rounded-none"
        style={{
          backgroundColor: addAlpha(theme.body, 0.15),
          borderColor: addAlpha(theme.body, 0.5),
        }}
      >
        <View className="flex-row items-center mt-2 px-2 w-full">
          {/* Image */}
          <View className="flex flex-col relative w-1/4">
            <MemoizedImageCard
              item={item}
              fieldsType={fieldsType}
              imageSize={imageSize}
              schemaActions={schemaActions}
            />
          </View>

          {/* Address */}
          <View className="flex-col justify-center items-center w-1/2">
            {fieldsType.address && item[fieldsType.address] && (
              <AddressComponent
                addressText={item[fieldsType.address]}
                fieldsType={fieldsType}
                item={item}
              />
            )}
          </View>

          {/* Actions */}
          <View className="flex-col justify-center items-center w-1/4">
            {/* Contact Icon */}
            <TouchableOpacity
              className="p-2 rounded-full mb-2"
              style={{ backgroundColor: theme.accent }}
              onPress={() => console.log("Contact pressed")}
            >
              <AntDesign name="form" size={20} color={theme.body} />
            </TouchableOpacity>

            {/* ✅ Add Files */}
            <TouchableOpacity
              onPress={() => {
                setModalType("files");
                setIsModalVisible(true);
              }}
              className="p-2 rounded-full mb-2"
              style={{ backgroundColor: theme.accent }}
            >
              <Feather name="paperclip" size={20} color="white" />
            </TouchableOpacity>

            {/* ✅ Add Price Plans */}
            <TouchableOpacity
              onPress={() => {
                setModalType("price");
                setIsModalVisible(true);
              }}
              className="p-2 rounded-full"
              style={{ backgroundColor: theme.accent }}
            >
              <MaterialCommunityIcons
                name="cash-plus"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default OwnAssetCard;

/////////////////////////////////////////////////////////

export const MemoizedImageCard = React.memo(
  ({ item, fieldsType, imageSize, schemaActions }) => {
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === "web";

    return (
      <Box className="w-full flex justify-center items-center overflow-hidden">
        <ImageCardActions
          fieldsType={fieldsType}
          item={item}
          showFaovertIcon={fieldsType.isFav}
          style={{ width: imageSize, height: imageSize }}
          className={isWeb ? "!w-[30%] !h-20 sm:!h-32 lg:!h-46" : "!size-20"}
        >
          <></>
        </ImageCardActions>
      </Box>
    );
  },
  (prev, next) =>
    prev.item === next.item &&
    prev.fieldsType === next.fieldsType &&
    prev.imageSize === next.imageSize,
);
