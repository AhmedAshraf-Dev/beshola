import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { View } from "react-native";

import Tree from "../../components/forms/DynamicTree/Tree";
import {
  defaultProjectProxyRoute,
  defaultProjectProxyRouteWithoutBaseURL,
} from "../../../request";
import { fetchData } from "../../../components/hooks/APIsFunctions/useFetch";
import BaseTree from "./BaseTree";
import { useFormContext } from "react-hook-form";
import { useSearch } from "../../../context/SearchProvider";
const testSchema = {
  dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
  schemaType: "Table",
  idField: "attributeID",
  dashboardFormSchemaInfoDTOView: {
    dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
    schemaHeader: "Attribute",
    addingHeader: "Add Attribute",
    editingHeader: "Edit Attribute",
  },
  dashboardFormSchemaParameters: [
    {
      dashboardFormSchemaParameterID: "dcd85c5d-0736-41e6-90b4-712fcc81960d",
      dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
      isEnable: true,
      parameterType: "text",
      parameterField: "attributeID",
      parameterTitel: "Attribute ID",
      parameterLookupTitel: "Attribute ID",
      isIDField: true,
      lookupID: null,
      lookupReturnField: null,
      lookupDisplayField: null,
      indexNumber: 1,
      isFilterOperation: false,
      dashboardFormSchemaParameterDependencies: [],
    },
    {
      dashboardFormSchemaParameterID: "e16f5661-96af-439d-8bc7-c465ecb8b31f",
      dashboardFormSchemaID: "937cdd0e-3303-447b-bd7c-f0f027e8ce78",
      isEnable: true,
      parameterType: "text",
      parameterField: "attributeName",
      parameterTitel: "Attribute Name",
      parameterLookupTitel: null,
      isIDField: false,
      lookupID: "188a7178-8a86-40bb-a127-0ec49b0b9b9d",
      lookupReturnField: "attributeValueID",
      lookupDisplayField: "attributeValue",
      indexNumber: 2,
      isFilterOperation: false,
      dashboardFormSchemaParameterDependencies: [],
    },
  ],
  projectProxyRoute: "BrandingMartDefinitions",
  isMainSchema: true,
  dataSourceName: "string",
  propertyName: "string",
  indexNumber: 0,
};
type DynamicTreeSchemaProps = {
  schema?: typeof testSchema;
  selectedRow?: Record<string, any>;
  fieldName?: string;
  control?: any;
  filtersMap?: Record<string, any>;
  value?: any;
  setValue?: any;
  lookupID?: any;
};

const DynamicTreeSchema = ({
  schema = testSchema,
  selectedRow = {},
  fieldName = "",
  control = null,
  filtersMap = new Map([]),
  value = [],
  lookupID = "",
  setValue = () => console.log("done tree"),
}: DynamicTreeSchemaProps) => {
  const [subSchemas, setSubSchemas] = useState([]);
  const [parentRow, setParentRow] = useState([]);

  const visitedLookups = useRef(new Set());
  const isLoadingRef = useRef(false);
  const lastValueRef = useRef(null);

  // 🔥 Recursive fetch
  const GetSubSchemas = async (currentSchema) => {
    if (!currentSchema) return;

    const columns = currentSchema.dashboardFormSchemaParameters || [];

    const firstLookupColumn = columns.find((col) => col.lookupID);

    if (!firstLookupColumn) return;

    const lookupID = firstLookupColumn.lookupID;

    console.log("🔍 Fetch Lookup:", lookupID);

    // prevent duplicate calls
    if (visitedLookups.current.has(lookupID)) {
      console.log("⛔ Skipped (already visited):", lookupID);
      return;
    }

    visitedLookups.current.add(lookupID);

    try {
      const { data, error } = await fetchData(
        `/Dashboard/GetDashboardFormSchemaBySchemaID?DashboardFormSchemaID=${lookupID}`,
        defaultProjectProxyRouteWithoutBaseURL,
      );

      if (error || !data) {
        console.log("❌ Fetch Error:", error);
        return;
      }

      const schemas = Array.isArray(data) ? data : [data];

      console.log("✅ Fetched Schemas:", schemas);

      for (const schemaItem of schemas) {
        console.log("📦 Adding SubSchema:", schemaItem);

        setSubSchemas((prev) => [...prev, schemaItem]);

        // recursive call
        await GetSubSchemas(schemaItem);
      }
    } catch (err) {
      console.error("❌ Schema fetch error:", err);
    }
  };

  // 🔥 Load schemas (protected from duplicate runs)
  useEffect(() => {
    const loadSchemas = async () => {
      if (isLoadingRef.current) {
        console.log("⛔ Already loading, skip...");
        return;
      }

      isLoadingRef.current = true;

      console.log("🚀 Start Loading Schemas");

      setSubSchemas([]);
      visitedLookups.current.clear();

      await GetSubSchemas(schema);

      console.log("🏁 Finished Loading Schemas");

      isLoadingRef.current = false;
    };

    if (schema) {
      console.log("📦 Schema Changed:", schema?.dashboardFormSchemaID);
      loadSchemas();
    }
  }, [schema]);

  // 🔥 Prevent repeated setValue
  useEffect(() => {
    const structured = parentRow;

    if (JSON.stringify(lastValueRef.current) === JSON.stringify(structured)) {
      return;
    }

    lastValueRef.current = structured;

    console.log("🌳 Final Tree Value:", structured);

    setValue(fieldName, structured);
  }, [parentRow]);

  return (
    <View>
      {schema && (
        <BaseTree
          schema={schema}
          subSchemas={subSchemas}
          filtersMap={filtersMap}
          fieldName={fieldName}
          parentRow={parentRow}
          setParentRow={(rows) => {
            console.log("🌲 setParentRow:", { tree: rows });
            setParentRow(rows);
          }}
          onLeafCheckChange={(data) => {
            console.log("🌿 onLeafCheckChange:", { tree: data });
          }}
          onRowClick={(row) => {
            console.log("🖱️ onRowClick:", { tree: row });
          }}
        />
      )}
    </View>
  );
};

export default DynamicTreeSchema;
