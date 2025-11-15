import Entypo from "@expo/vector-icons/Entypo";
import React, { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "../../../../components/ui";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { Text } from "react-native";
import { theme } from "../../../Theme";
function InputPassword({ ...props }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const localization = useSelector((state) => state.localization.localization);
  const errorText = localization.inputs.password.error;

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  let {
    value: defaultValue,
    enable,
    title,
    fieldName,
    control,
    type,
    placeholder,
    mustConfirmed = type === "confirmPassword",
    clearErrors,
  }: any = props;
  const passwordValue = useWatch({
    control,
    name: fieldName,
  });
  return (
    <Controller
      control={control}
      rules={{
        required: true,
        validate: (val) => {
          if (mustConfirmed && val !== confirmPassword) {
            return errorText; // This will be shown as the error message
          }
          return true;
        },
      }}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View>
          <Input isInvalid={props.invalidInput}>
            <InputField
              type={passwordVisible ? "text" : "password"}
              // {...props}
              className="!h-12 w-[90%] pe-0 sm:pe-3"
              size="md"
              onChangeText={(val) => {
                onChange(val);
                // if (mustConfirmed && val !== confirmPassword) {
                //   console.log(errorText, confirmPassword);

                //   //make here vladtion
                //   control.setError(fieldName, {
                //     type: "manual",
                //     message: errorText,
                //   });
                // } else {
                //   clearErrors(fieldName);
                // }
              }}
              onBlur={onBlur}
              secureTextEntry={!passwordVisible}
              value={value}
              defaultValue={defaultValue}
              editable={enable}
              onFocus={(e) => {
                if (!e?.nativeEvent?.targetIsEyeIcon) {
                  onChange("");
                  setConfirmPassword("");
                }
              }}
              placeholder={placeholder}
              style={props.style}
            />
            <InputSlot
              onPress={(e) => {
                // Toggle visibility
                setPasswordVisible(!passwordVisible);

                // Stop focus from firing onFocus handler
                e.nativeEvent.targetIsEyeIcon = true;
              }}
              className="w-auto sm:w-8 items-center"
            >
              {passwordVisible ? (
                <Entypo name="eye" size={24} color="black" />
              ) : (
                <Entypo name="eye-with-line" size={24} color="black" />
              )}
            </InputSlot>
          </Input>
          {mustConfirmed && (
            <Input isInvalid={props.invalidInput}>
              <InputField
                type={passwordVisible ? "text" : "password"}
                // {...props}
                className="!h-12 !mt-2"
                size="md"
                onChangeText={(newValue) => {
                  setConfirmPassword(newValue);
                  if (value !== newValue) {
                    //make here vladtion
                    control.setError(fieldName, {
                      type: "manual",
                      message: errorText,
                    });
                  } else {
                    clearErrors(fieldName);
                  }
                }}
                secureTextEntry={!passwordVisible}
                editable={enable}
                placeholder={placeholder} //!localiztion
                style={props.style}
                value={confirmPassword}
                onFocus={() => {
                  if (!e?.nativeEvent?.targetIsEyeIcon) {
                    setConfirmPassword("");
                  }
                }}
              />
              <InputSlot
                onPress={(e) => {
                  // Toggle visibility
                  setPasswordVisible(!passwordVisible);
                  // Stop focus from firing onFocus handler
                  e.nativeEvent.targetIsEyeIcon = true;
                }}
                className="w-auto sm:w-8 items-center"
              >
                {passwordVisible ? (
                  <Entypo name="eye" size={24} color="black" />
                ) : (
                  <Entypo name="eye-with-line" size={24} color="black" />
                )}
              </InputSlot>
            </Input>
          )}
          {error && (
            <Text className="!text-red-500 mt-1 text-sm">{error.message}</Text>
          )}
        </View>
      )}
      name={fieldName}
    />
  );
}

export default InputPassword;
