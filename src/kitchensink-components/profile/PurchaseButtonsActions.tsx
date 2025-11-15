import { Feather, FontAwesome } from "@expo/vector-icons";
import { default as React, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import AddressLocationSchema from "../../Schemas/AddressLocation/AddressLocation.json";
import PopupModal from "../../utils/component/PopupModal";
import AnimatedStarRatingInput from "../../utils/component/StarRatingInput";
import { useSchemas } from "../../../context/SchemaProvider";
import { RunsSpacialAction } from "../../utils/operation/RunsSpacialAction";
import { onApply } from "../../components/form-container/OnApply";

export default function PurchaseButtonsActions({ item, fieldsType }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalRateVisible, setIsModalRateVisible] = useState(false);
  const [isModalReviewVisible, setIsModalReviewVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { rateState, reviewsState } = useSchemas();
  const [rate, setRate] = useState(item?.[fieldsType?.customerRate] || 0);
  const [review, setReview] = useState(
    item?.[fieldsType?.customerReview] || ""
  );
  const [displayRate, setDisplayRate] = useState(
    item?.[fieldsType?.customerRate] || 0
  );
  const [displayReview, setDisplayReview] = useState(
    item?.[fieldsType?.customerReview] || ""
  );
  const localization = useSelector((state) => state.localization.localization);
  const purchasesLocale = localization.Hum_screens.profile.collapses.find(
    (collapse) => collapse.type === "purchases"
  ).childrenText;
  const onSubmitRate = async () => {
    try {
      setLoading(true);
      const req = await RunsSpacialAction(
        isModalRateVisible ? "rate" : "review",
        item[fieldsType.itemidField],
        isModalRateVisible ? rate : review,
        isModalRateVisible ? rateState.actions : reviewsState.actions,
        rateState.actions.proxyRoute
      );
      if (req) {
        setLoading(false);
        isModalRateVisible ? setDisplayRate(rate) : setDisplayReview(review);

        setIsModalVisible(false);

        setIsModalRateVisible(false);
        setIsModalReviewVisible(false);
      }
    } finally {
      setLoading(false);

      setIsModalVisible(false);

      setIsModalRateVisible(false);
      setIsModalReviewVisible(false);
    }
  };
  const setTitle = () => {
    if (isModalRateVisible) {
      if (!rate)
        return rateState.schema.dashboardFormSchemaInfoDTOView.addingHeader;
      return rateState.schema.dashboardFormSchemaInfoDTOView.editingHeader;
    } else if (isModalReviewVisible) {
      if (!item.review)
        return reviewsState.schema.dashboardFormSchemaInfoDTOView.addingHeader;
      return reviewsState.schema.dashboardFormSchemaInfoDTOView.editingHeader;
    }
  };
  return (
    <View className="flex-row justify-around my-4">
      <PopupModal
        isOpen={isModalVisible}
        onClose={() => {
          // isModalRateVisible
          //   ? setRate(item?.[fieldsType?.customerRate] || 0)
          //   : setReview(item?.[fieldsType?.customerReview] || "");
          setIsModalVisible(false);
          setIsModalRateVisible(false);
          setIsModalReviewVisible(false);
        }}
        disable={loading}
        headerTitle={setTitle()}
        isFormModal={false}
        row={{}}
        schema={AddressLocationSchema}
        onSubmit={onSubmitRate}
      >
        <>
          {isModalRateVisible && (
            <View className="flex-row justify-center items-center">
              <AnimatedStarRatingInput
                rating={displayRate}
                onChange={setRate}
              />
            </View>
          )}
          {isModalReviewVisible && (
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 16, marginBottom: 8 }}>
                {purchasesLocale.reviewPlaceholder}
              </Text>
              <TextInput
                // value={review}
                defaultValue={displayReview}
                onChangeText={setReview}
                placeholder="Type your feedback here..."
                multiline={true} // 🔹 allows multiple lines
                numberOfLines={5} // 🔹 sets initial height
                textAlignVertical="top" // 🔹 makes text start at the top
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  padding: 10,
                  fontSize: 16,
                  minHeight: 100,
                }}
              />
            </View>
          )}
        </>
      </PopupModal>
      {/* Rate */}
      {displayRate ? (
        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(true);
            setIsModalRateVisible(true);
          }}
          className="flex-row items-center bg-green-100 px-3 py-2 rounded-xl"
        >
          <FontAwesome
            name="star"
            size={20}
            color="#facc15"
            className="text-yellow-500 mr-1"
          />
          <Text className="text-base font-semibold text-green-700">
            {purchasesLocale.selectedRate} {displayRate}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(true);
            setIsModalRateVisible(true);
          }}
          className="flex-1 mx-1 p-3 rounded-xl bg-accent flex-row items-center justify-center"
        >
          <Feather name="star" size={20} className="text-white mr-2" />
          <Text className="text-white font-semibold">
            {purchasesLocale.rateButton}
          </Text>
        </TouchableOpacity>
      )}

      {/* Review */}
      {item.userReview ? (
        <View className="flex-1 mx-1 p-3 rounded-xl bg-blue-100">
          <Text className="text-base text-blue-700 font-medium">
            {purchasesLocale.editReviewPlaceholder}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(true);
            setIsModalReviewVisible(true);
          }}
          className="flex-1 mx-1 p-3 rounded-xl bg-accent flex-row items-center justify-center"
        >
          <Feather
            name="message-circle"
            size={20}
            className="text-white mr-2"
          />
          <Text className="text-white font-semibold">
            {purchasesLocale.reviewButton}
          </Text>
        </TouchableOpacity>
      )}

      {/* Refund */}
      {/* {item.isRefunded ? (
        <View className="flex-1 mx-1 p-3 rounded-xl bg-gray-200 flex-row items-center justify-center">
          <Feather name="rotate-ccw" size={20} className="text-gray-500 mr-2" />
          <Text className="text-gray-500 font-medium">
            {purchasesLocale.refunded}
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          //   onPress={() => handleRefund(item)}
          className="flex-1 mx-1 p-3 rounded-xl bg-accent flex-row items-center justify-center"
        >
          <Feather name="rotate-ccw" size={20} className="text-white mr-2" />
          <Text className="text-white font-semibold">
            {purchasesLocale.refundButton}
          </Text>
        </TouchableOpacity>
      )} */}
    </View>
  );
}
