import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { View, Text, Pressable, Switch, FlatList } from "react-native";
import { defaultProjectProxyRouteWithoutBaseURL } from "../../../request";
import ListOfKeywordsParameter from "../../components/form-container/inputs/ListOfKeywordsParameter";
import useFetch from "../../../components/hooks/APIsFunctions/useFetch";
import GetSchemaActionsUrl from "../../../components/hooks/DashboardAPIs/GetSchemaActionsUrl";
import reducer from "../../components/Pagination/reducer";
import { initialState } from "../../components/Pagination/initialState";
import { createRowCache } from "../../components/Pagination/createRowCache";
import { buildApiUrl } from "../../../components/hooks/APIsFunctions/BuildApiUrl";
import LoadData from "../../../components/hooks/APIsFunctions/LoadData";
import { updateRows } from "../../components/Pagination/updateRows";
import { string } from "yup";
import { theme } from "../../Theme";
import FormContainer from "../../components/form-container/FormContainer";
import { useForm } from "react-hook-form";
import { SelectParameter } from "../../components/form-container";

const VIRTUAL_PAGE_SIZE = 50;

const BaseRange = ({
  schema,
  rowDetails = {},
  subSchema = {},
  onRowClick,
  onLeafCheckChange,
  canUnchecked = false,
  canChecked = false,
  values = [],
  lookupDisplayField = "label",
  lookupReturnField = "value",
  setParentRow,
  parentID,
  filtersMap,
}) => {
    const {control}=useForm()
    const selectParam=schema.dashboardFormSchemaParameters.find((param)=>param.parameterType==='select')
    const { data: _schemaActions } = useFetch(
      GetSchemaActionsUrl(selectParam.lookupID),
      defaultProjectProxyRouteWithoutBaseURL,
    );
  const getAction =
    _schemaActions &&
    _schemaActions.find(
      (action) => action.dashboardFormActionMethodType === "Get",
    );

//   const [expandedRows, setExpandedRows] = useState([]);
//   const [selectedRow, setSelectedRow] = useState(null);

  const [state, dispatch] = useReducer(
    reducer,
    initialState(VIRTUAL_PAGE_SIZE, selectParam.parameterField),
  );

  const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), []);

  const dataSourceAPI = (query, skip, take) =>
    buildApiUrl(query, {
      pageIndex: skip + 1,
      pageSize: take,
      ...rowDetails,
    });

  useEffect(() => {
    if (!getAction) return;

    LoadData(
      state,
      dataSourceAPI,
      getAction,
      cache,
      updateRows(dispatch, cache, state),
      dispatch,
    );
  }, [getAction, rowDetails]);
  console.log('====================================');
  console.log('state',state,_schemaActions,getAction);
  console.log('====================================');

//   const columns = useMemo(() => {
//     if (!schema?.dashboardFormSchemaParameters) return [];

//     return schema.dashboardFormSchemaParameters
//       .filter((param) => !param.isIDField)
//       .map((param) => ({
//         name: param.parameterField,
//         title: param.parameterTitel,
//         type: param.parameterType,
//         lookupID: param.lookupID,
//         lookupDisplayField: param.lookupDisplayField,
//         lookupReturnField: param.lookupReturnField,
//       }));
//   }, [schema]);

//   const handleCheck = (row, keywords) => {
//     if (onLeafCheckChange) {
//       onLeafCheckChange({
//         row,
//         keywords,
//       });
//     }
//   };
//   const isLeaf = !subSchemas || subSchemas.length === 0;
//   const renderChildrenSchemas = (row) => {
//     if (!subSchemas || subSchemas.length === 0) return null;
//     const col = schema.dashboardFormSchemaParameters.find(
//       (param) => param.lookupID,
//     );
console.log('====================================');
console.log(control._formValues);
console.log('====================================');
    return (
      <View
        style={{
          marginLeft: 40,
          borderLeftWidth: 2,
          borderLeftColor: "#ddd",
          paddingLeft: 15,
          marginTop: 10,
        }}
      >
        <SelectParameter control={control} fieldName={selectParam.parameterField} lookupDisplayField={selectParam.lookupDisplayField} lookupReturnField={selectParam.lookupReturnField} value={''} values={state.rows}/>
        <FormContainer   tableSchema={subSchema}
  row={{}}
  errorResult={{}}
  control={control}/>
      </View>
    );
  };
export default BaseRange;
