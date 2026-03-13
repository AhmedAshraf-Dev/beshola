import React, {
    useEffect,
    useRef,
    useState
} from "react";
import { View } from "react-native";

import { fetchData } from "../../../components/hooks/APIsFunctions/useFetch";
import {
    defaultProjectProxyRouteWithoutBaseURL
} from "../../../request";
import BaseTree from "./BaseTree";
import BaseRange from "./BaseRange";
const testSchema = [{
  "dashboardFormSchemaID": "270f513b-1788-4c01-879e-4526c990f899",
  "schemaType": "rangeFilter",
  "idField": "id",
  "dashboardFormSchemaParameters": [
    {
      "dashboardFormSchemaParameterID": "param-price-minmax",
      "dashboardFormSchemaID": "270f513b-1788-4c01-879e-4526c990f899",
      "isEnable": true,
      "parameterType": "select",
      "parameterField": "currencyTypeID",
      "parameterTitel": "Currency",
      "isIDField": false,
      "lookupID": "9b9b04a2-360e-429b-95b7-102a46a96396",
      "lookupReturnField": "currencyTypeID",
      "lookupDisplayField": "currencyTypeShortName",
      "indexNumber": 0
    },
    {
      "dashboardFormSchemaParameterID": "param-price-minmax",
      "dashboardFormSchemaID": "270f513b-1788-4c01-879e-4526c990f899",
      "isEnable": true,
      "parameterType": "rangeSchema",
      "parameterField": "onlineAssetPricePlan",
      "parameterTitel": "Online Asset Price Plan",
      "isIDField": false,
      "lookupID": "270f513b-1788-4c01-879e-4526c990f899",
      "lookupReturnField": null,
      "lookupDisplayField": null,
      "indexNumber": 0
    }
  ],
  "isMainSchema": true,
  "dataSourceName": null,
  "projectProxyRoute": "BrandingMartSecurity",
  "propertyName": null,
  "indexNumber": 0
},{
  "dashboardFormSchemaID": "270f513b-1788-4c01-879e-4526c990f899",
  "schemaType": "rangeFilter",
  "idField": "id",
  "dashboardFormSchemaParameters": [
    {
      "dashboardFormSchemaParameterID": "param-price-minmax",
      "dashboardFormSchemaID": "270f513b-1788-4c01-879e-4526c990f899",
      "isEnable": true,
      "parameterType": "range",
      "parameterField": "totalPrice",
      "parameterTitel": "totalPrice",
      "isIDField": true,
      "lookupID":null,
      "lookupReturnField": null,
      "lookupDisplayField": null,
      "indexNumber": 0
    },
    {
      "dashboardFormSchemaParameterID": "param-price-minmax",
      "dashboardFormSchemaID": "270f513b-1788-4c01-879e-4526c990f899",
      "isEnable": true,
      "parameterType": "range",
      "parameterField": "downPayment",
      "parameterTitel": "downPayment",
      "isIDField": true,
      "lookupID":null,
      "lookupReturnField": null,
      "lookupDisplayField": null,
      "indexNumber": 0
    },
    {
      "dashboardFormSchemaParameterID": "param-price-minmax",
      "dashboardFormSchemaID": "270f513b-1788-4c01-879e-4526c990f899",
      "isEnable": true,
      "parameterType": "range",
      "parameterField": "discountPercentage",
      "parameterTitel": "discountPercentage",
      "isIDField": true,
      "lookupID":null,
      "lookupReturnField": null,
      "lookupDisplayField": null,
      "indexNumber": 0
    },
    {
      "dashboardFormSchemaParameterID": "param-price-minmax",
      "dashboardFormSchemaID": "270f513b-1788-4c01-879e-4526c990f899",
      "isEnable": true,
      "parameterType": "range",
      "parameterField": "cashbackAmount",
      "parameterTitel": "cashbackAmount",
      "isIDField": true,
      "lookupID":null,
      "lookupReturnField": null,
      "lookupDisplayField": null,
      "indexNumber": 0
    }
  ],
  "isMainSchema": true,
  "dataSourceName": null,
  "projectProxyRoute": "BrandingMartSecurity",
  "propertyName": null,
  "indexNumber": 0
}];
const DynamicRangeSchema= ({
  schema = testSchema[0],
  selectedRow = {},
  fieldName,
  control,
  filtersMap,
}) => {
//   const [subSchemas, setSubSchemas] = useState([]);
//   const [parentRow, setParentRow] = useState([]);
//   // const { setValue } = useFormContext();

//   // prevent duplicate fetch
//   const visitedLookups = useRef(new Set());

//   const GetSubSchemas = async (currentSchema) => {
//     if (!currentSchema) return;

//     const columns = currentSchema.dashboardFormSchemaParameters || [];

//     const firstLookupColumn = columns.find((col) => {
//       console.log("col.lookupID ", col.lookupID, col.parameterType);
//       return col.lookupID;
//     });

//     if (!firstLookupColumn) return;

//     const lookupID = firstLookupColumn.lookupID;

//     // prevent duplicate calls
//     if (visitedLookups.current.has(lookupID)) return;

//     visitedLookups.current.add(lookupID);

//     try {
//       const { data, error } = await fetchData(
//         `/Dashboard/GetDashboardFormSchemaBySchemaID?DashboardFormSchemaID=${lookupID}`,
//         defaultProjectProxyRouteWithoutBaseURL,
//       );

//       if (error || !data) return;

//       const schemas = Array.isArray(data) ? data : [data];

//       for (const schemaItem of schemas) {
//         setSubSchemas((prev) => [...prev, schemaItem]);

//         // recursive load
//         await GetSubSchemas(schemaItem);
//       }
//     } catch (err) {
//       console.error("Schema fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     const loadSchemas = async () => {
//       setSubSchemas([]);
//       visitedLookups.current.clear();

//       await GetSubSchemas(schema);
//     };

//     loadSchemas();
//   }, [schema]);
//   console.log("====================================");
//   console.log(parentRow, "parentRow");
//   console.log("====================================");
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
          // selectedRow={selectedRow}
          subSchema={testSchema[1]}
          filtersMap={filtersMap}
        />
      )}
    </View>
  );
};

export default DynamicRangeSchema;
