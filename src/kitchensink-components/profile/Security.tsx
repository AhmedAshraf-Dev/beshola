import React, { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { Button, ButtonText } from "../../../components/ui";
import { useAuth } from "../../../context/auth";
import { useSchemas } from "../../../context/SchemaProvider";
import FormContainer from "../../components/form-container/FormContainer";
import { getField } from "../../utils/operation/getField";
import { useForm } from "react-hook-form";
import { getUniqueValues } from "../../utils/operation/getUniqueValues";
import { onApply } from "../../components/form-container/OnApply";
import PersonInfoSchemaActions from "../../Schemas/Profile/PersonInfoSchemaActions.json";
import LoadingButton from "../../utils/component/LoadingButton";
export default function Security() {
  const { userGust, user, profileInfo, setNotifications } = useAuth();
  const { signupState, securityState } = useSchemas();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(null);
  const localization = useSelector((state) => state.localization.localization);

  const allParams = signupState.schema.dashboardFormSchemaParameters;

  // Get the parameterField values for confirmPassword
  const passwordField = getField(allParams, "confirmPassword", false);

  // Optional: If you want individual schemas too (same sanitized version reused)
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
  const postAction =
    PersonInfoSchemaActions &&
    PersonInfoSchemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Post"
    );
  const onSubmit = async (data: any) => {
    // Destructure to remove confirmPassword from the sent data
    const { confirmPassword, ...sanitizedData } = data;
    setLoading(true);
    try {
      const request = await onApply(
        {
          ...getUniqueValues({}, sanitizedData),
          [signupState.schema.idField]: user.PersonID,
        },
        signupState.schema.idField,
        true,
        postAction,
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
    <View>
      <FormContainer
        tableSchema={securityState.schema}
        row={{}}
        control={control}
        errorResult={result || errors}
        clearErrors={clearErrors}
      />
      <LoadingButton
        buttonText={localization.formSteps.popup.save}
        loading={loading}
        onPress={async () => {
          await handleSubmit(onSubmit)();
        }}
        className="mt-4 !bg-accentHover text-body text-bold"
      />
    </View>
  );
}
