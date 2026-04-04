import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";

import useFetch, {
  fetchData,
} from "../../../components/hooks/APIsFunctions/useFetch";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../request";
import BaseTree from "./BaseTree";
import BaseRange from "./BaseRange";
const testSchema = [
  {
    dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f899",
    schemaType: "rangeFilter",
    idField: "id",
    dashboardFormSchemaParameters: [
      {
        dashboardFormSchemaParameterID: "param-price-minmax",
        dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f899",
        isEnable: true,
        parameterType: "select",
        parameterField: "currencyTypeID",
        parameterTitel: "Currency",
        isIDField: false,
        lookupID: "9b9b04a2-360e-429b-95b7-102a46a96396",
        lookupReturnField: "currencyTypeID",
        lookupDisplayField: "currencyTypeShortName",
        indexNumber: 0,
      },
      {
        dashboardFormSchemaParameterID: "param-price-minmax",
        dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f899",
        isEnable: true,
        parameterType: "rangeSchema",
        parameterField: "onlineAssetPricePlan",
        parameterTitel: "Online Asset Price Plan",
        isIDField: false,
        lookupID: "270f513b-1788-4c01-879e-4526c990f899",
        lookupReturnField: null,
        lookupDisplayField: null,
        indexNumber: 0,
      },
    ],
    isMainSchema: true,
    dataSourceName: null,
    projectProxyRoute: "BrandingMartSecurity",
    propertyName: null,
    indexNumber: 0,
  },
  {
    dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f899",
    schemaType: "rangeFilter",
    idField: "id",
    dashboardFormSchemaParameters: [
      {
        dashboardFormSchemaParameterID: "470f513b-1788-4c01-879e-4526c990f899",
        dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f899",
        isEnable: true,
        parameterType: "minmax",
        parameterField: "totalPrice",
        parameterTitel: "totalPrice",
        isIDField: false,
        lookupID: null,
        lookupReturnField: null,
        lookupDisplayField: null,
        indexNumber: 0,
      },
      {
        dashboardFormSchemaParameterID: "270f513b-1788-4c01-879e-4526c990f899",
        dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f899",
        isEnable: true,
        parameterType: "minmax",
        parameterField: "downPayment",
        parameterTitel: "downPayment",
        isIDField: false,
        lookupID: null,
        lookupReturnField: null,
        lookupDisplayField: null,
        indexNumber: 0,
      },
      {
        dashboardFormSchemaParameterID: "370f513b-1788-4c01-879e-4526c990f899",
        dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f899",
        isEnable: true,
        parameterType: "minmax",
        parameterField: "discountPercentage",
        parameterTitel: "discountPercentage",
        isIDField: false,
        lookupID: null,
        lookupReturnField: null,
        lookupDisplayField: null,
        indexNumber: 0,
      },
      {
        dashboardFormSchemaParameterID: "170f513b-1788-4c01-879e-4526c990f899",
        dashboardFormSchemaID: "270f513b-1788-4c01-879e-4526c990f899",
        isEnable: true,
        parameterType: "minmax",
        parameterField: "cashbackAmount",
        parameterTitel: "cashbackAmount",
        isIDField: false,
        lookupID: null,
        lookupReturnField: null,
        lookupDisplayField: null,
        indexNumber: 0,
      },
    ],
    isMainSchema: true,
    dataSourceName: null,
    projectProxyRoute: "BrandingMartSecurity",
    propertyName: null,
    indexNumber: 0,
  },
];
const DynamicRangeSchema = ({
  selectedRow = {},
  fieldName,
  control,
  filtersMap,
  lookupID,
  lookupReturnField,
  lookupDisplayField,
}) => {
  const { data: schema, error } = useFetch(
    `/Dashboard/GetDashboardFormSchemaBySchemaID?DashboardFormSchemaID=${lookupID}`,
    defaultProjectProxyRouteWithoutBaseURL,
  );


  return (
    <View>
      {schema && (
        <BaseRange
          // key={schema?.idField}
          schema={schema}
          onLeafCheckChange={() => {
            console.log("====================================");
            console.log("onLeafCheckChange", "");
            console.log("====================================");
          }}
          onRowClick={() => {
            console.log("====================================");
            console.log("onRowClick", "");
            console.log("====================================");
          }}
          filtersMap={filtersMap}
        />
      )}
    </View>
  );
};

export default DynamicRangeSchema;
