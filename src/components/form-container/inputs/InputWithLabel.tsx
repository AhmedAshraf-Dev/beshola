import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { isRTL } from "../../../utils/operation/isRTL";
import { Entypo } from "@expo/vector-icons";
import PopupModal from "../../../utils/component/PopupModal";
import { handleSubmitWithCallback } from "../../../utils/operation/handleSubmitWithCallback";
// import ScratchVoucherCard from "../../../Schemas/MenuSchema/ScratchVoucherCard.json";
import ScratchVoucherCardActions from "../../../Schemas/MenuSchema/ScratchVoucherCardActions.json";
import PaymentOptions from "../../../Schemas/MenuSchema/PaymentOptions.json";
import { formatCount } from "../../../utils/operation/formatCount";
import { useSchemas } from "../../../../context/SchemaProvider";

export default function InputWithLabel({
  value,
  enable,
  title,
  fieldName,
  control,
  type,
  lookupDisplayField,
  ...props
}) {
  const [editValue, setEditValue] = useState(`${value?.[fieldName]}` || "0");
  const [disable, setDisable] = useState(false);
  const [reqError, setReqError] = useState(null);
  const { scratchVoucherCardState } = useSchemas();
  const {
    control: PopupControl,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const originalValue = parseFloat(
    lookupDisplayField ? value?.[lookupDisplayField] : value || 0
  );
  const currentEdit = parseFloat(editValue || 0);
  // const labelValue = originalValue - currentEdit;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleInputChange = (val, onChange) => {
    let parsed = parseFloat(val);
    if (isNaN(parsed)) parsed = 0;

    if (parsed > originalValue) {
      parsed = originalValue;
    } else if (parsed < 0) {
      parsed = 0;
    }

    setEditValue(parsed.toString());
    onChange(parsed.toString()); // ensure we update form state
  };

  const renderInput = (onChange, onBlur) => (
    <View className="relative rounded-lg flex-1">
      <TextInput
        onChangeText={(val) => {
          // just update UI, don’t send request yet
          // parse & clamp
          let parsed = parseFloat(val);
          if (isNaN(parsed)) parsed = 0;

          if (parsed > originalValue) parsed = originalValue;
          if (parsed < 0) parsed = 0;

          const finalValue = parsed.toString();
          setEditValue(finalValue);
        }}
        onBlur={() => {
          // parse & clamp
          let parsed = parseFloat(editValue);
          if (isNaN(parsed)) parsed = 0;

          if (parsed > originalValue) parsed = originalValue;
          if (parsed < 0) parsed = 0;

          const finalValue = parsed.toString();
          setEditValue(finalValue);
          onChange(finalValue); // send to react-hook-form
        }}
        value={editValue}
        placeholder={title}
        keyboardType="numeric"
        placeholderTextColor="#9CA3AF" // Tailwind's gray-400
        className={
          "peer bg-transparent text-gray-800 " +
          "placeholder-transparent px-2 border-2 border-gray-400 " +
          "focus:border-sky-600 focus:outline-none" +
          "flex-1 bg-body p-3 text-sm border border-border " +
          `${isRTL() ? "text-right rounded-r-lg" : "text-left rounded-l-lg"}`
        }
      />
      <Text
        className={
          "absolute bg-body px-1 text-sm -top-2 text-sky-600 transition-all " +
          `${isRTL() ? "right-2" : "left-2"}`
        }
      >
        {props.placeholder}
      </Text>
    </View>
  );
  const postAction =
    ScratchVoucherCardActions &&
    ScratchVoucherCardActions.find(
      (action) => action.dashboardFormActionMethodType === "Post"
    );
  const onSubmit = async (data: any) => {
    await handleSubmitWithCallback({
      data,
      setDisable,
      action: postAction,
      proxyRoute: PaymentOptions.projectProxyRoute,
      setReq: setReqError,
      onSuccess: (resultData) => {
        setIsModalVisible(false);
        reset();
      },
    });
  };
  const additionalButton = () => {
    return (
      <TouchableOpacity
        className="p-2 me-2 w-fit rounded-lg bg-accent items-center justify-center"
        onPress={() => setIsModalVisible(true)}
      >
        <Entypo name="plus" size={20} className="!text-body" />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View className="flex-row mt-2 items-center">
        {type === "additionalInputWithLabel" && additionalButton()}
        <PopupModal
          isOpen={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
            reset();
          }}
          onSubmit={async () => {
            await handleSubmit(onSubmit)();
          }}
          headerTitle={
            scratchVoucherCardState.schema.dashboardFormSchemaInfoDTOView
              .addingHeader
          }
          control={PopupControl}
          schema={scratchVoucherCardState.schema}
          errors={reqError || errors}
          disable={disable}
        />
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) =>
            renderInput(onChange, onBlur)
          }
          name={fieldName}
        />
        <View
          className={
            "bg-accent px-4 py-3 flex flex-row justify-center items-center h-full w-12 " +
            `${isRTL() ? "rounded-l-lg" : "rounded-r-lg"}`
          }
        >
          <Text className="text-body text-sm">
            {formatCount(originalValue)}
          </Text>
        </View>
      </View>
    </View>
  );
}
