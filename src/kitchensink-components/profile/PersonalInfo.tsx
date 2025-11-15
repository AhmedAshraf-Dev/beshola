import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { Divider } from "../../../components/ui";
import { useAuth } from "../../../context/auth";
import { useSchemas } from "../../../context/SchemaProvider";
import AddressLocation from "../../components/addressLocation/AddressLocation";
import FormContainer from "../../components/form-container/FormContainer";
import { onApply } from "../../components/form-container/OnApply";
import PersonInfoSchemaActions from "../../Schemas/Profile/PersonInfoSchemaActions.json";
import { CollapsibleSection } from "../../utils/component/Collapsible";
import LoadingButton from "../../utils/component/LoadingButton";
import { getField } from "../../utils/operation/getField";

import { getUniqueValues } from "../../utils/operation/getUniqueValues";
import { ProfileCard } from "./ProfileCard";
export default function PersonalInfo() {
  const { userGust, profileInfo, setNotifications, user } = useAuth();
  const { signupState } = useSchemas();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(null);
  const localization = useSelector((state) => state.localization.localization);
  const voucherLocale = localization.Hum_screens.profile.collapses.find(
    (collapse) => collapse.type === "vouchers"
  ).childrenText;
  const DValues = {};
  const {
    control,
    handleSubmit,
    formState: { defaultValues = DValues, errors },
    reset,
    clearErrors,
  } = useForm({
    defaultValues: DValues,
  });
  useEffect(() => {
    if (profileInfo) {
      reset({
        ...profileInfo,
      });
    }
  }, [profileInfo, reset]);
  const allParams = signupState.schema.dashboardFormSchemaParameters;

  // Get the parameterField values for phoneNumber and confirmPassword
  const phoneNumberField = getField(allParams, "phoneNumber");
  const passwordField = getField(allParams, "confirmPassword", false);

  // Filter out phoneNumber and password fields by their `parameterField` values
  const sanitizedParams = allParams.filter(
    (param) =>
      param.parameterField !== phoneNumberField &&
      param.parameterField !== passwordField.parameterField
  );

  // Create schema with filtered parameters
  const restOfSchema = {
    ...signupState.schema,
    dashboardFormSchemaParameters: sanitizedParams,
  };

  // Optional: If you want individual schemas too (same sanitized version reused)
  const passwordSchema = {
    ...signupState.schema,
    dashboardFormSchemaParameters: [passwordField],
  };
  const putAction =
    PersonInfoSchemaActions &&
    PersonInfoSchemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Put"
    );

  const onSubmit = async (data: any) => {
    // Destructure to remove confirmPassword from the sent data
    const { confirmPassword, ...sanitizedData } = data;
    setLoading(true);
    try {
      const request = await onApply(
        {
          ...getUniqueValues(profileInfo, sanitizedData),
          [signupState.schema.idField]: user.PersonID,
        },
        signupState.schema.idField,
        false,
        putAction,
        signupState.schema.projectProxyRoute
      );
      setResult(request);
      if (request && request.success === true) {
        if (request.data == true) {
          setNotifications([
            {
              mess: localization.Hum_screens.profile.notify.infoUpdated,
              status: "success",
            },
          ]);
        } else {
          setNotifications([
            {
              mess: localization.Hum_screens.profile.notify.infoUpdatedError,
              status: "error",
            },
          ]);
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      setNotifications([
        {
          mess: localization.Hum_screens.profile.notify.infoUpdatedError,
          status: "error",
        },
      ]);
      // Optionally, handle the error here (e.g., show a notification)
    } finally {
      // Enable the button after the API call
      setLoading(false);
    }
  };
  return (
    <View className="md:!flex-1">
      {!userGust && (
        <>
          <ProfileCard profileInfo={profileInfo} />
          <Divider className="my-2" />
          <View className="flex md:hidden">
            <CollapsibleSection
              title="Personal Info"
              icon={() => <Feather name="user" size={22} />}
              setheader
              // buttonClassName="py-2"
            >
              <FormContainer
                tableSchema={restOfSchema}
                row={{ ...profileInfo }}
                control={control}
                errorResult={result || errors}
                clearErrors={clearErrors}
              />
              <AddressLocation />
              <LoadingButton
                buttonText={localization.formSteps.popup.save}
                loading={loading}
                onPress={async () => {
                  await handleSubmit(onSubmit)();
                }}
                className="mt-4 !bg-accentHover text-body text-bold"
              />
            </CollapsibleSection>
          </View>
          <View className="hidden md:flex">
            <FormContainer
              tableSchema={restOfSchema}
              row={{ ...profileInfo }}
              control={control}
              errorResult={result || errors}
              clearErrors={clearErrors}
            />
            <AddressLocation />

            <LoadingButton
              buttonText={localization.formSteps.popup.save}
              loading={loading}
              onPress={async () => {
                await handleSubmit(onSubmit)();
              }}
              className="mt-4 !bg-accentHover text-body text-bold"
            />
          </View>
        </>
      )}
    </View>
  );
}
