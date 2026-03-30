import React from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { Box, VStack } from "../../components/ui";
import { useSchemas } from "../../context/SchemaProvider";
import AppointmentScheduler from "../components/form-container/inputs/CustomInputs/CalendarParameter";
import PolygonMapEmbed from "../components/maps/DrawSmoothPolygon";
import SuggestCardContainer from "../components/suggest/SuggestCardContainer";
import AssetsSchemaActions from "../Schemas/MenuSchema/AssetsSchemaActions.json";
import { useDeviceInfo } from "../utils/component/useDeviceInfo";
import AdditionalInfoScreen from "./auth/signup/AddtionInfo";
import HomeCarousel from "./main-content/HomeCarousel.native";
import HomeCarouselWeb from "./main-content/HomeCarousel.web";
import { useForm } from "react-hook-form";
import { DateParameter } from "../components/form-container";
import CalendarParameter from "../components/form-container/inputs/CustomInputs/CalendarParameter";
import FormContainer from "../components/form-container/FormContainer";

const Explorepage = () => {
  const { os } = useDeviceInfo();
  const { recommendedState } = useSchemas();
  const localization = useSelector((state) => state.localization.localization);
  const { control } = useForm();
  return (
    <>
      <ScrollView>
        <Box>
          <VStack space="sm">
            {os === "web" && <HomeCarouselWeb />}
            {os !== "web" && <HomeCarousel />}
            {/* <PolygonForm enable={false} setNewPolygon={() => {}} /> */}
            <PolygonMapEmbed
              clickable={false}
              onLocationChange={() => {}}
              setNewPolygon={() => {}}
            />
            {/* <FormContainer
              tableSchema={{
                dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f899",
                schemaType: "AddressLocation",
                idField: "assetID",
                dashboardFormSchemaInfoDTOView: {
                  dashboardFormSchemaID: "66a8b526-4e63-49b9-ad10-b5112f6646f4",
                  schemaHeader: "Login Information",
                  addingHeader: "add new Market Place",
                  editingHeader: "Edit Cart",
                },
                dashboardFormSchemaParameters: [
                  {
                    dashboardFormSchemaParameterID:
                      "bbc47b3c-baba-4c80-8a8e-50d9875a15d6",
                    dashboardFormSchemaID:
                      "270f513b-1788-4c01-879e-4526c990f899",
                    isEnable: true,
                    parameterType: "text",
                    parameterField: "assetID",
                    parameterTitel: "assetID",
                    isIDField: true,
                    lookupID: null,
                    lookupReturnField: null,
                    lookupDisplayField: null,
                    indexNumber: 0,
                  },
                  {
                    dashboardFormSchemaParameterID:
                      "302167fc-ef36-49d1-adcd-1b41e1504629",
                    dashboardFormSchemaID:
                      "854454a8-119b-4def-abdc-4b337d643813",
                    isEnable: true,
                    parameterType: "calender",
                    parameterField: "preview",
                    parameterTitel: "preview",
                    parameterLookupTitel: null,
                    isIDField: false,
                    lookupID: "302167fc-ef36-49d1-adcd-1b41e1504629",
                    lookupReturnField: null,
                    lookupDisplayField: null,
                    indexNumber: 11,
                    isFilterOperation: true,
                    dashboardFormSchemaParameterDependencies: [],
                  },
                ],

                isMainSchema: true,
                dataSourceName: "BrandingMartSecurity",
                projectProxyRoute: "BrandingMartSecurity",
                propertyName: null,
                indexNumber: 0,
              }}
              row={{}}
              errorResult={{}}
              control={{}}
            /> */}
            <CalendarParameter
              enable={true}
              placeholder={""}
              value={{}}
              fieldName="appointment"
              control={control}
              type="appointment"
              availability={[
                {
                  date: "2026-03-30",
                  slots: ["09:00", "10:00"],
                },
                {
                  date: "2026-03-31",
                  slots: ["12:00", "14:00"],
                },
              ]}
            />
            <View className="flex-col">
              <SuggestCardContainer
                row={{ onlyDiscountItems: true }}
                suggestContainerType={0}
                schemaActions={AssetsSchemaActions}
                shownNodeMenuItemIDs={[]}
                header={localization.Hum_screens.home.discountItems}
              />
            </View>
            <View className="flex-col">
              <SuggestCardContainer
                suggestContainerType={0}
                schemaActions={AssetsSchemaActions}
                shownNodeMenuItemIDs={[]}
                header={localization.Hum_screens.home.suggestItems}
              />
            </View>
          </VStack>
        </Box>
        <AdditionalInfoScreen />
      </ScrollView>
    </>
  );
};

export default Explorepage;
