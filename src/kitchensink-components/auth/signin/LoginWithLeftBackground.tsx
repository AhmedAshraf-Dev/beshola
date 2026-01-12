import { Image } from "@/components/ui";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { LinkText } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import FormContainer from "@/src/components/form-container/FormContainer";
import { onApply } from "@/src/components/form-container/OnApply";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, Platform, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "../../../../components/ui";
import { useAuth } from "../../../../context/auth";
// import loginFormSchema from "../../../Schemas/LoginSchema/LoginFormSchema.json";
// import schemaActions from "../../../Schemas/LoginSchema/LoginFormSchemaActions.json";
import { saveSecureValue } from "../../../store/secureStore";
import LoadingButton from "../../../utils/component/LoadingButton";
import { useDeviceInfo } from "../../../utils/component/useDeviceInfo";
import { getField } from "../../../utils/operation/getField";
import { useNetwork } from "../../../../context/NetworkContext";
import { useDisplayToast } from "../../../components/form-container/ShowToast";
import { useSchemas } from "../../../../context/SchemaProvider";
import LanguageSelector from "../../../components/language/LanguageSelector";
import RNRestart from "react-native-restart";

export const LoginWithLeftBackground = () => {
  const localization = useSelector((state) => state.localization.localization);
  const { os } = useDeviceInfo();
  const { isOnline } = useNetwork();
  const { setUser } = useAuth();
  const { loginFormState } = useSchemas();
  const { showToast } = useDisplayToast();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const passwordField = getField(
    loginFormState.schema.dashboardFormSchemaParameters,
    "password",
  );
  const phoneNumberField = getField(
    loginFormState.schema.dashboardFormSchemaParameters,
    "phoneNumber",
  );

  const DValues = {};
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,

    formState: { errors },
  } = useForm({ defaultValues: DValues });
  const [formValuesContainer, setFormValuesContainer] = useState(
    control._formValues,
  );
  const { [passwordField]: removedPassword, ...dataWithoutPassword } =
    formValuesContainer;
  const onSubmit = async (data: any) => {
    // Destructure to remove confirmPassword from the sent data
    const date = new Date();
    const timeZoneOffset = date.getTimezoneOffset();

    const { rememberme, ...sanitizedData } = data;
    const postAction =
      loginFormState.actions &&
      loginFormState.actions.find(
        (action) => action.dashboardFormActionMethodType === "Post",
      );
    setLoading(true);
    const apply = await onApply(
      { ...sanitizedData, timeZoneConvert: timeZoneOffset },
      "",
      true,
      postAction,
      loginFormState.schema.projectProxyRoute,
    );
    if (apply && apply.success === true) {
      try {
        const decodedToken = jwtDecode(apply.data.token);
        const expirationDate = rememberme
          ? new Date(decodedToken.exp * 1000) // token expiration from server
          : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = {
          avatarUrl:
            "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
          ...decodedToken,
        };
        await saveSecureValue(
          "token",
          apply.data.token,
          rememberme
            ? new Date(decodedToken.exp * 1000).toUTCString()
            : new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString(),
          !rememberme,
        );

        // setUser(user);
        if (Platform.OS === "web") {
          // window.location.reload(); // Web reload
          window.location.href = "/";
        } else {
          navigation.navigate("Home");
          RNRestart.Restart();
        }

        // RNRestart.Restart();
        // DevSettings.reload();
      } catch (error) {
        console.error("Failed to decode token:", error.message);
      }
    } else if (!apply.success) {
      setResult(apply);
    }
    setLoading(false);
  };
  useEffect(() => {
    const subscription = watch((formValues) => {
      setFormValuesContainer({ ...formValuesContainer, ...formValues });
    });

    return () => subscription.unsubscribe();
  }, [watch]);
  return (
    <VStack
      className={`max-w-[440px] w-full h-full ${
        os == "web" && "m-auto bg-body shadow-lg !h-fit px-6 py-3 rounded-lg"
      }`}
      space="md"
    >
      <VStack className="items-center" space="md">
        <Image
          alt="login-logo"
          style={{
            objectFit: "contain",
            // width: "100%",
          }}
          source={require("../../../../assets/display/logo.jpeg")}
        />
        <VStack>
          <Heading className="text-center text-accent" size="3xl">
            {localization.Login.headTitle}
          </Heading>
          <View className="flex-col justify-between items-center mt-2">
            <Text className="">{localization.Login.headDescription}</Text>
            <View className="max-w-40 max-h-32 mt-2">
              <LanguageSelector key={1} />
            </View>
          </View>
        </VStack>
      </VStack>
      <VStack className="w-full">
        <VStack space="xl" className="w-full">
          <FormContainer
            tableSchema={loginFormState.schema}
            control={control}
            errorResult={result || errors}
            row={DValues}
            setError={setError}
            clearErrors={clearErrors}
          />

          <HStack className="w-full justify-between ">
            <Controller
              control={control}
              name="rememberme"
              render={({ field: { onChange, onBlur, value = false } }) => (
                <Checkbox
                  size="sm"
                  value="Remember me"
                  isChecked={value}
                  // onBlur={onBlur}
                  // onChange={(isChecked: boolean) => onChange(isChecked)} // <-- Explicitly set
                  onChange={(isCheckedOrEvent: any) => {
                    const isChecked =
                      typeof isCheckedOrEvent === "boolean"
                        ? isCheckedOrEvent
                        : isCheckedOrEvent?.nativeEvent?.checked;

                    onChange(isChecked);
                  }}
                  aria-label="Remember me"
                >
                  <CheckboxIndicator>
                    <CheckboxIcon
                      as={() => (
                        <AntDesign
                          name="check"
                          size={20}
                          className="text-body"
                        />
                      )}
                    />
                    {/* <CheckboxIcon as={CheckIcon} /> */}
                  </CheckboxIndicator>
                  <CheckboxLabel>{localization.Login.rememberme}</CheckboxLabel>
                </Checkbox>
              )}
            />

            <TouchableOpacity
              onPress={() => {
                if (formValuesContainer?.[phoneNumberField].length > 0) {
                  navigation.navigate("ForgetPassword" as never, {
                    ...dataWithoutPassword,
                  });
                } else {
                  showToast(
                    localization.Login.forgotPasswordToast.title,
                    localization.Login.forgotPasswordToast.des,
                    "warning",
                    "outline",
                    "top",
                  );
                }
              }}
            >
              <LinkText className="font-medium text-sm text-primary">
                {localization.Login.forgotPassword}
              </LinkText>
            </TouchableOpacity>
          </HStack>
        </VStack>
        <VStack className="w-full my-7 " space="lg">
          <LoadingButton
            buttonText={localization.Login.loginButton}
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            className="w-full rounded-lg bg-accent"
          />
          <Button
            className="w-full rounded-lg"
            onPress={() => {
              if (Platform.OS === "web") {
                // window.location.reload(); // Web reload
                window.location.href = "/";
              } else {
                navigation.navigate("Home");
                RNRestart.Restart();
              }
            }}
          >
            <ButtonText className="font-medium">
              {localization.Login.loginGustButton}
            </ButtonText>
          </Button>
          {/* <Button
                variant="outline"
                action="secondary"
                className="w-full gap-1"
                onPress={() => {}}>
                <ButtonText className="font-medium">
                  Continue with Google
                </ButtonText>
                <ButtonIcon as={GoogleIcon} />
              </Button> */}
        </VStack>
        <HStack className="self-center" space="sm">
          <Text size="md">{localization.Login.doNotHaveAccount}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp" as never)}
          >
            <LinkText
              className="font-medium text-primary-700 group-hover/link:text-primary-600  group-hover/pressed:text-primary-700"
              size="md"
            >
              {localization.Login.signUp}
            </LinkText>
          </TouchableOpacity>
        </HStack>
      </VStack>
    </VStack>
  );
};
